import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import StorageManager from '../core/storage-manager'
import { BigNumber } from '@liquality/types'
import 'react-native-reanimated'
import { wallet } from '@liquality/wallet-core'

//-------------------------1. CREATING AN INSTANCE OF THE WALLET--------------------------------------------------------
const excludedProps: Array<keyof any> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
// const config = new Config(INFURA_API_KEY)
// const wallet = new Wallet(storageManager, encryptionManager, config)

const SEED =
  'obvious digital bronze kangaroo crew basic drink liquid secret unveil dose conduct'
//-------------------------2. CONFIGURING THE STORE---------------------------------------------------------------------
const persistenceMiddleware: Middleware<
  (action: PayloadAction<any>) => any,
  any
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
// wallet.on('onMarketDataUpdate', (marketData) => {
//   store.dispatch({
//     type: 'UPDATE_MARKET_DATA',
//     payload: {
//       marketData,
//     } as any,
//   })
// })
//
// wallet.on('onTransactionUpdate', (transaction: any) => {
//   const {
//     activeNetwork,
//     activeWalletId,
//     history: historyObject,
//   } = store.getState()
//
//   let historyItems: any[] = []
//   if (activeNetwork && activeWalletId && historyObject) {
//     historyItems = historyObject?.[activeNetwork]?.[activeWalletId]
//     store.dispatch({
//       type: 'TRANSACTION_UPDATE',
//       payload: {
//         history: {
//           ...historyObject,
//           [activeNetwork]: {
//             [activeWalletId]: [
//               ...historyItems.filter((item) =>
//                 item.type === 'SEND'
//                   ? item.sendTransaction?.hash !==
//                     transaction.sendTransaction?.hash
//                   : item.swapTransaction?.id !==
//                     transaction.swapTransaction?.id,
//               ),
//               transaction,
//             ],
//           },
//         },
//       } as any,
//     })
//   }
// })

//Subscribe to account updates
// wallet.subscribe((account: any) => {
//   const walletState = store.getState()
//   const { activeWalletId, activeNetwork } = walletState
//
//   if (activeWalletId && activeNetwork) {
//     const existingAccounts: any[] =
//       walletState?.accounts?.[activeWalletId][activeNetwork] || []
//
//     if (walletState.accounts) {
//       if (existingAccounts.length === 0) {
//         walletState.accounts[activeWalletId][activeNetwork] = [account]
//       } else {
//         const index = existingAccounts.findIndex(
//           (item) => item.name === account.name,
//         )
//         if (index >= 0) {
//           walletState.accounts[activeWalletId][activeNetwork][index] = account
//         } else {
//           walletState.accounts[activeWalletId][activeNetwork]?.push(account)
//         }
//       }
//     }
//
//     Object.assign(walletState.fiatRates, account.fiatRates)
//
//     if (walletState.fees && account.feeDetails) {
//       walletState.fees[activeNetwork][activeWalletId][account.chain] =
//         account.feeDetails
//     }
//
//     store.dispatch({
//       type: 'UPDATE_WALLET',
//       payload: walletState,
//     })
//   }
// })

//-------------------------PERFORMING ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = async (): Promise<boolean> => {
  // try {
  //   const state = await wallet.restore()
  //   store.dispatch({ type: 'INIT_STORE', payload: state })
  // } catch (e) {
  //   store.dispatch({ type: 'INIT_STORE', payload: {} })
  // }
  // return await wallet.isNewInstallation()
  return Promise.resolve(true)
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
  // return await wallet.init(password, mnemonic, false)
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
  // await wallet
  //   .addAccounts(store.getState().activeNetwork || 'mainnet')
  //   .then(() => {
  //     wallet.store(store.getState())
  //   })
  //   .catch((error) => {
  //     Alert.alert(`populateWallet: ${error}`)
  //   })
  //
  // await getQuotes()

  await wallet.dispatch.changeActiveNetwork({
    walletId: wallet.state.activeWalletId,
    network: 'testnet',
  })

  await wallet.dispatch.updateBalances({
    network: wallet.state.activeNetwork,
    walletId: wallet.state.activeWalletId,
    assets: ['ETH', 'MATIC'],
  })
}

/**
 * Updates the config and populate the wallet accordingly
 */
export const updateWallet = async (): Promise<void> => {
  // wallet.updateConfig(new CustomConfig(INFURA_API_KEY, store.getState()))
  // await populateWallet()
  await wallet.dispatch.updateBalances({
    network: wallet.state.activeNetwork,
    walletId: wallet.state.activeWalletId,
    assets: ['ETH', 'MATIC'],
  })
}

/**
 * Restores an already created wallet from local storage
 * @param password
 */
export const restoreWallet = async (password: string): Promise<any> => {
  // return await wallet.restore(password)
  await wallet.dispatch.createWallet({
    key: password,
    mnemonic: SEED,
    imported: true,
  })
}

