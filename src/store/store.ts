import StorageManager from '../core/storage-manager'
import { BigNumber } from '@liquality/types'
import { FeeDetail } from '@chainify/types'
import 'react-native-reanimated'
import { setupWallet } from '@liquality/wallet-core'
import { currencyToUnit, getAsset } from '@liquality/cryptoassets'
import { AccountType, CustomRootState, GasFees, NftAsset } from '../types'
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
  NFTWithAccount,
  SendHistoryItem,
  SwapHistoryItem,
  Asset,
  WalletId,
  NFTSendTransactionParams,
} from '@liquality/wallet-core/dist/src/store/types'
import {
  getSwapTimeline,
  TimelineStep,
} from '@liquality/wallet-core/dist/src/utils/timeline'
import { AtomEffect, DefaultValue } from 'recoil'
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
export const storageManager = new StorageManager(excludedProps)
let wallet: Awaited<ReturnType<typeof setupWallet>>

//-------------------------2. REGISTER THE CALLBACKS / SUBSCRIBE TO MEANINGFULL EVENTS-----------------------------
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

//-------------------------3. PERFORM ACTIONS ON THE WALLET-------------------------------------------------------------
export const isNewInstallation = (): boolean => {
  const result = storageManager.read<Object>('wallet', {})
  return !(result && Object.keys(result).length > 0)
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
  storageManager.write('wallet', wallet.state)
  return wallet.state as CustomRootState
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
  const allAccounts = wallet.getters.accountsData
  const account = allAccounts[Math.floor(Math.random() * allAccounts.length)]

  await wallet.dispatch
    .updateBalances({
      network: activeNetwork,
      walletId: activeWalletId,
      accountIds: [account.id],
    })
    .catch((e) => {
      Log(`Failed update balances: ${e}`, 'error')
    })

  await wallet.dispatch
    .updateFiatRates({
      assets: account.assets,
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
      const { suggestedBaseFeePerGas, maxPriorityFeePerGas } = feeDetail.fee
      return suggestedBaseFeePerGas
        ? maxPriorityFeePerGas + suggestedBaseFeePerGas
        : maxPriorityFeePerGas
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
  const { activeNetwork } = wallet.state
  if (!providerId) return

  return getSwapProvider(activeNetwork, providerId)
}

/**
 * Toggle network between mainnet and testnet
 * @param network
 */
export const toggleNetwork = async (network: Network): Promise<void> => {
  await wallet.dispatch.changeActiveNetwork({ network })
}

/**
 * Update NFTs to refresh nft info for all accounts
 * @param paramObj
 */
export const updateNFTs = async (paramObj: {
  walletId: string
  network: Network
  accountIds: string[]
}): Promise<void> => {
  if (wallet) {
    await wallet.dispatch.updateNFTs(paramObj).catch((e) => {
      Log(`Failed to FETCH NFTS: ${e}`, 'error')
    })
  } else Log(`Failed to fetch WALLET DISPATCH: ${wallet}`, 'error')
}

/**
 * Send NFT transaction
 * @param paramObj
 */
export const sendNFTTransaction = async (
  paramObj: NFTSendTransactionParams,
): Promise<void> => {
  await wallet.dispatch.sendNFTTransaction(paramObj).catch((e) => {
    Log(`Failed to SEND NFTs: ${e}`, 'error')
  })
}

export const getNftsForAccount = async (
  accountId: string,
): Promise<NFTWithAccount> => {
  return wallet.getters.accountNftCollections(accountId)
}

export const toggleNFTStarred = async (payload: {
  network: Network
  walletId: string
  accountId: string
  nft: NftAsset
}) => {
  await wallet.dispatch.toggleNFTStarred(payload)
}

export const getAllEnabledAccounts = async () => {
  return wallet.getters.accountsData
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
export const restoreWallet = async (
  password: string,
  activeNetwork = Network.Testnet,
): Promise<void> => {
  const result = storageManager.read<CustomRootState>('wallet', {})
  await initWallet({ ...result, activeNetwork })
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
  network: Network,
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
      currencyToUnit(getAsset(network, from.code), fromAmount.toNumber()),
    ),
    toAmount: new BigNumber(
      currencyToUnit(getAsset(network, to.code), toAmount.toNumber()),
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
            if (historyItem.type === 'SEND' || historyItem.type === 'NFT') {
              fetchConfirmationByHash(
                historyItem.from,
                historyItem.txHash,
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

export const localStorageLangEffect: <T>(key: string) => AtomEffect<T> =
  (key) =>
  ({ setSelf, onSet, trigger }) => {
    const loadPersisted = async () => {
      const savedValue = storageManager.read(key, '')

      if (savedValue) {
        setSelf(savedValue)
      }
    }
    if (trigger === 'get') {
      loadPersisted()
    }

    onSet((newValue, _, isReset) => {
      isReset ? storageManager.remove(key) : storageManager.write(key, newValue)
    })
  }

export const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key) =>
  ({ setSelf, onSet, trigger }) => {
    if (trigger === 'get') {
      const savedValue = storageManager.read(key, '')
      setSelf(
        savedValue !== null && savedValue ? savedValue : new DefaultValue(),
      )
    }

    onSet((newValue, _, isReset) => {
      if (newValue instanceof DefaultValue && trigger === 'get') return
      isReset
        ? storageManager.remove(key)
        : newValue !== null &&
          typeof newValue !== 'undefined' &&
          newValue !== -1
      storageManager.write(key, newValue)
    })
  }

export const localStorageAssetEffect: (key: string) => AtomEffect<boolean> =
  (key) =>
  ({ setSelf, onSet, trigger }) => {
    const loadPersisted = async () => {
      const savedValue = storageManager.read(key, '')

      if (savedValue !== '') {
        setSelf(savedValue)
      }
    }
    if (trigger === 'get') {
      loadPersisted()
    }

    onSet((newValue, _, isReset) => {
      isReset ? storageManager.remove(key) : storageManager.write(key, newValue)
    })
  }

export type RootState = typeof wallet.state
