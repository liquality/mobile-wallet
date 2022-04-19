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
import { v4 as uuidv4 } from 'uuid'

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
  const [error, setError] = useState<string>()
  const { accounts, walletId, activeNetwork, fiatRates, fees, history } =
    useAppSelector(
      (state) => ({
        accounts: state.accounts,
        walletId: state.activeWalletId,
        activeNetwork: state.activeNetwork,
        fiatRates: state.fiatRates,
        fees: state.fees,
        history: state.history,
      }),
      shallowEqual,
    )

  useEffect(() => {
    let totalBalance = new BigNumber(0)
    let assetCounter = 0

    try {
      if (!accounts) {
        return
      }

      setAssetCount(Object.keys(accounts).length)
      const accts = accounts?.[walletId!]?.[activeNetwork!]

      if (!accts || !fiatRates) {
        return
      }

      let accountData: Array<AssetDataElementType> = []

      for (let account of accts) {
        if (Object.keys(account.balances).length === 0) {
          continue
        }

        const nativeAsset = chains[account.chain].nativeAsset
        const chainData: AssetDataElementType = {
          id: uuidv4(),
          chain: account.chain,
          name: account.name,
          code: nativeAsset,
          address: account.addresses[0], //TODO why pick only the first address
          color: account.color,
          assets: [],
          showAssets: false,
          fees: fees?.[activeNetwork]?.[walletId]?.[account.chain],
        }

        if (account.assets.length > 0) {
          const { total, assetsData } = Object.keys(account.balances).reduce(
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
                  account.balances?.[asset],
                ).times(fiatRates[asset]),
              )

              acc.assetsData.push({
                id: asset,
                name: cryptoassets[asset].name,
                code: asset,
                chain: account.chain,
                color: account.color,
                balance: account.balances?.[asset],
                balanceInUSD: unitToCurrency(
                  cryptoassets[asset],
                  account.balances?.[asset],
                )
                  .times(fiatRates[asset])
                  .toNumber(),
              })
              return acc
            },
            { total: new BigNumber(0), assetsData: [] },
          )

          totalBalance = BigNumber.sum(totalBalance, total)

          //calculate the total balance for the current account eg: ETH
          chainData.balance = assetsData
            .reduce(
              (
                totalBal: BigNumber,
                assetData: AssetDataElementType,
              ): BigNumber =>
                BigNumber.sum(totalBal, assetData.balance || new BigNumber(0)),
              new BigNumber(0),
            )
            .toNumber()

          chainData.balanceInUSD = assetsData
            .reduce(
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
            .toNumber()

          chainData.assets?.push(...assetsData)
          assetCounter += account.assets.length
        } else {
          assetCounter += 1
        }

        accountData.push(chainData)
      }
      setTotalFiatBalance(totalBalance)
      setAssetCount(assetCounter)
      setAssets(accountData)
      setLoading(assetCounter === 0)
    } catch (e: unknown) {
      setLoading(false)
      setError(`Failed to load assets: ${e}`)
    }
  }, [accounts, activeNetwork, fees, fiatRates, walletId])

  return {
    loading,
    assetCount,
    assets,
    totalFiatBalance,
    history,
    fiatRates,
    error,
  }
}

export const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}
