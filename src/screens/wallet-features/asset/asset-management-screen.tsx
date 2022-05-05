import React, { FC, useCallback, useEffect, useState } from 'react'
import { Alert } from 'react-native'
import AssetManagement from '../../../components/asset-management'
import { useAppDispatch, useAppSelector } from '../../../hooks'

const AssetManagementScreen: FC = () => {
  const dispatch = useAppDispatch()
  const [myEnabledAssets, setMyEnabledAssets] = useState<string[]>([])
  const { activeNetwork, activeWalletId, enabledAssets } = useAppSelector(
    (state) => ({
      activeNetwork: state.activeNetwork,
      enabledAssets: state.enabledAssets,
      activeWalletId: state.activeWalletId,
    }),
  )

  const handleEnableFeature = useCallback(
    (asset: string) => {
      if (!activeWalletId || !activeNetwork) {
        Alert.alert('Please reload your wallet')
        return
      }

      dispatch({
        type: 'TOGGLE_ASSET',
        payload: {
          enabledAssets: {
            ...enabledAssets,
            [activeNetwork]: {
              [activeWalletId]: myEnabledAssets.includes(asset)
                ? myEnabledAssets.filter((item) => item !== asset)
                : myEnabledAssets.concat(asset),
            },
          },
        },
      })
    },
    [activeNetwork, activeWalletId, dispatch, enabledAssets, myEnabledAssets],
  )

  useEffect(() => {
    if (!activeWalletId || !activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }
    setMyEnabledAssets(enabledAssets?.[activeNetwork]?.[activeWalletId] || [])
  }, [activeNetwork, activeWalletId, enabledAssets])

  return (
    <AssetManagement
      enabledAssetCodes={enabledAssets?.[activeNetwork!]?.[activeWalletId!]}
      onEnableFeature={handleEnableFeature}
    />
  )
}

export default AssetManagementScreen
