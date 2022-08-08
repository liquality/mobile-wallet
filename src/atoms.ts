import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import { AccountType, SwapAssetPairType } from './types'
import { BigNumber } from '@liquality/types'
import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import {
  addressEffect,
  balanceEffect,
  enabledAssetsEffect,
  fiatRateEffect,
  localStorageEffect,
  marketDataEffect,
  transactionHistoryEffect,
} from './store/store'
import { assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets'
import { Asset } from '@liquality/wallet-core/src/store/types'
import { getNativeAsset } from '@liquality/wallet-core/dist/utils/asset'
import {
  FiatRates,
  HistoryItem,
  MarketData,
  Network,
} from '@liquality/wallet-core/dist/store/types'
import { CustomRootState } from './reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { KEYS } from './utils'

//------------ATOMS---------------------
export const accountsIdsState = atom<{ id: string; name: Asset }[]>({
  key: 'AccountsIds',
  default: [],
  effects: [localStorageEffect('accountIds')],
})

export const fiatRatesState = atom<FiatRates>({
  key: 'AssetFiatRate',
  default: {},
  effects: [localStorageEffect<FiatRates>('fiatRates'), fiatRateEffect()],
})

export const networkState = atom<Network>({
  key: 'ActiveNetwork',
  default: AsyncStorage.getItem(KEYS.ACTIVE_NETWORK_KEY).then((savedValue) =>
    savedValue !== null && typeof savedValue !== 'undefined'
      ? (JSON.parse(savedValue) as Network)
      : Network.Testnet,
  ),
  effects: [localStorageEffect<Network>(KEYS.ACTIVE_NETWORK_KEY)],
})

export const swapPairState = atom<SwapAssetPairType>({
  key: 'SwapPair',
  default: {},
})

export const marketDataState = atom<MarketData[]>({
  key: 'MarketData',
  default: [],
  effects: [localStorageEffect<MarketData[]>('marketData'), marketDataEffect()],
})

export const historyIdsState = atom<string[]>({
  key: 'HistoryIds',
  default: AsyncStorage.getItem('historyIds').then((savedValue) =>
    savedValue !== null && typeof savedValue !== 'undefined'
      ? JSON.parse(savedValue)
      : [],
  ),
  effects: [localStorageEffect<string[]>('historyIds')],
})

export const enabledAssetsState = atom<string[]>({
  key: 'EnabledAssets',
  default: [],
  effects: [enabledAssetsEffect()],
})

export const walletState = atom<CustomRootState>({
  key: 'Wallet',
  default: {},
  // effects: [localStorageEffect('wallet')],
})

export const activityFilterState = atom<CustomRootState['assetFilter']>({
  key: 'ActivityFilter',
  default: {},
})

export const optInAnalyticsState = atom<
  Partial<CustomRootState['analytics']> | undefined
>({
  key: 'OptInAnalytics',
  default: undefined,
  effects: [localStorageEffect('analytics')],
})

export const isDoneFetchingData = atom<boolean>({
  key: 'DoneFetchingData',
  default: false,
})

//---------- ATOM FAMILIES----------------
export const accountInfoStateFamily = atomFamily<Partial<AccountType>, string>({
  key: 'AccountInfo',
  default: (accountId) =>
    AsyncStorage.getItem(`account-info-${accountId}`).then((savedValue) =>
      savedValue !== null ? JSON.parse(savedValue) : {},
    ),
  effects: (accountId) => [localStorageEffect(`account-info-${accountId}`)],
})

export const balanceStateFamily = atomFamily<number, string>({
  key: 'AssetBalance',
  default: (asset) =>
    AsyncStorage.getItem(asset).then((savedValue) =>
      savedValue !== null ? Number(savedValue) : -1,
    ),
  effects: (asset) => [localStorageEffect(asset), balanceEffect(asset)],
})

export const addressStateFamily = atomFamily<string, string>({
  key: 'AccountAddress',
  default: (accountId) =>
    AsyncStorage.getItem(`address-${accountId}`).then((savedValue) =>
      savedValue !== null ? JSON.parse(savedValue) : '',
    ),
  effects: (accountId) => [
    localStorageEffect(`address-${accountId}`),
    addressEffect(accountId),
  ],
})

export const historyStateFamily = atomFamily<Partial<HistoryItem>, string>({
  key: 'TransactionHistory',
  default: (transactionId) =>
    AsyncStorage.getItem(transactionId).then((savedValue) =>
      savedValue !== null ? JSON.parse(savedValue) : '',
    ),
  effects: (transactionId) => [
    localStorageEffect(transactionId),
    transactionHistoryEffect(transactionId),
  ],
})

//--------------ATOM SELECTORS--------------
export const accountInfoState = selectorFamily<Partial<AccountType>, string>({
  key: 'AccountInfoState',
  get:
    (accountId) =>
    ({ get }) => {
      const address = get(addressStateFamily(accountId))
      const account = get(accountInfoStateFamily(accountId))
      if (account?.code) {
        account.balance = get(balanceStateFamily(account.code))
      }
      account.address = address
      for (let assetsKey in account.assets) {
        account.assets[assetsKey].address = address
      }
      return account
    },
})
export const accountListState = selector<Partial<AccountType>[]>({
  key: 'AccountList',
  get: ({ get }) => {
    const accountsIds = get(accountsIdsState)
    return accountsIds.map((item) => {
      const address = get(addressStateFamily(item.id))
      const account = get(accountInfoStateFamily(item.id))
      account.address = address
      return account
    })
  },
})

export const accountForAssetState = selectorFamily<
  Partial<AccountType> | undefined,
  string
>({
  key: 'AccountForAsset',
  get:
    (asset) =>
    ({ get }) => {
      const accountsIds = get(accountsIdsState)
      const filteredAccounts = accountsIds
        .map((item) => get(accountInfoStateFamily(item.id)))
        .filter((account) => account.code === asset)
      const account =
        filteredAccounts.length > 0 ? filteredAccounts[0] : undefined
      if (!account?.id) return account
      return {
        ...account,
        address: get(addressStateFamily(account.id)),
        assets: {
          ...account.assets,
          [asset]: {
            ...account.assets[asset],
            balance: get(balanceStateFamily(asset)),
          },
        },
      }
    },
})

export const historyItemsState = selector<HistoryItem[]>({
  key: 'HistoryItems',
  get: ({ get }) => {
    const historyIds = get(historyIdsState)
    return historyIds.map((id) => get(historyStateFamily(id)))
  },
})

export const totalFiatBalanceState = selector<string>({
  key: 'TotalFiatBalance',
  get: ({ get }) => {
    const accountsIds = get(accountsIdsState)
    const fiatRates = get(fiatRatesState)

    const totalFiatBalance = accountsIds.reduce((acc, account) => {
      const balanceState = balanceStateFamily(account.name)

      return BigNumber.sum(
        acc,
        balanceState && fiatRates[account.name] > 0
          ? new BigNumber(
              cryptoToFiat(
                unitToCurrency(
                  cryptoassets[getNativeAsset(account.name)],
                  get(balanceState),
                ).toNumber(),
                fiatRates[account.name],
              ),
            )
          : 0,
      )
    }, new BigNumber(0))

    return formatFiat(totalFiatBalance).toString()
  },
})
