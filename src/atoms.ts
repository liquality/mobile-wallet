import { atom, atomFamily, selector } from 'recoil'
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
  marketDataEffect,
  transactionHistoryEffect,
  walletEffect,
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
import { setupWallet } from '@liquality/wallet-core'
import { CustomRootState } from './reducers'

//------------ATOMS---------------------
export const accountsIdsState = atom<{ id: string; name: Asset }[]>({
  key: 'AccountsIds',
  default: [],
})

export const fiatRatesState = atom<FiatRates>({
  key: 'AssetFiatRate',
  default: {},
  effects: [fiatRateEffect()],
})

export const networkState = atom<Network>({
  key: 'ActiveNetwork',
  default: Network.Testnet,
})

export const swapPairState = atom<SwapAssetPairType>({
  key: 'SwapPair',
  default: {},
})

export const marketDataState = atom<MarketData[]>({
  key: 'MarketData',
  default: [],
  effects: [marketDataEffect()],
})

export const historyIdsState = atom<string[]>({
  key: 'HistoryIds',
  default: [],
})

export const enabledAssetsState = atom<string[]>({
  key: 'EnabledAssets',
  default: [],
  effects: [enabledAssetsEffect()],
})

export const walletState = atom<Awaited<ReturnType<typeof setupWallet>>>({
  key: 'Wallet',
  effects: [walletEffect()],
})

export const activityFilterState = atom<CustomRootState['assetFilter']>({
  key: 'ActivityFilter',
  default: {},
})

//---------- ATOM FAMILIES----------------
export const accountInfoStateFamily = atomFamily<AccountType, string>({
  key: 'AccountInfo',
})

export const balanceStateFamily = atomFamily<number, string>({
  key: 'AssetBalance',
  default: -1,
  effects: (asset) => [balanceEffect(asset)],
})

export const addressStateFamily = atomFamily<string, string>({
  key: 'AccountAddress',
  default: '',
  effects: (accountId) => [addressEffect(accountId)],
})

export const historyStateFamily = atomFamily<HistoryItem, string>({
  key: 'TransactionHistory',
  effects: (transactionId) => [transactionHistoryEffect(transactionId)],
})

//--------------ATOM SELECTORS--------------
export const accountListState = selector<AccountType[]>({
  key: 'AccountList',
  get: ({ get }) => {
    const accountsIds = get(accountsIdsState)
    return accountsIds.map((item) => get(accountInfoStateFamily(item.id)))
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
