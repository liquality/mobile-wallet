import React, { FC, useCallback } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilState } from 'recoil'
import { enabledAssetsState } from '../../../atoms'

const AssetManagementScreen: FC = () => {
  const [enabledAssets, setEnabledAssets] = useRecoilState(enabledAssetsState)

  const handleEnableFeature = useCallback(
    (asset: string) => {
      setEnabledAssets((currVal) => currVal.filter((item) => item !== asset))
    },
    [setEnabledAssets],
  )

  return (
    <AssetManagement
      enabledAssetCodes={enabledAssets}
      onEnableFeature={handleEnableFeature}
    />
  )
}

export default AssetManagementScreen
