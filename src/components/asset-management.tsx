import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import AssetIcon from './asset-icon'
import Switch from './ui/switch'
import SearchBox from './ui/search-box'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue } from 'recoil'
import { networkState } from '../atoms'
import { Box, palette } from '../theme'
import { Fonts } from '../assets'
import { Asset } from '@chainify/types'

const DEFAULT_COLOR = palette.defaultColor
const AssetManagement = ({
  enabledAssets,
}: {
  enabledAssets: string[] | undefined
}) => {
  const [data, setData] = useState<Asset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const activeNetwork = useRecoilValue(networkState)

  const renderAsset = useCallback(({ item }: { item: Asset }) => {
    const { name, code, chain, color = DEFAULT_COLOR } = item
    return (
      <Fragment>
        <View style={[styles.row, { borderLeftColor: color || DEFAULT_COLOR }]}>
          <View style={styles.col1}>
            <AssetIcon chain={chain} asset={code} />
          </View>
          <View style={styles.col2}>
            <Text style={styles.code}>{name}</Text>
          </View>
          <View style={styles.col3}>
            <Switch asset={code} />
          </View>
        </View>
      </Fragment>
    )
  }, [])

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (activeNetwork === Network.Testnet && enabledAssets) {
      myAssets =
        enabledAssets.reduce((assetList: Asset[], asset) => {
          if (getAllAssets().testnet.hasOwnProperty(asset)) {
            assetList.push({
              ...getAsset(activeNetwork, asset),
              contractAddress: getAsset(activeNetwork, asset).contractAddress,
            })
          }
          return assetList
        }, []) || []
    } else {
      myAssets = Object.keys(getAllAssets().mainnet).map((key) =>
        getAsset(activeNetwork, key),
      )
    }
    setAssets(myAssets)
    setData(myAssets)
  }, [activeNetwork, enabledAssets])

  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <SearchBox items={assets} updateData={setData} />
      <FlatList
        data={data}
        renderItem={renderAsset}
        keyExtractor={(item) => item.code}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: palette.gray,
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
    fontFamily: Fonts.Regular,
    color: palette.black2,
    fontSize: 12,
    marginBottom: 5,
  },
})

export default AssetManagement
