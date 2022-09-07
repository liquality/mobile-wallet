import React, { useCallback } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { AccountType } from '../../types'
import WrappedRow from './wrapped-row'
import AssetIcon from '../asset-icon'
import { getAsset } from '@liquality/cryptoassets'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'

type AssetFlatListPropsType = {
  assets?: AccountType[]
  accounts: { id: string; name: string }[]
}

const AssetFlatList = (props: AssetFlatListPropsType) => {
  const { accounts } = props

  const activeNetwork = useRecoilValue(networkState)
  const renderAsset = useCallback(
    ({ item }: { item: { id: string; name: string } }) => {
      return (
        <React.Suspense
          fallback={
            <View style={styles.row}>
              <AssetIcon chain={getAsset(activeNetwork, item.name).chain} />
              <ActivityIndicator />
            </View>
          }>
          <WrappedRow item={item} />
        </React.Suspense>
      )
    },
    [activeNetwork],
  )

  return (
    <>
      {accounts.map((item) => {
        return renderAsset({ item })
      })}
    </>
  )
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
