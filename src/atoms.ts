import { AccountIdType, DarkModeEnum, LanguageEnum } from './types'
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
  localStorageAssetEffect,
  localStorageEffect,
  localStorageLangEffect,
  transactionHistoryEffect,
} from './store/store'

import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import {
  FiatRates,
  HistoryItem,
  Network,
} from '@liquality/wallet-core/dist/src/store/types'
import {
  ButtonProps,
  KEYS,
  SortRadioButtonProp,
  statusFilterBtn,
  transFilterBtns,
} from './utils'
import * as Localization from 'expo-localization'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'

//------------ATOMS---------------------
export const accountsIdsState = atom<AccountIdType[]>({
  key: KEYS.ACCOUNTS_IDS_FOR_TESTNET,
  default: [],
  effects: [localStorageEffect(KEYS.ACCOUNTS_IDS_FOR_TESTNET)],
})

export const accountsIdsForMainnetState = atom<AccountIdType[]>({
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

export const showSearchBarInputState = atom<boolean>({
  key: 'ShowSearchBarInput',
  default: false,
})

export const themeMode = atom<DarkModeEnum>({
  key: 'ThemeMode',
  default: DarkModeEnum.Light,
  effects: [localStorageEffect<DarkModeEnum>(KEYS.ACTIVE_THEME)],
})

export const sortingOptionState = atom<SortRadioButtonProp>({
  key: 'sortingOptionState',
  default: { key: 'by_date', value: 'sortPicker.by_date' },
})

export const transFilterBtnState = atom<Array<ButtonProps>>({
  key: 'transFilterBtnState',
  default: transFilterBtns.map((item) => ({ ...item, status: false })),
})

export const statusFilterBtnState = atom<Array<ButtonProps>>({
  key: 'statusFilterBtnState',
  default: statusFilterBtn.map((item) => ({ ...item, status: false })),
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

export const aboutVisitedState = atom<boolean>({
  key: KEYS.ABOUT_SCREEN_VISITED,
  default: false,
  effects: [localStorageAssetEffect(KEYS.ABOUT_SCREEN_VISITED)],
})

export const doubleOrLongTapSelectedAsset = atom<string>({
  key: 'doubleOrLongTapSelectedAsset',
  default: '',
})

export const swapQuoteState = atom<SwapQuote | null>({
  key: 'swapQuoteState',
  default: null,
})

export const swapQuotesState = atom<SwapQuote[]>({
  key: 'swapQuotesState',
  default: [],
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

export const showFilterState = atom<boolean>({
  key: 'showFilter',
  default: false,
})

export const selectedAssetState = atom<string>({
  key: 'selectedAsset',
  default: 'BTC',
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
  effects: (asset) => [localStorageAssetEffect(`enabled-asset-${asset}`)],
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

    if (!accountsIds || accountsIds.length === 0) return '0'

    const totalFiatBalance = accountsIds.reduce((acc, account) => {
      const assetBalance = get(
        balanceStateFamily({
          asset: account.name,
          assetId: account.id,
        }),
      )

      const balance =
        assetBalance > 0 && fiatRates[account.name] > 0
          ? new BigNumber(
              cryptoToFiat(
                unitToCurrency(
                  getAsset(activeNetwork, getNativeAsset(account.name)),
                  assetBalance,
                ).toNumber(),
                fiatRates[account.name],
              ),
            )
          : 0
      return BigNumber.sum(acc, balance)
    }, new BigNumber(0))

    return formatFiat(totalFiatBalance).toString()
  },
})

export const totalEnabledAssetsWithBalance = selector<number>({
  key: 'totalEnabledAssetsWithBalance',
  get: ({ get }) => {
    let total = 0
    const enabledAssets = get(enabledAssetsState)
    const accounts: Partial<AccountType>[] = get(accountListState)

    for (const account of accounts) {
      total += Object.values(account.assets).filter(
        (asset) =>
          account.id &&
          enabledAssets.includes(asset.code) &&
          get(balanceStateFamily({ asset: asset.code, assetId: account.id })) >
            0,
      ).length
    }
    return total
  },
})

export const sortedAccountsIdsState = selector<AccountIdType[]>({
  key: 'SortedAccountsIdsState',
  get: ({ get }) => {
    const activeNetwork = get(networkState)
    const accountsIds =
      activeNetwork === Network.Testnet
        ? Array.from(get(accountsIdsState))
        : Array.from(get(accountsIdsForMainnetState))

    return accountsIds
      .map(({ id }) => get(accountInfoState(id)))
      .filter(
        (account) =>
          get(
            balanceStateFamily({ asset: account.code, assetId: account.id }),
          ) >= 0,
      )
      .sort((account1, account2) => {
        const fiatRates = get(fiatRatesState)
        const balance1 = get(
          balanceStateFamily({
            asset: account1.code,
            assetId: account1.id,
          }),
        )
        const fiatBalance1 = cryptoToFiat(
          unitToCurrency(
            getAsset(activeNetwork, getNativeAsset(account1.code)),
            balance1,
          ).toNumber(),
          fiatRates[account1.code],
        )

        const balance2 = get(
          balanceStateFamily({
            asset: account2.code,
            assetId: account2.id,
          }),
        )
        const fiatBalance2 = cryptoToFiat(
          unitToCurrency(
            getAsset(activeNetwork, getNativeAsset(account2.code)),
            balance2,
          ).toNumber(),
          fiatRates[account2.code],
        )

        if (!BigNumber.isBigNumber(fiatBalance1)) {
          return -1
        } else if (!BigNumber.isBigNumber(fiatBalance2)) {
          return 1
        }

        return fiatBalance2.minus(fiatBalance1).toNumber()
      })
      .map((account) => ({ id: account.id, name: account.code }))
  },
})

export const assetScreenPopupMenuVisible = atom<boolean>({
  key: 'AssetScreenPopupMenu',
  default: false,
})

/*
Used to indicate which row in the asset list is toggled
 */
export const accountToggled = atom<string | undefined>({
  key: 'AccountToggled',
  default: null,
})
