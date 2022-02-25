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
import {
  AccountType,
  HistoryItem,
  IAccount,
  IAsset,
  NetworkEnum,
  StateType,
  SwapPayloadType,
  SwapProvidersEnum,
  SwapTransactionType,
} from '@liquality/core/dist/types'
import { assets as cryptoassets, currencyToUnit } from '@liquality/cryptoassets'
import 'react-native-reanimated'
import { INFURA_API_KEY } from '@env'
import { AssetDataElementType } from '../types'
import { Alert } from 'react-native'
import SwapProvider from '@liquality/core/dist/swaps/swap-provider'
import { Config } from '@liquality/core/dist/config'
import Wallet from '@liquality/core/dist/wallet'
import CustomConfig from '../core/config'

//-------------------------1. CREATING AN INSTANCE OF THE WALLET--------------------------------------------------------
const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
const encryptionManager = new EncryptionManager()
const config = new Config(INFURA_API_KEY)
const wallet = new Wallet(storageManager, encryptionManager, config)

//-------------------------2. CONFIGURING THE STORE---------------------------------------------------------------------
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

//-------------------------3. REGISTERING THE CALLBACKS / SUBSCRIBING TO MEANINGFULL EVENTS-----------------------------
wallet.on('onMarketDataUpdate', (marketData) => {
  store.dispatch({
    type: 'UPDATE_MARKET_DATA',
    payload: {
      marketData,
    } as StateType,
  })
})

wallet.on('onTransactionUpdate', (transaction: HistoryItem) => {
  const {
    activeNetwork,
    activeWalletId,
    history: historyObject,
  } = store.getState()

  let historyItems: HistoryItem[] = []
  if (activeNetwork && activeWalletId && historyObject) {
    historyItems = historyObject?.[activeNetwork]?.[activeWalletId]
    store.dispatch({
      type: 'TRANSACTION_UPDATE',
      payload: {
        history: {
          ...historyObject,
          [activeNetwork]: {
            [activeWalletId]: [
              ...historyItems.filter((item) =>
                item.type === 'SEND'
                  ? item.sendTransaction?.hash !==
                    transaction.sendTransaction?.hash
                  : item.swapTransaction?.id !==
                    transaction.swapTransaction?.id,
              ),
              transaction,
            ],
          },
        },
      } as StateType,
    })
  }
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

//-------------------------PERFORMING ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = async (): Promise<boolean> => {
  try {
    const state = await wallet.restore()
    store.dispatch({ type: 'INIT_STORE', payload: state })
  } catch (e) {
    store.dispatch({ type: 'INIT_STORE', payload: {} })
  }
  return await wallet.isNewInstallation()
}

/**
 * Creates a brand new wallet
 * @param password
 * @param mnemonic
 */
export const createWallet = async (
  password: string,
  mnemonic: string,
): Promise<StateType> => {
  return await wallet.init(password, mnemonic, false)
}

/**
 * Populates an already instantiated wallet with account information
 */
export const populateWallet = async (): Promise<void> => {
  await wallet
    .addAccounts(store.getState().activeNetwork || NetworkEnum.Mainnet)
    .then(() => {
      wallet.store(store.getState())
    })
    .catch((error) => {
      Alert.alert(`populateWallet: ${error}`)
    })

  await getQuotes()
}

/**
 * Updates the config and populate the wallet accordingly
 */
export const updateWallet = async (): Promise<void> => {
  wallet.updateConfig(new CustomConfig(INFURA_API_KEY, store.getState()))
  await populateWallet()
}

/**
 * Restores an already created wallet from local storage
 * @param password
 */
export const restoreWallet = async (password: string): Promise<StateType> => {
  return await wallet.restore(password)
}

export const fetchTransactionUpdates = async (): Promise<void> => {
  const { activeNetwork, activeWalletId, history } = store.getState()
  if (!activeNetwork || !activeWalletId || !history) {
    return
  }

  const historyItems =
    history[activeNetwork]?.[activeWalletId]?.filter(
      (item) =>
        ['SEND', 'SWAP'].includes(item.type) &&
        !['SUCCESS', 'REFUNDED'].includes(item.status),
    ) || []

  for (const item of historyItems) {
    const fromAccount = await wallet.getAccount(
      cryptoassets[item.from].chain,
      activeNetwork,
    )
    const toAccount = await wallet.getAccount(
      cryptoassets[item.to].chain,
      activeNetwork,
    )
    if (!fromAccount || !toAccount) {
      continue
    }

    if (item.type === 'SWAP') {
      if (
        item.swapTransaction &&
        item.swapTransaction.from &&
        item.swapTransaction.to
      ) {
        wallet
          .getSwapProvider(SwapProvidersEnum.LIQUALITY)
          .runRulesEngine(fromAccount, toAccount, item.swapTransaction)
      }
    } else if (item.type === 'SEND') {
      const assets: IAsset[] = fromAccount.getAssets()
      if (assets.length > 0 && item.sendTransaction) {
        assets[0].runRulesEngine(item.sendTransaction)
      }
    }
  }
}

/**
 * Retrieves active swap providers from the wallet
 */
export const initSwaps = (): Partial<
  Record<SwapProvidersEnum, SwapProvider>
> => {
  return wallet.getSwapProviders()
}

/**
 * Performs a swap
 * @param swapProviderType
 * @param from
 * @param to
 * @param fromAmount
 * @param toAmount
 * @param fromNetworkFee
 * @param toNetworkFee
 * @param activeNetwork
 */
export const performSwap = async (
  swapProviderType: string,
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

  if (!fromAccount || !toAccount || !swapProviderType) {
    Alert.alert('Make sure to provide two accounts to perform a swap')
  }

  const swapProvider = wallet.getSwapProvider(
    swapProviderType.toUpperCase() as SwapProvidersEnum,
  )
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

/**
 * Retrieves the swap statuses we can display in the transaction timeline in transaction.details
 * @param swapProviderType
 */
export const getSwapStatuses = (swapProviderType: SwapProvidersEnum) => {
  return wallet.getSwapProvider(swapProviderType).statuses
}

/**
 * Performs a send operation
 * @param options
 */
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
  const assets = account.getAssets()
  return await assets[0].transmit(options)
}

/**
 * Speeds up an already submitted transaction
 * @param asset
 * @param activeNetwork
 * @param tx
 * @param newFee
 */
export const speedUpTransaction = async (
  asset: string,
  activeNetwork: NetworkEnum,
  tx: string,
  newFee: number,
) => {
  const account = await wallet.getAccount(
    cryptoassets[asset].chain,
    activeNetwork,
  )

  return await account.speedUpTransaction(tx, newFee)
}

export const getQuotes = async (
  from: string,
  to: string,
  amount: BigNumber,
) => {
  const quotes = []
  for (const provider of Object.values(wallet.getSwapProviders())) {
    const quote = await provider.getQuote(
      store.getState().marketData || [],
      from,
      to,
      amount,
    )

    if (quote) {
      quotes.push(quote)
    }
  }

  return quotes
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
