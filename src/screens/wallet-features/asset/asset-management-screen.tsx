import React, { FC } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState } from '../../../atoms'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetManagementScreen'
>

const AssetManagementScreen: FC<OverviewProps> = () => {
  const enabledAssets = useRecoilValue(enabledAssetsState)

  return <AssetManagement enabledAssets={enabledAssets} />
}

export default AssetManagementScreen
