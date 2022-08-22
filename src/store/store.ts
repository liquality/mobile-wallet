import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer, { CustomRootState } from '../reducers'
import StorageManager from '../core/storage-manager'
import { BigNumber, FeeDetail } from '@liquality/types'
import 'react-native-reanimated'
import { setupWallet } from '@liquality/wallet-core'
import { currencyToUnit } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/src/utils/cryptoassets'
import { AccountType, GasFees } from '../types'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import {
  Notification,
  WalletOptions,
} from '@liquality/wallet-core/dist/src/types'
import { decrypt, encrypt, Log, pbkdf2 } from '../utils'
import {
  getFeeAsset,
  getNativeAsset,
} from '@liquality/wallet-core/dist/src/utils/asset'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import {
  FeeLabel,
  FiatRates,
  HistoryItem,
  Network,
  SendHistoryItem,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import {
  getSwapTimeline,
  TimelineStep,
} from '@liquality/wallet-core/dist/src/utils/timeline'
import { Asset, WalletId } from '@liquality/wallet-core/dist/src/store/types'
import { AtomEffect, DefaultValue } from 'recoil'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'
import { showNotification } from './pushNotification'

// Unwrap the type returned by a promise
type Awaited<T> = T extends PromiseLike<infer U> ? U : T

//-------------------------1. CREATE AN INSTANCE OF THE STORAGE MANAGER--------------------------------------------------------
const excludedProps: Array<keyof CustomRootState> = [
  'key',
  'wallets',
  'unlockedAt',
]
const storageManager = new StorageManager(excludedProps)
let wallet: Awaited<ReturnType<typeof setupWallet>>

//-------------------------2. CONFIGURE THE STORE---------------------------------------------------------------------
const persistenceMiddleware: Middleware<
  (action: PayloadAction<any>) => any,
  any
> = ({ getState }) => {
  return (next) => async (action) => {
    await storageManager.write('@local-storage', {
      ...getState(),
      ...action.payload,
    })
    return next(action)
  }
}

const middlewares = new MiddlewareArray().concat([persistenceMiddleware, thunk])
if (__DEV__) {
  const createDebugger = require('redux-flipper').default
  middlewares.push(createDebugger())
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
  middleware: middlewares,
})

//-------------------------3. REGISTER THE CALLBACKS / SUBSCRIBE TO MEANINGFULL EVENTS-----------------------------
export const initWallet = async (initialState?: CustomRootState) => {
  const start = dayjs().unix()
  const walletOptions: WalletOptions = {
    initialState: initialState || {
      activeNetwork: Network.Testnet,
    },
    createNotification: (notification: Notification): any => {
      //When swap is completed show push notification with msg
      showNotification(notification.title, notification.message)
      Log(notification.message, 'info')
    },
    crypto: {
      pbkdf2: pbkdf2,
      decrypt: decrypt,
      encrypt: encrypt,
    },
  }
  wallet = setupWallet(walletOptions)
  wallet.original.subscribe((mutation) => {
    if (
      [
        'UPDATE_MULTIPLE_BALANCES',
        'CREATE_WALLET',
        'UPDATE_BALANCE',
        'UPDATE_ACCOUNT_ADDRESSES',
        'UPDATE_HISTORY',
      ].includes(mutation.type)
    ) {
      Log(`${mutation.type} ${dayjs().unix() - start} seconds`, 'info')
    }
  })

  return wallet
}

//-------------------------4. PERFORM ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = async (): Promise<boolean> => {
  const result = await storageManager.read('wallet')
  if (result) {
    store.dispatch({ type: 'INIT_STORE', payload: result })
    return false
  }

  return true
}

/**
 * Creates a brand new wallet
 * @param password
 * @param mnemonic
 */
export const createWallet = async (
  password: string,
  mnemonic: string,
): Promise<CustomRootState> => {
  await initWallet()
  await wallet.dispatch.createWallet({
    key: password,
    mnemonic: mnemonic,
    imported: true,
  })
  await storageManager.write('wallet', wallet.state)
  return wallet.state
}

