import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store'
import { useEffect, useState } from 'react'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

/**
 * Watches the raw state for any changes, and return a mapped/abstracted version of it to react components
 */
export const useWalletState = () => {
  const [loading, setLoading] = useState(true)
  const [assetCount, setAssetCount] = useState(0)
  const { accounts } = useAppSelector((state) => ({
    accounts: state.accounts,
  }))

  useEffect(() => {
    if (accounts) {
      setAssetCount(Object.keys(accounts).length)
      setLoading(false)
    }
  }, [accounts])

  return { loading, assetCount }
}
