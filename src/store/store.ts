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
import { chains, currencyToUnit } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/utils/cryptoassets'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory'
import { AccountType, GasFees } from '../types'
import { Notification, WalletOptions } from '@liquality/wallet-core/dist/types'
import { decrypt, encrypt, Log, pbkdf2 } from '../utils'
import {
  getFeeAsset,
  getNativeAsset,
} from '@liquality/wallet-core/dist/utils/asset'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import {
  Account,
  FeeLabel,
  FiatRates,
  HistoryItem,
  MarketData,
  Network,
  SendHistoryItem,
  SwapHistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'
import {
  getSwapTimeline,
  TimelineStep,
} from '@liquality/wallet-core/dist/utils/timeline'
import { Asset, WalletId } from '@liquality/wallet-core/src/store/types'
import { v4 as uuidv4 } from 'uuid'
import { AtomEffect } from 'recoil'
// import dayjs from 'dayjs'

// Unwrap the type returned by a promise
type Awaited<T> = T extends PromiseLike<infer U> ? U : T

//-------------------------1. CREATE AN INSTANCE OF THE STORAGE MANAGER--------------------------------------------------------
const excludedProps: Array<keyof CustomRootState> = [
  'key',
  'wallets',
  'unlockedAt',
]
const storageManager = new StorageManager('@liquality-storage', excludedProps)
let wallet: Awaited<ReturnType<typeof setupWallet>>

//-------------------------2. CONFIGURE THE STORE---------------------------------------------------------------------
const persistenceMiddleware: Middleware<
  (action: PayloadAction<any>) => any,
  any
> = ({ getState }) => {
  return (next) => async (action) => {
    await storageManager.write({
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

//-------------------------3. REGISTER THE CALLBACKS / SUBSCRIBE TO MEANINGFULL EVENTS-----------------------------
export const initWallet = async (initialState?: CustomRootState) => {
  // const start = dayjs().unix()
  const walletOptions: WalletOptions = {
    initialState: initialState || {
      activeNetwork: Network.Testnet,
    },
    createNotification: (notification: Notification): any => {
      Log(notification.message, 'info')
    },
    crypto: {
      pbkdf2: pbkdf2,
      decrypt: decrypt,
      encrypt: encrypt,
    },
  }
  wallet = setupWallet(walletOptions)
  // wallet.original.subscribe((mutation) => {
  //   if (mutation.type === 'CREATE_WALLET') {
  //     console.log(mutation.type, dayjs().unix() - start, 'seconds')
  //   } else if (mutation.type === 'UPDATE_BALANCE') {
  //     console.log(
  //       mutation.type,
  //       mutation.payload.asset,
  //       dayjs().unix() - start,
  //       'seconds',
  //     )
  //   } else if (mutation.type === 'UPDATE_ACCOUNT_ADDRESSES') {
  //     console.log(mutation.type, dayjs().unix() - start, 'seconds')
  //   }
  // })

  return wallet
}

//-------------------------4. PERFORM ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = async (): Promise<boolean> => {
  const result = await storageManager.read()
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
  return wallet.state
}

/**
 * Populates an already instantiated wallet with account information
 */
export const populateWallet = async (): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet.state
  //TODO read this list for a config file
  const enabledAssets = [
    // 'BTC',
    'ETH',
    // 'DAI',
    // 'RBTC',
    // 'BNB',
    // 'NEAR',
    // 'SOV',
    // 'MATIC',
    // 'PWETH',
    // 'ARBETH',
    // 'SOL',
  ]

  wallet.dispatch
    .updateFiatRates({
      assets: enabledAssets,
    })
    .catch((e) => {
      Log(`Failed to update fiat rates: ${e}`, 'error')
    })

  wallet.dispatch
    .updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
      assets: enabledAssets,
    })
    .catch((e) => {
      Log(`Failed update balances: ${e}`, 'error')
    })

  retryPendingSwaps()
}

export const retrySwap = async (transaction: SwapHistoryItem) => {
  await wallet.dispatch.retrySwap({
    swap: transaction,
  })
}

export const retryPendingSwaps = async () => {
  const { activeNetwork, activeWalletId } = store.getState()
  const allTransactions =
    store.getState().history?.[activeNetwork]?.[activeWalletId] || []

  const promises = allTransactions
    .filter(
      (transaction) =>
        transaction.type === TransactionType.Swap &&
        !['SUCCESS', 'REFUNDED'].includes(transaction.status),
    )
    .map((transaction) =>
      wallet.dispatch.retrySwap({
        swap: transaction as SwapHistoryItem,
      }),
    )
  if (promises.length > 0) {
    await Promise.all(promises).catch((e) => Log(e, 'error'))
  }
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

export const updateMarketData = async (): Promise<void> => {
  const { activeNetwork } = store.getState()

  await wallet.dispatch
    .updateMarketData({
      network: activeNetwork,
    })
    .catch((e) => {
      Log(`Failed to update market data: ${e}`, 'error')
    })
}

/**
 * Toggle network between mainnet and testnet
 * @param network
 */
export const toggleNetwork = async (network: any): Promise<void> => {
  await wallet.dispatch.changeActiveNetwork(network)
  store.dispatch({
    type: 'NETWORK_UPDATE',
    payload: { activeNetwork: network },
  })
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
  const { activeNetwork, activeWalletId, enabledAssets } = wallet.state
  if (enabledAssets)
    await wallet.dispatch.updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
      assets: enabledAssets,
    })
}