export const fetchTransactionUpdates = async (): Promise<void> => {
  // const { activeNetwork, activeWalletId, history } = store.getState()
  // if (!activeNetwork || !activeWalletId || !history) {
  //   return
  // }
  //
  // const historyItems =
  //   history[activeNetwork]?.[activeWalletId]?.filter(
  //     (item) =>
  //       ['SEND', 'SWAP'].includes(item.type) &&
  //       !['SUCCESS', 'REFUNDED'].includes(item.status),
  //   ) || []
  //
  // for (const item of historyItems) {
  //   const fromAccount = await wallet.getAccount(
  //     cryptoassets[item.from].chain,
  //     activeNetwork,
  //   )
  //   const toAccount = await wallet.getAccount(
  //     cryptoassets[item.to].chain,
  //     activeNetwork,
  //   )
  //   if (!fromAccount || !toAccount) {
  //     continue
  //   }
  //
  //   if (item.type === 'SWAP') {
  //     if (
  //       item.swapTransaction &&
  //       item.swapTransaction.from &&
  //       item.swapTransaction.to
  //     ) {
  //       wallet
  //         .getSwapProvider('LIQUALITY')
  //         .runRulesEngine(fromAccount, toAccount, item.swapTransaction)
  //     }
  //   } else if (item.type === 'SEND') {
  //     const assets: any[] = fromAccount.getAssets()
  //     if (assets.length > 0 && item.sendTransaction) {
  //       assets[0].runRulesEngine(item.sendTransaction)
  //     }
  //   }
  // }
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
 * @param swapProviderType
 * @param from
 * @param to
 * @param fromAmount
 * @param toAmount
 * @param fromNetworkFee
 * @param toNetworkFee
 * @param activeNetwork
 */
// export const performSwap = async (
//   swapProviderType: string,
//   from: AssetDataElementType,
//   to: AssetDataElementType,
//   fromAmount: BigNumber,
//   toAmount: BigNumber,
//   fromNetworkFee: BigNumber,
//   toNetworkFee: BigNumber,
//   activeNetwork: any,
// ): Promise<Partial<any> | void> => {
//   // const fromAccount: any = wallet.getAccount(from.chain, activeNetwork)
//   // const toAccount: any = wallet.getAccount(to.chain, activeNetwork)
//   //
//   // if (!fromAccount || !toAccount || !swapProviderType) {
//   //   Alert.alert('Make sure to provide two accounts to perform a swap')
//   // }
//   //
//   // const swapProvider = wallet.getSwapProvider(swapProviderType.toUpperCase())
//   // if (!swapProvider) {
//   //   throw new Error('Failed to perform the swap')
//   // }
//   //
//   // const quote: Partial<any> = {
//   //   from: from.code,
//   //   to: to.code,
//   //   fromAmount: new BigNumber(
//   //     currencyToUnit(cryptoassets[from.code], fromAmount.toNumber()),
//   //   ),
//   //   toAmount: new BigNumber(
//   //     currencyToUnit(cryptoassets[to.code], toAmount.toNumber()),
//   //   ),
//   //   fee: fromNetworkFee.toNumber(),
//   //   claimFee: toNetworkFee.toNumber(),
//   // }
//   //
//   // return await swapProvider
//   //   .performSwap(fromAccount, toAccount, quote)
//   //   .catch((error: any) => {
//   //     Alert.alert('Failed to perform the swap: ' + error)
//   //   })
//
//   return Promise.resolve({})
// }

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

  // const account = await wallet.getAccount(
  //   cryptoassets[options.asset].chain,
  //   options.activeNetwork,
  // )
  // const assets = account.getAssets()
  // return await assets[0].transmit(options)

  return Promise.resolve({})
}

/**
 * Speeds up an already submitted transaction
 * @param asset
 * @param activeNetwork
 * @param tx
 * @param newFee
 */
// export const speedUpTransaction = async (
//   asset: string,
//   activeNetwork: any,
//   tx: string,
//   newFee: number,
// ) => {
//   // const account = await wallet.getAccount(
//   //   cryptoassets[asset].chain,
//   //   activeNetwork,
//   // )
//   //
//   // return await account.speedUpTransaction(tx, newFee)
//   return Promise.resolve({})
// }

// export const getQuotes = async (
//   from: string,
//   to: string,
//   amount: BigNumber,
// ) => {
//   // const quotes = []
//   // for (const provider of Object.values(wallet.getSwapProviders())) {
//   //   const quote = await provider.getQuote(
//   //     store.getState().marketData || [],
//   //     from,
//   //     to,
//   //     amount,
//   //   )
//   //
//   //   if (quote) {
//   //     quotes.push(quote)
//   //   }
//   // }
//   //
//   // return quotes
//   return []
// }

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
