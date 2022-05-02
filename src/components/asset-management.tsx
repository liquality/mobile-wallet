import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { Asset } from '@liquality/cryptoassets/dist/src/types'
import { assets as cryptoassets } from '@liquality/cryptoassets'

import AssetIcon from './asset-icon'
import Switch from './ui/switch'
import SearchBox from './ui/search-box'
import { useAppSelector } from '../hooks'
import { NetworkEnum } from '@liquality/core/dist/types'
import { customConfig } from '../core/config'

const AssetManagement = ({
  enabledAssetCodes,
  onEnableFeature,
}: {
  enabledAssetCodes: string[] | undefined
  onEnableFeature: (asset: string) => void
}) => {
  const DEFAULT_COLOR = '#EFEFEF'
  const [data, setData] = useState<Asset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const { activeNetwork, activeWalletId, enabledAssets } = useAppSelector(
    (state) => ({
      activeNetwork: state.activeNetwork,
      enabledAssets: state.enabledAssets,
      activeWalletId: state.activeWalletId,
    }),
  )

  const renderAsset = useCallback(
    ({ item }: { item: Asset }) => {
      const { name, code, chain, color = DEFAULT_COLOR } = item
      return (
        <Fragment>
          <View
            style={[styles.row, { borderLeftColor: color || DEFAULT_COLOR }]}>
            <View style={styles.col1}>
              <AssetIcon chain={chain} asset={code} />
            </View>
            <View style={styles.col2}>
              <Text style={styles.code}>{name}</Text>
            </View>
            <View style={styles.col3}>
              <Switch
                enableFeature={() => onEnableFeature(code)}
                isFeatureEnabled={enabledAssetCodes?.includes(code) || false}
              />
            </View>
          </View>
        </Fragment>
      )
    },
    [enabledAssetCodes, onEnableFeature],
  )

  useEffect(() => {
    if (!activeWalletId || !activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (activeNetwork === NetworkEnum.Testnet) {
      myAssets = customConfig.defaultAssets[activeNetwork].reduce(
        (assetList: Asset[], asset) => {
          if (cryptoassets.hasOwnProperty(asset)) {
            assetList.push({
              ...cryptoassets[asset],
              contractAddress: customConfig.testnetContractAddresses[asset],
            })
          }
          return assetList
        },
        [],
      )
    } else {
      myAssets = Object.keys(cryptoassets).map((key) => cryptoassets[key])
    }
    setAssets(myAssets)
    setData(myAssets)
  }, [activeNetwork, activeWalletId, enabledAssets])

  return (
    <View style={styles.container}>
      <SearchBox items={assets} updateData={setData} />
      <FlatList
        data={data}
        renderItem={renderAsset}
        keyExtractor={(item) => item.code}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#D9DFE5',
    borderLeftWidth: 3,
    paddingVertical: 10,
  },
  col1: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  col2: {
    flex: 0.65,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  code: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 12,
    marginBottom: 5,
  },
})

export default AssetManagement
