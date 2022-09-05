import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { AccountType } from '../../types'
import WrappedRow from './wrapped-row'
import AssetIcon from '../asset-icon'
import { assets as cryptoassets } from '@liquality/cryptoassets'

type AssetFlatListPropsType = {
  assets?: AccountType[]
  accounts: { id: string; name: string }[]
}

const AssetFlatList = (props: AssetFlatListPropsType) => {
  const { accounts } = props

  const renderAsset = useCallback(
    ({ item }: { item: { id: string; name: string } }) => {
      return (
        <View key={item.id}>
          <React.Suspense
            fallback={
              <View style={styles.row}>
                <AssetIcon chain={cryptoassets[item.name].chain} />
                <ActivityIndicator />
              </View>
            }>
            <WrappedRow item={item} />
          </React.Suspense>
        </View>
      )
    },
    [],
  )

  return accounts.map((item) => {
    return renderAsset({ item })
  })
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    borderLeftWidth: 3,
    paddingVertical: 10,
    height: 60,
  },
})

export default AssetFlatList
