import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { AccountType } from '../../types'
import WrappedRow from './wrapped-row'
import { useRecoilValue } from 'recoil'
import { sortedAccountsIdsState } from '../../atoms'

type AssetFlatListPropsType = {
  assets?: AccountType[]
  accounts?: { id: string; name: string }[]
}

const AssetFlatList = (props: AssetFlatListPropsType) => {
  const { accounts: filteredAccounts } = props
  const accounts = useRecoilValue(sortedAccountsIdsState)

  const renderAsset = useCallback(
    ({ item }: { item: { id: string; name: string } }) => {
      return (
        <React.Fragment key={item.id}>
          <WrappedRow item={item} />
        </React.Fragment>
      )
    },
    [],
  )

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={true}
      data={filteredAccounts || accounts}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

export default AssetFlatList
