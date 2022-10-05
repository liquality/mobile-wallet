import React, { useCallback } from 'react'
import { ScrollView } from 'react-native'
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
      return (
        <React.Fragment key={item.id}>
          <WrappedRow item={item} />
        </React.Fragment>
      )
    },
    [],
  )

  return (
    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
      {accounts.map((item) => {
        return renderAsset({ item })
      })}
    </ScrollView>
  )
}

export default AssetFlatList
