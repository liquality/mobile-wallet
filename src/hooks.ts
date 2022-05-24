import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux'
import { RootState, AppDispatch, getWalletSummary } from './store/store'
import { useEffect, useState } from 'react'
import { AssetDataElementType, UseInputStateReturnType } from './types'
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Watches the raw state for any changes, and return a mapped/abstracted version of it to react components
 */
export const useWalletState = () => {
  const [loading, setLoading] = useState(true)
  const [assetCount, setAssetCount] = useState(0)
  const [assets, setAssets] = useState<Array<AssetDataElementType>>([])
  const [error, setError] = useState('')
  const [totalFiatBalance, setTotalFiatBalance] = useState<string>('0')
  const { accounts, walletId, activeNetwork, fiatRates, fees } = useAppSelector(
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
    try {
      const {
        totalFiatBalance: total,
        numberOfAccounts,
        accountData,
      } = getWalletSummary()

      setTotalFiatBalance(total)
      setAssetCount(numberOfAccounts)
      setAssets(accountData)
    } catch (e) {
      setError('Failed to load wallet data')
    }

    setLoading(false)
  }, [accounts, activeNetwork, fees, fiatRates, walletId])

  return {
    loading,
    assetCount,
    assets,
    totalFiatBalance,
    error,
  }
}

export const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}