/**
 * Restores an already created wallet from local storage
 * @param password
 */
export const restoreWallet = async (
  password: string,
): Promise<CustomRootState> => {
  const result = await storageManager.read()
  await initWallet(result)
  await wallet.dispatch.unlockWallet({
    key: password,
  })

  return {
    ...wallet.state,
    history: result.history,
  }
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
 * @param tx
 * @param newFee
 */
export const speedUpTransaction = async (
  id: string,
  hash: string,
  asset: string,
  activeNetwork: any,
  tx: string,
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
): Promise<SwapQuote[]> => {
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

export const accountsEffect: () => AtomEffect<AccountType[]> =
  () =>
  ({ setSelf }) => {
    wallet.original.subscribe((mutation) => {
      const { type } = mutation
      if (type === 'CREATE_ACCOUNT') {
        const { account }: { account: Account } = mutation.payload
        const nativeAsset = chains[account.chain].nativeAsset
        const newAccount: AccountType = {
          id: uuidv4(),
          chain: account.chain,
          name: account.name,
          code: nativeAsset,
          address: account.addresses[0], //TODO why pick only the first address
          color: account.color,
          assets: {},
          balance: 0,
        }

        for (const asset of account.assets) {
          newAccount.assets[asset] = {
            id: asset,
            name: cryptoassets[asset].name,
            code: asset,
            chain: account.chain,
            color: account.color,
            balance: 0,
            assets: {},
          }
        }
        setSelf(newAccount)
      }
    })
  }

export const walletEffect: () => AtomEffect<typeof wallet> =
  () =>
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      setSelf(wallet)
    }
  }

export const balanceEffect: (asset: string) => AtomEffect<number> =
  (asset) =>
  ({ setSelf, trigger }) => {
    // Initialize atom value to the remote storage state
    if (trigger === 'get') {
      // Avoid expensive initialization
      setSelf(0) // Call synchronously to initialize
    }

    // Subscribe to remote storage changes and update the atom value
    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation
      if (type === 'UPDATE_BALANCE') {
        if (payload.asset === asset) {
          setSelf(Number(payload.balance))
        }
      }
    })
  }

export const addressEffect: (accountId: string) => AtomEffect<string> =
  (accountId) =>
  ({ setSelf, trigger }) => {
    // Initialize atom value to the remote storage state
    if (trigger === 'get') {
      // Avoid expensive initialization
      setSelf('') // Call synchronously to initialize
    }

    // Subscribe to remote storage changes and update the atom value
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
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      setSelf(wallet.state.fiatRates)
    }

    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation

      if (type === 'UPDATE_FIAT_RATES') {
        setSelf(payload.fiatRates)
      }
    })
  }

export const marketDataEffect: () => AtomEffect<MarketData[]> =
  () =>
  ({ setSelf, trigger }) => {
    if (trigger === 'get') {
      const marketData = wallet.state.marketData[wallet.state.activeNetwork]
      if (marketData) setSelf(marketData)
    }

    wallet.original.subscribe((mutation) => {
      const { type, payload } = mutation

      if (type === 'UPDATE_MARKET_DATA') {
        setSelf(payload.marketData)
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
) => AtomEffect<HistoryItem> =
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

      // console.log('updates: ', type, mutation)
      if (type === 'UPDATE_HISTORY') {
        const { id, updates } = payload
        // console.log('updates: ', id, transactionId)
        if (id === transactionId) {
          const historyItem = wallet.getters.activity.find(
            (activity) => activity.id === transactionId,
          )
          if (historyItem) {
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
          }
        }
      }
    })
  }

//Infer the types from the rootReducer
export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
