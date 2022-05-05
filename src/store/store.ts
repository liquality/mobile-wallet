import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import StorageManager from '../core/storage-manager'
import { BigNumber, FeeDetail } from '@liquality/types'
import 'react-native-reanimated'
import { setupWallet } from '@liquality/wallet-core'
import { currencyToUnit } from '@liquality/cryptoassets'
import cryptoassets from '@liquality/wallet-core/dist/utils/cryptoassets'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory/swapProvider'
import { AssetDataElementType, GasFees } from '../types'
import { WalletOptions, Notification } from '@liquality/wallet-core/dist/types'
import { decrypt, encrypt, Log, pbkdf2 } from '../utils'
import {
  getFeeAsset,
  getNativeAsset,
} from '@liquality/wallet-core/dist/utils/asset'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import {
  FeeLabel,
  Network,
  SwapHistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'

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
  wallet.original.subscribe((mutation, newState) => {
    // const types = ['NEW_SWAP', 'UPDATE_HISTORY']
    // const s = {
    //   type: 'NEW_SWAP',
    //   payload: {
    //     network: 'testnet',
    //     walletId: '57680bf6-3a43-4ac8-91da-c13617a05293',
    //     swap: {
    //       from: 'BTC',
    //       to: 'ETH',
    //       fromAmount: 80000,
    //       toAmount: 10752482664000000,
    //       provider: 'liquality',
    //       fromAccountId: '67863bb9-3731-46bc-8c27-9edaa3a42f3e',
    //       toAccountId: '297aca33-5af8-4cee-83d0-4425c82bfae7',
    //       fee: 1.00000192,
    //       claimFee: 36.67624307567235,
    //       type: 'SWAP',
    //       network: 'testnet',
    //       startTime: 1651624529098,
    //       walletId: '57680bf6-3a43-4ac8-91da-c13617a05293',
    //       orderId: '768a24e3-99f9-4ab5-b877-bc402b9aeb27',
    //       rate: 13.44060333,
    //       spread: 0.01,
    //       minConf: 1,
    //       expiresAt: 1651628129303,
    //       hasAgentUnconfirmedTx: false,
    //       status: 'INITIATED',
    //       userAgent: 'Wallet 1.4.31 (CAL 1.13.10)',
    //       swapExpiration: 1651631730,
    //       nodeSwapExpiration: 1651629930,
    //       fromCounterPartyAddress: 'tb1qq7twfgexcv695a3dr6y3hr9g5hrzw273xy77v5',
    //       toCounterPartyAddress: '0xcaC585A233083C2D15FFC1c3FDe6C3D18B7401b3',
    //       fromRateUsd: 37821,
    //       toRateUsd: 2788.09,
    //       fromAmountUsd: 30.26,
    //       toAmountUsd: 29.98,
    //       createdAt: '2022-05-04T00:35:29.321Z',
    //       updatedAt: '2022-05-04T00:35:29.321Z',
    //       totalAgentFeeUsd: 0,
    //       totalUserFeeUsd: 0,
    //       totalFeeUsd: 0,
    //       id: '768a24e3-99f9-4ab5-b877-bc402b9aeb27',
    //       fromAddress: 'tb1qrs97lfs262s5xpley7e4tzmzawfdw887rujrcz',
    //       toAddress: '1f49f22879c323514fd6fe069a20d381e432eb11',
    //       secret:
    //         'a60e8d7b51fb1cb70f7b77c062d34678a3ee4e7c39baeafb64f82bdd6e6c82d9',
    //       secretHash:
    //         'b3dec819e822ab450b33c54c475ec0af05f2a788ab5cf007a447ced35ca39fca',
    //       fromFundHash:
    //         '58d3615101bca5da1d036e6eff0c472f21bce48ca6ec7220f3741c4dd4617c6b',
    //       fromFundTx: {
    //         hash: '58d3615101bca5da1d036e6eff0c472f21bce48ca6ec7220f3741c4dd4617c6b',
    //         value: 192884,
    //         _raw: {
    //           txid: '58d3615101bca5da1d036e6eff0c472f21bce48ca6ec7220f3741c4dd4617c6b',
    //           hash: 'e146c60a0076c27ba45a62ba09b32470bed4c6ca3d37e99bd4f364bac576e9af',
    //           version: 2,
    //           locktime: 0,
    //           size: 235,
    //           vsize: 153,
    //           weight: 610,
    //           vin: [
    //             {
    //               txid: '3e461a23dbfce51980e7acabb7ae321e9fd46ba1dbcc2c060c81b9498fc641d4',
    //               vout: 1,
    //               scriptSig: { asm: '', hex: '' },
    //               txinwitness: [
    //                 '3045022100efa0f1d16e4c5f6ae0211f8ee4ee6a414852c66bff9a4b3e152c9484f68c0c9102203e9820d67d75b58c740ec75775d66a0dd934bcbadfeec14b1703f2a041d6690501',
    //                 '03ad6c9419f6c53f1712febe750259453523a439a1a955c6f0911ab5b9218549bc',
    //               ],
    //               sequence: 0,
    //             },
    //           ],
    //           vout: [
    //             {
    //               value: 0.0008,
    //               n: 0,
    //               scriptPubKey: {
    //                 asm: 'OP_0 39abe9bc53322479cf8e03d10ce7e0ae5a2445331f666f0abcf1237a436cbb45',
    //                 hex: '002039abe9bc53322479cf8e03d10ce7e0ae5a2445331f666f0abcf1237a436cbb45',
    //                 reqSigs: 1,
    //                 type: 'witness_v0_scripthash',
    //                 addresses: [
    //                   'tb1q8x47n0znxgj8nnuwq0gseelq4edzg3fnranx7z4u7y3h5smvhdzscxw0l5',
    //                 ],
    //               },
    //             },
    //             {
    //               value: 0.00112884,
    //               n: 1,
    //               scriptPubKey: {
    //                 asm: 'OP_0 6027ce5cb43fc86816936bfde48cd23629c1e87e',
    //                 hex: '00146027ce5cb43fc86816936bfde48cd23629c1e87e',
    //                 reqSigs: 1,
    //                 type: 'witness_v0_keyhash',
    //                 addresses: ['tb1qvqnuuh958lyxs95nd077frxjxc5ur6r73cd6kf'],
    //               },
    //             },
    //           ],
    //           hex: '02000000000101d441c68f49b9810c062cccdba16bd49f1e32aeb7abace78019e5fcdb231a463e01000000000000000002803801000000000022002039abe9bc53322479cf8e03d10ce7e0ae5a2445331f666f0abcf1237a436cbb45f4b80100000000001600146027ce5cb43fc86816936bfde48cd23629c1e87e02483045022100efa0f1d16e4c5f6ae0211f8ee4ee6a414852c66bff9a4b3e152c9484f68c0c9102203e9820d67d75b58c740ec75775d66a0dd934bcbadfeec14b1703f2a041d66905012103ad6c9419f6c53f1712febe750259453523a439a1a955c6f0911ab5b9218549bc00000000',
    //         },
    //         confirmations: 0,
    //         status: 'PENDING',
    //         fee: 452,
    //         feePrice: 3,
    //       },
    //       feeLabel: 'fast',
    //       claimFeeLabel: 'fast',
    //     },
    //   },
    // }
    // const update = {
    //   type: 'UPDATE_HISTORY',
    //   payload: {
    //     network: 'testnet',
    //     walletId: '57680bf6-3a43-4ac8-91da-c13617a05293',
    //     id: '768a24e3-99f9-4ab5-b877-bc402b9aeb27',
    //     updates: { status: 'READY_TO_CLAIM' },
    //   },
    // }
    // Log('Mutation: ' + JSON.stringify(mutation), 'info')
    if (mutation.type === 'NEW_SWAP') {
      const { network, walletId } = mutation.payload
      const historyItems = store.getState().history
      if (historyItems[network as Network]?.[walletId]) {
        const containsTransaction = historyItems[network as Network]![
          walletId
        ].find((item) => item.id === mutation.payload.swap.id)
        if (!containsTransaction) {
          historyItems[network as Network]![walletId].push({
            type: TransactionType.Swap,
            walletId,
            network,
            ...mutation.payload.swap,
          })
          store.dispatch({
            type: 'NEW_TRANSACTION',
            payload: { history: historyItems },
          })
        }
      }
    } else if (mutation.type === 'UPDATE_HISTORY') {
      const { id, network, walletId } = mutation.payload
      const historyCopy = store.getState().history
      let historyItems = historyCopy?.[network as Network]?.[walletId]
      if (historyItems) {
        historyCopy[network as Network]![walletId] = historyItems.map(
          (item) => {
            if (item.id === id) {
              return {
                ...item,
                ...mutation.payload.updates,
              }
            }

            return item
          },
        )
      }

      store.dispatch({
        type: 'TRANSACTION_UPDATE',
        payload: {
          history: historyCopy,
        },
      })
    } else {
      store.dispatch({
        type: 'UPDATE_WALLET',
        payload: newState,
      })
    }
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

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
