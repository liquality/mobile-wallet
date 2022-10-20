import React, { FC } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilValue } from 'recoil'
import {
  accountsIdsForMainnetState,
  accountsIdsState,
  enabledAssetsState,
  networkState,
} from '../../../atoms'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { Network } from '@liquality/wallet-core/dist/src/store/types'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetManagementScreen'
>

const AssetManagementScreen: FC<OverviewProps> = () => {
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const network = useRecoilValue(networkState)
  const accountsIds = useRecoilValue(
    network === Network.Testnet ? accountsIdsState : accountsIdsForMainnetState,
  )
  return (
    <AssetManagement enabledAssets={enabledAssets} accounts={accountsIds} />
  )
}

export default AssetManagementScreen
