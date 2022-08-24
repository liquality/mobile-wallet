import React, { FC } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState } from '../../../atoms'

const AssetManagementScreen: FC = () => {
  const enabledAssets = useRecoilValue(enabledAssetsState)

  return <AssetManagement enabledAssets={enabledAssets} />
}

export default AssetManagementScreen
