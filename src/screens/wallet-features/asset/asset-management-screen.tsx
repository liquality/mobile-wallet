import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import AssetIcon from '../../../components/asset-icon'
import Switch from '../../../components/ui/switch'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import SearchBox from '../../../components/ui/search-box'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { Asset } from '@liquality/cryptoassets/dist/src/types'
import { customConfig } from '../../../core/config'
import {toggleAsset} from '../../../store/store'

const AssetManagementScreen: FC = () => {
  const DEFAULT_COLOR = '#EFEFEF'
  const dispatch = useAppDispatch()
  const [data, setData] = useState<Asset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [myEnabledAssets, setMyEnabledAssets] = useState<string[]>([])
  const { activeNetwork, activeWalletId, enabledAssets } = useAppSelector(
    (state) => ({
      activeNetwork: state.activeNetwork,
      enabledAssets: state.enabledAssets,
      activeWalletId: state.activeWalletId,
    }),
  )

  const handleEnableFeature = useCallback(
    async (asset: string, newState: boolean) => {
      if (!activeWalletId || !activeNetwork) {
        Alert.alert('Please reload your wallet')
        return
      }

      await toggleAsset(asset, newState)
      dispatch({
        type: 'TOGGLE_ASSET',
        payload: {
          enabledAssets: {
            ...enabledAssets,
            [activeNetwork]: {
              [activeWalletId]: myEnabledAssets.includes(asset)
                ? myEnabledAssets.filter((item) => item !== asset)
                : myEnabledAssets.concat(asset),
            },
          },
        },
      })
    },
    [activeNetwork, activeWalletId, dispatch, enabledAssets, myEnabledAssets],
  )

  useEffect(() => {
    if (!activeWalletId || !activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    setMyEnabledAssets(enabledAssets?.[activeNetwork]?.[activeWalletId] || [])
    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (activeNetwork === 'testnet') {
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

  const renderAsset = useCallback(
    ({ item }: { item: Asset }) => {
      const { name, code, chain, color = DEFAULT_COLOR } = item
      const isEnabled = !!enabledAssets?.[activeNetwork!]?.[
          activeWalletId!
          ]?.includes(code)
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
                enableFeature={(newState: boolean) => handleEnableFeature(code, newState)}
                isFeatureEnabled={isEnabled}
              />
            </View>
          </View>
        </Fragment>
      )
    },
    [activeNetwork, activeWalletId, enabledAssets, handleEnableFeature],
  )

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

export default AssetManagementScreen
