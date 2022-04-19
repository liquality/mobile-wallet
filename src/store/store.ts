import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import StorageManager from '../core/storage-manager'
import { BigNumber, FeeDetail, FeeDetails } from '@liquality/types'
import 'react-native-reanimated'
import { setupWallet } from '@liquality/wallet-core'
import { currencyToUnit } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/utils/cryptoassets'
import { AssetDataElementType, GasFees } from '../types'
import { WalletOptions, Notification } from '@liquality/wallet-core/dist/types'
import { decrypt, encrypt, Log, pbkdf2 } from '../utils'
import {
  getFeeAsset,
  getNativeAsset,
} from '@liquality/wallet-core/dist/utils/asset'

// Unwrap the type returned by a promise
type Awaited<T> = T extends PromiseLike<infer U> ? U : T

//-------------------------1. CREATE AN INSTANCE OF THE STORAGE MANAGER--------------------------------------------------------
const excludedProps: Array<keyof any> = ['key', 'wallets', 'unlockedAt']
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
export const initWallet = async () => {
  const walletOptions: WalletOptions = {
    initialState: {
      activeNetwork: 'testnet',
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
  wallet.original.subscribe((mutation, newState) => {
    // console.log('---->', JSON.stringify(newState))
    store.dispatch({
      type: 'UPDATE_WALLET',
      payload: newState,
    })
  })
}

//-------------------------4. PERFORM ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = async (): Promise<boolean> => {
  const result = await storageManager.read()
  if (result) {
    store.dispatch({ type: 'INIT_STORE', payload: result })
    return true
  }

  return false
}

/**
 * Creates a brand new wallet
 * @param password
 * @param mnemonic
 */
export const createWallet = async (
  password: string,
  mnemonic: string,
): Promise<any> => {
  await initWallet()
  await wallet.dispatch.createWallet({
    key: password,
    mnemonic: mnemonic,
    imported: true,
  })
}

/**
 * Populates an already instantiated wallet with account information
 */
export const populateWallet = async (): Promise<void> => {
  const { activeNetwork, activeWalletId } = wallet.state
  const enabledAssets = [
    'BTC',
    'ETH',
    'DAI',
    'RBTC',
    'BNB',
    'NEAR',
    'SOV',
    'MATIC',
    'PWETH',
    'ARBETH',
    'SOL',
    'LUNA',
    'UST',
  ]

  await wallet.dispatch
    .changeActiveNetwork({
      network: activeNetwork || 'testnet',
    })
    .catch((e) => {
      Log(`Failed to change active network: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateMarketData({
      network: activeNetwork,
    })
    .catch((e) => {
      Log(`Failed to update market data: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
      assets: enabledAssets,
    })
    .catch((e) => {
      Log(`Failed update balances: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateFiatRates({
      assets: enabledAssets,
    })
    .catch((e) => {
      Log(`Failed to update fiat rates: ${e}`, 'error')
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

  const fees: FeeDetails = await wallet.dispatch
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
  return wallet.getters.swapProvider(activeNetwork, providerId)
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
export const restoreWallet = async (password: string): Promise<any> => {
  await wallet.dispatch.unlockWallet({
    key: password,
  })
}

/**
 * Retrieves active swap providers from the wallet
 */
export const initSwaps = (): Partial<Record<any, any>> => {
  // return wallet.getSwapProviders()
  return {}
}

/**
 * Performs a swap
 * @param from
 * @param to
 * @param fromAmount
 * @param toAmount
 * @param fromNetworkFee
 * @param toNetworkFee
 * @param fromGasSpeed
 * @param toGasSpeed
 */
export const performSwap = async (
  from: AssetDataElementType,
  to: AssetDataElementType,
  fromAmount: BigNumber,
  toAmount: BigNumber,
  fromNetworkFee: BigNumber,
  toNetworkFee: BigNumber,
  fromGasSpeed: string,
  toGasSpeed: string,
): Promise<Partial<any> | void> => {
  const { activeWalletId, activeNetwork } = wallet.state

  const quote: Partial<any> = {
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

  return await wallet.dispatch.newSwap({
    network: activeNetwork,
    walletId: activeWalletId,
    quote,
    fee: fromNetworkFee.toNumber(),
    claimFee: toNetworkFee,
    feeLabel: fromGasSpeed,
    claimFeeLabel: toGasSpeed,
  })
}

/**
 * Retrieves the swap statuses we can display in the transaction timeline in transaction.details
 * @param swapProviderType
 */
// export const getSwapStatuses = (swapProviderType: any) => {
//   // return wallet.getSwapProvider(swapProviderType).statuses
//   return {}
// }

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
}): Promise<any> => {
  if (!options || Object.keys(options).length === 0) {
    throw new Error(`Failed to send transaction: ${options}`)
  }

  const { activeWalletId, activeNetwork, accounts } = wallet.state
  const { asset, to, value, fee } = options

  //TODO populate the undefined values
  return await wallet.dispatch.sendTransaction({
    network: activeNetwork,
    walletId: activeWalletId,
    accountId: accounts[activeWalletId][activeNetwork][0]?.id,
    asset,
    to,
    amount: value,
    fee,
    data: undefined,
    feeLabel: undefined,
    fiatRate: undefined,
    gas: undefined,
  })
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
): Promise<any> => {
  const { activeNetwork } = wallet.state
  const networkAccounts = wallet.getters.networkAccounts

  const fromAccount = networkAccounts.find(
    (account) => account.assets && account.assets.includes(from),
  )
  const toAccount = networkAccounts.find(
    (account) => account.assets && account.assets.includes(to),
  )

  return await wallet.dispatch.getQuotes({
    network: activeNetwork,
    from,
    to,
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    amount: amount,
  })
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
