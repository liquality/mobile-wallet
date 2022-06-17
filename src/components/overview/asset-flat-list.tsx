import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { AccountType } from '../../types'
import WrappedRow from './wrapped-row'

type AssetFlatListPropsType = {
  assets?: AccountType[]
  accounts: { id: string; name: string }[]
}

const AssetFlatList = (props: AssetFlatListPropsType) => {
  const { accounts } = props

  const renderAsset = useCallback(
    ({ item }: { item: { id: string; name: string } }) => {
      return <WrappedRow item={item} />
    },
    [],
  )

  return (
    <FlatList
      data={accounts}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

export default React.memo(AssetFlatList)
