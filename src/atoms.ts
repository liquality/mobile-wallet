import { DarkModeEnum, LanguageEnum } from './types'
import { atom, atomFamily, selector, selectorFamily } from 'recoil'
import { AccountType, SwapAssetPairType, CustomRootState } from './types'
import { BigNumber } from '@liquality/types'
import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import {
  addressEffect,
  balanceEffect,
  enabledAssetsEffect,
  fiatRateEffect,
  localStorageEffect,
  localStorageLangEffect,
  transactionHistoryEffect,
} from './store/store'

import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import { Asset } from '@liquality/wallet-core/dist/src/store/types'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import {
  FiatRates,
  HistoryItem,
  Network,
} from '@liquality/wallet-core/dist/src/store/types'
import { KEYS } from './utils'
import * as Localization from 'expo-localization'

//------------ATOMS---------------------
export const accountsIdsState = atom<{ id: string; name: Asset }[]>({
  key: KEYS.ACCOUNTS_IDS_FOR_TESTNET,
  default: [],
  effects: [localStorageEffect(KEYS.ACCOUNTS_IDS_FOR_TESTNET)],
})

export const accountsIdsForMainnetState = atom<{ id: string; name: Asset }[]>({
  key: KEYS.ACCOUNTS_IDS_FOR_MAINNET,
  default: [],
  effects: [localStorageEffect(KEYS.ACCOUNTS_IDS_FOR_MAINNET)],
})

export const fiatRatesState = atom<FiatRates>({
  key: 'AssetFiatRate',
  default: {},
  effects: [localStorageEffect<FiatRates>('fiatRates'), fiatRateEffect()],
})

export const networkState = atom<Network>({
  key: 'ActiveNetwork',
  default: Network.Testnet,
  effects: [localStorageEffect<Network>(KEYS.ACTIVE_NETWORK_KEY)],
})

export const swapPairState = atom<SwapAssetPairType>({
  key: 'SwapPair',
  default: {},
})

export const historyIdsState = atom<string[]>({
  key: 'HistoryIds',
  default: [],
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
  effects: [localStorageEffect('wallet')],
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

export const themeMode = atom<DarkModeEnum>({
  key: 'ThemeMode',
  default: DarkModeEnum.Null,
  effects: [localStorageEffect<DarkModeEnum>(KEYS.ACTIVE_THEME)],
})

/**
 * Sync device language with dropdown options if available
 * @param deviceLang
 * @returns
 */
const setDefaultIfLangSupported = (deviceLang = '') => {
  const availableLang = ['es', 'en', 'zh']
  const index = availableLang.indexOf(deviceLang.split('-')[0])
  if (index !== -1) {
    return availableLang[index]
  } else {
    return LanguageEnum.English
  }
}

export const langSelected = atom<LanguageEnum | string>({
  key: 'LanguageSelected',
  default: setDefaultIfLangSupported(Localization.locale),
  effects: [localStorageLangEffect(KEYS.ACTIVE_LANG)],
})

export const doubleOrLongTapSelectedAsset = atom<string>({
  key: 'doubleOrLongTapSelectedAsset',
  default: '',
})

export enum SwapScreenPopUpTypes {
  FromAsset = 'fromAsset',
  ToAsset = 'toAsset',
  FromSlow = 'fromSlow',
  FromAverage = 'fromAverage',
  FromFast = 'fromFast',
  ToSlow = 'toSlow',
  ToAverage = 'toAverage',
  ToFast = 'toFast',
  AtomicSwap = 'atomicSwap',
  TransId = 'transId',
  Null = '',
}

export const swapScreenDoubleLongEvent = atom<SwapScreenPopUpTypes>({
  key: 'swapScreenDoubleLongEvent',
  default: SwapScreenPopUpTypes.Null,
})

//---------- ATOM FAMILIES----------------
export const accountInfoStateFamily = atomFamily<Partial<AccountType>, string>({
  key: 'AccountInfo',
  default: {},
  effects: (accountId) => [localStorageEffect(`account-info-${accountId}`)],
})

type AssetNameAssetKey = {
  asset: string
  assetId: string
}

export const balanceStateFamily = atomFamily<number, AssetNameAssetKey>({
  key: 'AssetBalance',
  default: -1,
  effects: ({ asset, assetId }) => [
    localStorageEffect(`${asset}|${assetId}`),
    balanceEffect(`${asset}|${assetId}`),
  ],
})

export const addressStateFamily = atomFamily<string, string>({
  key: 'AccountAddress',
  default: '',
  effects: (accountId) => [
    localStorageEffect(`address-${accountId}`),
    addressEffect(accountId),
  ],
})

export const historyStateFamily = atomFamily<Partial<HistoryItem>, string>({
  key: 'TransactionHistory',
  default: {},
  effects: (transactionId) => [
    localStorageEffect(transactionId),
    transactionHistoryEffect(transactionId),
  ],
})

export const enabledAssetsStateFamily = atomFamily<boolean, string>({
  key: 'EnabledAssetsState',
  default: true,
  effects: (asset) => [localStorageEffect(`enabled-asset-${asset}`)],
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
        account.balance = get(
          balanceStateFamily({ asset: account.code, assetId: accountId }),
        )
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
    const activeNetwork = get(networkState)
    const accountsIds = get(
      activeNetwork === Network.Testnet
        ? accountsIdsState
        : accountsIdsForMainnetState,
    )
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
            balance: get(balanceStateFamily({ asset, assetId: account.id })),
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
    const activeNetwork = get(networkState)
    const accountsIds = get(
      activeNetwork === Network.Testnet
        ? accountsIdsState
        : accountsIdsForMainnetState,
    )
    const fiatRates = get(fiatRatesState)

    const totalFiatBalance = accountsIds.reduce((acc, account) => {
      const balanceState = balanceStateFamily({
        asset: account.name,
        assetId: account.id,
      })

      return BigNumber.sum(
        acc,
        balanceState && fiatRates[account.name] > 0
          ? new BigNumber(
              cryptoToFiat(
                unitToCurrency(
                  getAsset(activeNetwork, getNativeAsset(account.name)),
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
