import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux'
import { RootState, AppDispatch } from './store/store'
import { useEffect, useState } from 'react'
import { AssetDataElementType, UseInputStateReturnType } from './types'
import {
  assets as cryptoassets,
  unitToCurrency,
  chains,
} from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Watches the raw state for any changes, and return a mapped/abstracted version of it to react components
 */
export const useWalletState = () => {
  const [loading, setLoading] = useState(true)
  const [assetCount, setAssetCount] = useState(0)
  const [assets, setAssets] = useState<Array<AssetDataElementType>>([])
  const [totalFiatBalance, setTotalFiatBalance] = useState<BigNumber>(
    new BigNumber(0),
  )
  const { accounts, walletId, activeNetwork, fiatRates, fees } = useAppSelector(
    (state) => ({
      accounts: state.accounts,
      walletId: state.activeWalletId,
      activeNetwork: state.activeNetwork,
      fiatRates: state.fiatRates,
      fees: state.fees,
    }),
    shallowEqual,
  )

  useEffect(() => {
    if (accounts) {
      setAssetCount(Object.keys(accounts).length)
      const accts = accounts?.[walletId!]?.[activeNetwork!]
      let totalBalance = new BigNumber(0)

      if (accts && fiatRates) {
        let assetCounter = 0
        let accountData: Array<AssetDataElementType> = []

        for (let account of accts) {
          if (Object.keys(account.balances!).length === 0) {
            continue
          }

          const nativeAsset = chains[account.chain].nativeAsset
          const chainData: AssetDataElementType = {
            id: account.chain,
            chain: account.chain,
            name: account.name,
            code: nativeAsset,
            address: account.addresses[0], //TODO why pick only the first address
            balance: new BigNumber(account.balances?.[nativeAsset] || 0),
            balanceInUSD: unitToCurrency(
              cryptoassets[nativeAsset],
              account.balances?.[nativeAsset] || 0,
            ).times(fiatRates[nativeAsset]),
            color: account.color,
            assets: [],
            showAssets: false,
            fees: fees?.[activeNetwork!]![walletId!][account.chain],
          }

          if (account.assets.length > 0) {
            const { total, assetsData } = Object.keys(account.balances!).reduce(
              (
                acc: {
                  total: BigNumber
                  assetsData: Array<AssetDataElementType>
                },
                asset: string,
              ) => {
                acc.total = BigNumber.sum(
                  acc.total,
                  unitToCurrency(
                    cryptoassets[asset],
                    account.balances![asset],
                  ).times(fiatRates[asset]),
                )

                acc.assetsData.push({
                  id: asset,
                  name: cryptoassets[asset].name,
                  code: asset,
                  chain: account.chain,
                  color: account.color,
                  balance: new BigNumber(account.balances![asset]),
                  balanceInUSD: new BigNumber(
                    unitToCurrency(
                      cryptoassets[asset],
                      account.balances![asset],
                    ).times(fiatRates[asset]),
                  ),
                })
                return acc
              },
              { total: new BigNumber(0), assetsData: [] },
            )

            totalBalance = BigNumber.sum(totalBalance, total)

            assetCounter += Object.keys(account.balances!).reduce(
              (count: number, asset: string) =>
                account.balances![asset] > 0 ? ++count : count,
              0,
            )

            chainData.balance = assetsData.reduce(
              (
                totalBal: BigNumber,
                assetData: AssetDataElementType,
              ): BigNumber =>
                BigNumber.sum(totalBal, assetData.balance || new BigNumber(0)),
              new BigNumber(0),
            )

            chainData.balanceInUSD = assetsData.reduce(
              (
                totalBal: BigNumber,
                assetData: AssetDataElementType,
              ): BigNumber =>
                BigNumber.sum(
                  totalBal,
                  assetData.balanceInUSD || new BigNumber(0),
                ),
              new BigNumber(0),
            )

            chainData.assets?.push(...assetsData)
          }

          accountData.push(chainData)
        }
        setTotalFiatBalance(totalBalance)
        setAssetCount(assetCounter)
        setAssets(accountData)
      }
      setLoading(false)
    }
  }, [accounts, activeNetwork, fees, fiatRates, walletId])

  return { loading, assetCount, assets, totalFiatBalance }
}

export const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}
