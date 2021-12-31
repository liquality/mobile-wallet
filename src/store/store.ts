import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import StorageManager from '../core/storage-manager'
import EncryptionManager from '../core/encryption-manager'
import { BigNumber, SendOptions, Transaction } from '@liquality/types'
import Wallet from '@liquality/core/dist/wallet'
import { Config } from '@liquality/core/dist/config'
import {
  AccountType,
  StateType,
  NetworkEnum,
  SwapProvidersEnum,
  IAccount,
} from '@liquality/core/dist/types'
import { ChainId } from '@liquality/cryptoassets'
import 'react-native-reanimated'
import { INFURA_API_KEY } from '@env'
import { AssetDataElementType } from '../types'
import { Alert } from 'react-native'

const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
const encryptionManager = new EncryptionManager()
const config = new Config(INFURA_API_KEY)
const wallet = new Wallet(storageManager, encryptionManager, config)

//Subscribe to market data updates
wallet.on('onMarketDataUpdate', (marketData) => {
  store.dispatch({
    type: 'UPDATE_MARKET_DATA',
    payload: {
      marketData,
    } as StateType,
  })
})

//Subscribe to account updates
wallet.subscribe((account: AccountType) => {
  const walletState = store.getState()
  const { activeWalletId, activeNetwork } = walletState

  if (activeWalletId && activeNetwork) {
    const existingAccounts: AccountType[] =
      walletState?.accounts?.[activeWalletId][activeNetwork] || []

    if (walletState.accounts) {
      if (existingAccounts.length === 0) {
        walletState.accounts[activeWalletId][activeNetwork] = [account]
      } else {
        const index = existingAccounts.findIndex(
          (item) => item.name === account.name,
        )
        if (index >= 0) {
          walletState.accounts[activeWalletId][activeNetwork][index] = account
        } else {
          walletState.accounts[activeWalletId][activeNetwork]?.push(account)
        }
      }
    }

    Object.assign(walletState.fiatRates, account.fiatRates)

    if (walletState.fees && account.feeDetails) {
      walletState.fees[activeNetwork][activeWalletId][account.chain] =
        account.feeDetails
    }

    store.dispatch({
      type: 'UPDATE_WALLET',
      payload: walletState,
    })
  }
})

const persistenceMiddleware: Middleware<
  (action: PayloadAction<StateType>) => StateType,
  StateType
> = ({ getState }) => {
  return (next) => (action) => {
    storageManager.write({
      ...getState(),
      ...action.payload,
    })
    return next(action)
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
  middleware: new MiddlewareArray().concat([persistenceMiddleware, thunk]),
})

export const isNewInstallation = async (): Promise<boolean> => {
  try {
    const state = await wallet.restore()
    store.dispatch({ type: 'INIT_STORE', payload: state })
  } catch (e) {
    store.dispatch({ type: 'INIT_STORE', payload: {} })
  }
  return await wallet.isNewInstallation()
}

export const retrieveSwapRates = async () => {
  // wallet.
}

//TODO Use slices and async thunks instead
export const createWallet = async (
  password: string,
  mnemonic: string,
): Promise<StateType> => {
  return await wallet.init(password, mnemonic, false)
}

export const populateWallet = () => {
  wallet
    .addAccounts(store.getState().activeNetwork || NetworkEnum.Mainnet)
    .then(() => {
      wallet.store(store.getState())
    })
}
/**
 * A dispatch action that restores/decrypts the wallet
 * @param password
 */
export const restoreWallet = async (password: string): Promise<StateType> => {
  return await wallet.restore(password)
}

export const initSwaps = () => {
  wallet.getSwapProvider(SwapProvidersEnum.LIQUALITY)
}

export const performSwap = async (
  from: AssetDataElementType,
  to: AssetDataElementType,
  fromAmount: BigNumber,
  toAmount: BigNumber,
) => {
  const fromAccount: IAccount = wallet.getAccount(
    from.chain,
    store.getState().activeNetwork,
  )
  const toAccount: IAccount = wallet.getAccount(
    to.chain,
    store.getState().activeNetwork,
  )

  if (!fromAccount || !toAccount) {
    Alert.alert('Make sure to provide two accounts to perform a swap')
  }

  const fromAssets = (await fromAccount.getAssets()) || []
  const fromAsset =
    fromAssets.length === 0 ? from.code : fromAssets[0].getSymbol()
  const swapProvider = wallet.getSwapProvider(SwapProvidersEnum.LIQUALITY)
  if (!fromAsset || !swapProvider) {
    throw new Error('Failed to perform the swap')
  }

  // Send: undefined (lowest denomination) tb1qny4rdm3376uh0szgduep90hnl7urudzdfk3yer
  // Receive: 0.025 (lowest denomination) 3f429e2212718a717bd7f9e83ca47dab7956447b
  // My tb1qny4rdm3376uh0szgduep90hnl7urudzdfk3yer Address: tb1qnyam5rm4l7298640xs7s02e7fjckes5xsva3xt
  // My 3f429e2212718a717bd7f9e83ca47dab7956447b Address: 3f429e2212718a717bd7f9e83ca47dab7956447b
  // Counterparty tb1qny4rdm3376uh0szgduep90hnl7urudzdfk3yer Address: undefined
  // Counterparty 3f429e2212718a717bd7f9e83ca47dab7956447b Address: undefined
  // Timestamp: undefined
  const quote = {
    from: (await fromAccount.getUsedAddress()).address,
    to: (await toAccount.getUsedAddress()).address,
    fromAmount: fromAmount,
    toAmount: toAmount,
  }

  const transaction = await swapProvider.performSwap(
    fromAccount,
    toAccount,
    fromAsset,
    quote,
  )

  return transaction
}

export const sendTransaction = async (
  options: SendOptions,
): Promise<Transaction | Error> => {
  if (!options || Object.keys(options).length === 0) {
    throw new Error(`Failed to send transaction: ${options}`)
  }

  try {
    const account = await wallet.getAccount(
      ChainId.Ethereum,
      NetworkEnum.Testnet,
    )
    const assets = await account.getAssets()
    return await assets[0].transmit(options)
  } catch (e) {
    return new Error('Failed to send transaction')
  }
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
