import React, { FC } from 'react'
import AccountManagement from '../../../components/account-management'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState, sortedAccountsIdsState } from '../../../atoms'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'

export type OverviewProps = NativeStackScreenProps<
  MainStackParamList,
  'AccountManagementScreen'
>

const AccountManagementScreen: FC<OverviewProps> = () => {
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const accountsIds = useRecoilValue(sortedAccountsIdsState)
  return (
    <AccountManagement enabledAssets={enabledAssets} accounts={accountsIds} />
  )
}

export default AccountManagementScreen