/**
 * Populates an already instantiated wallet with account information
 */
export const populateWallet = async (): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet.state
  await wallet.dispatch
    .initializeAddresses({
      network: activeNetwork,
      walletId: activeWalletId,
    })
    .catch((e) => {
      Log(`Failed to initialize addresses: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
    })
    .catch((e) => {
      Log(`Failed update balances: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateFiatRates({
      assets: wallet.getters.networkAssets as string[],
    })
    .catch((e) => {
      Log(`Failed to update fiat rates: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateMarketData({
      network: activeNetwork,
    })
    .catch((e) => {
      Log(`Failed to update market data: ${e}`, 'error')
    })

  wallet.dispatch.checkPendingActions({
    walletId: activeWalletId,
  })
}

export const updateBalanceRatesMarketLoop = async (): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet?.state

  await wallet.dispatch
    .updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
    })
    .catch((e) => {
      Log(`Failed update balances: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateFiatRates({
      assets: wallet.getters.allNetworkAssets,
    })
    .catch((e) => {
      Log(`Failed to update fiat rates: ${e}`, 'error')
    })
}

export const retrySwap = async (transaction: SwapHistoryItem) => {
  await wallet.dispatch.retrySwap({
    swap: transaction,
  })
}

export const fetchFeesForAsset = async (asset: string): Promise<GasFees> => {
  const extractFee = (feeDetail: FeeDetail) => {
    if (typeof feeDetail.fee === 'number') {
      return feeDetail.fee
    } else {
      return (
        feeDetail.fee.maxPriorityFeePerGas +
        feeDetail.fee.suggestedBaseFeePerGas
      )
    }
  }

  const fees = await wallet.dispatch
    .updateFees({
      asset: getFeeAsset(asset) || getNativeAsset(asset),
    })
    .catch((e) => {
      Log(`Failed to update fees: ${e}`, 'error')
    })

  if (!fees) throw new Error('Failed to fetch gas fees')

  return {
    slow: new BigNumber(extractFee(fees.slow)),
    average: new BigNumber(extractFee(fees.average)),
    fast: new BigNumber(extractFee(fees.fast)),
    custom: new BigNumber(0),
  }
}

export const fetchSwapProvider = (providerId: string) => {
  const { activeNetwork } = store.getState()
  if (!providerId) return

  return getSwapProvider(activeNetwork, providerId)
}

/**
 * Toggle network between mainnet and testnet
 * @param network
 */
export const toggleNetwork = async (network: any): Promise<void> => {
  await wallet.dispatch.changeActiveNetwork(network)
  // store.dispatch({
  //   type: 'NETWORK_UPDATE',
  //   payload: { activeNetwork: network },
  // })
}

/**
 * Enable/Disable a given asset
 * @param asset
 * @param state
 */
export const toggleAsset = async (
  asset: string,
  state: boolean,
): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet.state

  if (state) {
    await wallet.dispatch.enableAssets({
      network: activeNetwork,
      walletId: activeWalletId,
      assets: [asset],
    })
  } else {
    await wallet.dispatch.disableAssets({
      network: activeNetwork,
      walletId: activeWalletId,
      assets: [asset],
    })
  }
}

/**
 * Updates the config and populate the wallet accordingly
 */
export const updateWallet = async (): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet.state
  await wallet.dispatch.updateBalances({
    network: activeNetwork,
    walletId: activeWalletId,
  })
}

/**
 * Restores an already created wallet from local storage
 * @param password
 */
export const restoreWallet = async (password: string): Promise<void> => {
  const result = await storageManager.read<RootState>('wallet')
  await initWallet(result)
  await wallet.dispatch.unlockWallet({
    key: password,
  })
}

export const checkPendingActionsInBackground = async () => {
  const { activeWalletId } = wallet.state
  return await wallet.dispatch.checkPendingActions({
    walletId: activeWalletId,
  })
}

/**
 * Performs a swap
 * @param from
 * @param to
 * @param fromAmount
 * @param toAmount
 * @param selectedQuote
 * @param fromNetworkFee
 * @param toNetworkFee
 * @param fromGasSpeed
 * @param toGasSpeed
 */
export const performSwap = async (
  from: AccountType,
  to: AccountType,
  fromAmount: BigNumber,
  toAmount: BigNumber,
  selectedQuote: any,
  fromNetworkFee: number,
  toNetworkFee: number,
  fromGasSpeed: FeeLabel,
  toGasSpeed: FeeLabel,
): Promise<SwapHistoryItem | void> => {
  const { activeWalletId, activeNetwork } = wallet.state

  const quote: SwapQuote = {
    ...selectedQuote,
    from: from.code,
    to: to.code,
    fromAmount: new BigNumber(
      currencyToUnit(cryptoassets[from.code], fromAmount.toNumber()),
    ),
    toAmount: new BigNumber(
      currencyToUnit(cryptoassets[to.code], toAmount.toNumber()),
    ),
    fee: fromNetworkFee,
    claimFee: toNetworkFee,
  }
  const params = {
    network: activeNetwork,
    walletId: activeWalletId,
    quote,
    fee: fromNetworkFee,
    claimFee: toNetworkFee,
    feeLabel: fromGasSpeed,
    claimFeeLabel: toGasSpeed,
  }

  return await wallet.dispatch.newSwap(params)
}

/**
 * Performs a send operation
 * @param options
 */
export const sendTransaction = async (options: {
  activeNetwork: any
  asset: string
  to: string
  value: BigNumber
  fee: number
  feeLabel: FeeLabel
  memo: string
}): Promise<SendHistoryItem> => {
  if (!options || Object.keys(options).length === 0) {
    throw new Error(`Failed to send transaction: ${options}`)
  }

  const { activeWalletId, activeNetwork, fiatRates } = wallet.state
  const { asset, to, value, fee, feeLabel, memo } = options
  const toAccount = wallet.getters.networkAccounts.find(
    (account) => account.assets && account.assets.includes(asset),
  )

  if (!toAccount) {
    throw new Error('Invalid account')
  }

  //TODO fee vs gas
  return await wallet.dispatch.sendTransaction({
    network: activeNetwork,
    walletId: activeWalletId,
    accountId: toAccount.id,
    asset,
    to,
    amount: value,
    fee,
    data: memo,
    feeLabel,
    fiatRate: fiatRates[asset],
    gas: undefined,
  })
}

export const fetchConfirmationByHash = async (
  asset: string,
  hash: string,
): Promise<number | undefined> => {
  const { activeWalletId, activeNetwork } = wallet.state
  const transaction = await wallet.getters
    .client({
      network: activeNetwork,
      walletId: activeWalletId,
      asset,
    })
    .chain.getTransactionByHash(hash)

  return transaction.confirmations
}

/**
 * Speeds up an already submitted transaction
 * @param id
 * @param hash
 * @param asset
 * @param activeNetwork
 * @param newFee
 */
export const speedUpTransaction = async (
  id: string,
  hash: string,
  asset: string,
  activeNetwork: any,
  newFee: number,
) => {
  const { activeWalletId } = wallet.state

  return await wallet.dispatch.updateTransactionFee({
    id,
    network: activeNetwork,
    walletId: activeWalletId,
    asset,
    hash,
    newFee,
  })
}

/**
 * Retrieve quotes that correspond to the passed in parameters
 * @param from
 * @param to
 * @param amount
 */
export const getQuotes = async (
  from: string,
  to: string,
  amount: BigNumber,
): Promise<SwapQuote[] | void> => {
  const { activeNetwork } = wallet.state
  const networkAccounts = wallet.getters.networkAccounts

  const fromAccount = networkAccounts.find(
    (account) => account.assets && account.assets.includes(from),
  )
  const toAccount = networkAccounts.find(
    (account) => account.assets && account.assets.includes(to),
  )

  if (!fromAccount?.id || !toAccount?.id) throw new Error('Missing account ids')

  return await wallet.dispatch.getQuotes({
    network: activeNetwork,
    from,
    to,
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    amount: amount.toString(),
  })
}

export const getTimeline = async (
  historyItem: SwapHistoryItem,
): Promise<TimelineStep[]> => {
  return await getSwapTimeline(
    historyItem,
    (options: { walletId: WalletId; network: Network; asset: Asset }) =>
      wallet.getters.client({
        network: options.network,
        walletId: options.walletId,
        asset: options.asset,
      }),
  )
}

export const balanceEffect: (assetObject: string) => AtomEffect<number> =
  (assetObject) =>
  ({ setSelf }) => {
    wallet.original.subscribe((mutation) => {
      const asset = assetObject.split('|')[0]
      const accountId = assetObject.split('|')[1]
      const { type, payload } = mutation
      if (
        accountId === payload.accountId &&
        type === 'UPDATE_BALANCE' &&
        payload.asset === asset
      ) {
        setSelf(Number(payload.balance))
      } else if (
        accountId === payload.accountId &&
        type === 'UPDATE_MULTIPLE_BALANCES' &&
        payload.assets.includes(asset)
      ) {
        setSelf(Number(payload.balances[payload.assets.indexOf(asset)]))
      }
    })
  }

export const addressEffect: (accountId: string) => AtomEffect<string> =
  (accountId) =>
  ({ setSelf }) => {
    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation
      if (type === 'UPDATE_ACCOUNT_ADDRESSES') {
        if (payload.accountId === accountId) {
          setSelf(payload.addresses[0])
        }
      }
    })
  }

export const fiatRateEffect: () => AtomEffect<FiatRates> =
  () =>
  ({ setSelf }) => {
    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation

      if (type === 'UPDATE_FIAT_RATES') {
        setSelf(payload.fiatRates)
      }
    })
  }

