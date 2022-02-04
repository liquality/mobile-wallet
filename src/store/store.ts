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
import { BigNumber } from '@liquality/types'
import Wallet from '@liquality/core/dist/wallet'
import { Config } from '@liquality/core/dist/config'
import {
  AccountType,
  StateType,
  NetworkEnum,
  SwapProvidersEnum,
  IAccount,
  SwapPayloadType,
  SwapTransactionType,
  HistoryItem,
  IAsset,
} from '@liquality/core/dist/types'
import { currencyToUnit, assets as cryptoassets } from '@liquality/cryptoassets'
import 'react-native-reanimated'
import { INFURA_API_KEY } from '@env'
import { AssetDataElementType } from '../types'
import { Alert } from 'react-native'
import SwapProvider from '@liquality/core/dist/swaps/swap-provider'

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

wallet.on('onTransactionUpdate', (transaction: HistoryItem) => {
  store.dispatch({
    type: 'TRANSACTION_UPDATE',
    payload: {
      history: [
        ...(store.getState().history || []).filter((item) =>
          item.type === 'SEND'
            ? item.sendTransaction?.hash !== transaction.sendTransaction?.hash
            : item.swapTransaction?.id !== transaction.swapTransaction?.id,
        ),
        transaction,
      ],
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

export const populateWallet = async () => {
  await wallet
    .addAccounts(store.getState().activeNetwork || NetworkEnum.Mainnet)
    .then(() => {
      wallet.store(store.getState())
    })
    .catch((error) => {
      Alert.alert(`populateWallet: ${error}`)
    })
}
/**
 * A dispatch action that restores/decrypts the wallet
 * @param password
 */
export const restoreWallet = async (password: string): Promise<StateType> => {
  return await wallet.restore(password)
}

export const fetchTransactionUpdates = async () => {
  const activeNetwork = store.getState().activeNetwork
  if (!activeNetwork || !store) {
    return
  }

  const historyItems =
    store
      ?.getState()
      ?.history?.filter(
        (item) =>
          (item.type === 'SEND' && item.status !== 'SUCCESS') ||
          (item.type === 'SWAP' && item.status !== 'SUCCESS'),
      ) || []

  for (const item of historyItems) {
    const account = await wallet.getAccount(
      cryptoassets[item.from].chain,
      activeNetwork,
    )
    if (!account) {
      continue
    }
    const assets: IAsset[] = await account.getAssets()
    if (assets.length > 0 && item.sendTransaction) {
      assets[0].runRulesEngine(item.sendTransaction)
    }
  }
}

export const initSwaps = (): Partial<
  Record<SwapProvidersEnum, SwapProvider>
> => {
  return wallet.getSwapProviders()
}

export const performSwap = async (
  from: AssetDataElementType,
  to: AssetDataElementType,
  fromAmount: BigNumber,
  toAmount: BigNumber,
  fromNetworkFee: BigNumber,
  toNetworkFee: BigNumber,
  activeNetwork: NetworkEnum,
): Promise<Partial<SwapTransactionType> | void> => {
  const fromAccount: IAccount = wallet.getAccount(from.chain, activeNetwork)
  const toAccount: IAccount = wallet.getAccount(to.chain, activeNetwork)

  if (!fromAccount || !toAccount) {
    Alert.alert('Make sure to provide two accounts to perform a swap')
  }

  const swapProvider = wallet.getSwapProvider(SwapProvidersEnum.LIQUALITY)
  if (!swapProvider) {
    throw new Error('Failed to perform the swap')
  }

  const quote: Partial<SwapPayloadType> = {
    from: from.code,
    to: to.code,
    fromAmount: new BigNumber(
      currencyToUnit(cryptoassets[from.code], fromAmount.toNumber()),
    ),
    toAmount: new BigNumber(
      currencyToUnit(cryptoassets[to.code], toAmount.toNumber()),
    ),
    fee: fromNetworkFee.toNumber(),
    claimFee: toNetworkFee.toNumber(),
  }

  return await swapProvider
    .performSwap(fromAccount, toAccount, quote)
    .catch((error: any) => {
      Alert.alert('Failed to perform the swap: ' + error)
    })
}

export const getSwapStatuses = (swapProviderType: SwapProvidersEnum) => {
  return wallet.getSwapProvider(swapProviderType).statuses
}

export const sendTransaction = async (options: {
  activeNetwork: NetworkEnum
  asset: string
  to: string
  value: BigNumber
  fee: number
}): Promise<HistoryItem> => {
  if (!options || Object.keys(options).length === 0) {
    throw new Error(`Failed to send transaction: ${options}`)
  }

  const account = await wallet.getAccount(
    cryptoassets[options.asset].chain,
    options.activeNetwork,
  )
  const assets = await account.getAssets()
  return await assets[0].transmit(options)
}

export const speedUpTransaction = async (
  asset: string,
  activeNetwork: NetworkEnum,
  tx: string,
) => {
  const account = await wallet.getAccount(
    cryptoassets[asset].chain,
    activeNetwork,
  )

  return await account.speedUpTransaction(tx, 10000000000)
}
export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
