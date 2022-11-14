import React, { FC } from 'react'
import AssetManagement from '../../../components/asset-management'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState, sortedAccountsIdsState } from '../../../atoms'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { faceliftPalette } from '../../../theme'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetManagementScreen'
>

const AssetManagementScreen: FC<OverviewProps> = ({ route }) => {
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const accountsIds = useRecoilValue(sortedAccountsIdsState)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: faceliftPalette.white }}>
      <AssetManagement
        enabledAssets={enabledAssets}
        accounts={accountsIds}
        selectedAsset={route.params.code}
      />
    </SafeAreaView>
  )
}

export default AssetManagementScreen
