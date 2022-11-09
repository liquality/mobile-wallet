import React, { FC } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState, sortedAccountsIdsState } from '../../../atoms'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetManagementScreen'
>

const AssetManagementScreen: FC<OverviewProps> = () => {
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const accountsIds = useRecoilValue(sortedAccountsIdsState)
  return (
    <AssetManagement enabledAssets={enabledAssets} accounts={accountsIds} />
  )
}

export default AssetManagementScreen