export const enabledAssetsEffect: () => AtomEffect<string[]> =
  () =>
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      const { activeNetwork, activeWalletId } = wallet.state
      setSelf(
        wallet.state?.enabledAssets?.[activeNetwork]?.[activeWalletId] || [],
      )
    }
  }

export const transactionHistoryEffect: (
  transactionId: string,
) => AtomEffect<Partial<HistoryItem>> =
  (transactionId) =>
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      const item = wallet.getters.activity.find(
        (activity) => activity.id === transactionId,
      )
      if (item) setSelf(item)
    }

    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation

      if (type === 'UPDATE_HISTORY') {
        const { id, updates } = payload
        if (id === transactionId) {
          const historyItem = wallet.getters.activity.find(
            (activity) => activity.id === transactionId,
          )
          if (historyItem) {
            if (historyItem.type === 'SEND') {
              fetchConfirmationByHash(
                historyItem.from,
                historyItem.hash || historyItem.tx?.hash,
              ).then((confirmations) => {
                setSelf({
                  ...historyItem,
                  tx: { ...historyItem.tx, confirmations },
                  ...updates,
                })
              })
            } else {
              setSelf({
                ...historyItem,
                ...updates,
              })
            }
          }
        }
      }
    })
  }

export const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key) =>
  ({ setSelf, onSet, trigger }) => {
    if (trigger === 'get') {
      setSelf(
        AsyncStorage.getItem(key).then((savedValue) => {
          return savedValue !== null
            ? JSON.parse(savedValue)
            : new DefaultValue()
        }),
      )
    }

    onSet((newValue, _, isReset) => {
      if (newValue instanceof DefaultValue && trigger === 'get') return
      isReset
        ? AsyncStorage.removeItem(key)
        : newValue !== null &&
          typeof newValue !== 'undefined' &&
          newValue !== -1
      AsyncStorage.setItem(key, JSON.stringify(newValue)).catch(() => {})
    })
  }

//Infer the types from the rootReducer
export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
