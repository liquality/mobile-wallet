import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import AssetIcon from './asset-icon'
import Switch from './ui/switch'
import SearchBox from './ui/search-box'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { networkState, showSearchBarInputState } from '../atoms'
import { Box, faceliftPalette, Text } from '../theme'
import { scale } from 'react-native-size-matters'
import { Asset, ChainId } from '@chainify/types'

const scrollElementHeightPercent = 10
const scrollElementHeightPercentStr = `${scrollElementHeightPercent}%`
const horizontalContentHeight = 60
const horizontalScrollPosition = horizontalContentHeight

type CustomAsset = {
  code: string
  chain: ChainId
}

const AssetManagement = ({
  enabledAssets,
}: {
  enabledAssets: string[] | undefined
}) => {
  const [data, setData] = useState<CustomAsset[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const activeNetwork = useRecoilValue(networkState)
  const [showSearchBox, setShowSearchBox] = useRecoilState(
    showSearchBarInputState,
  )

  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 })
  const [contentSize, setContentSize] = useState(0)
  const [scrollViewWidth, setScrollViewWidth] = useState(0)

  const renderAsset = useCallback(({ item }: { item: Asset }) => {
    const { name, code, chain } = item
    return (
      <Box flexDirection={'row'} alignItems="center" marginTop={'xl'}>
        <AssetIcon chain={chain} asset={code} />
        <Box flex={1} marginLeft="m">
          <Text variant={'listText'} color="darkGrey">
            {name} ({code})
          </Text>
          <Text variant={'subListText'} color="greyMeta">
            $1527
          </Text>
        </Box>
        {/* <Box
          width={30}
          alignSelf="flex-start"
          marginTop={'s'}
          justifyContent="flex-end">
          <Text>Gas</Text>
        </Box> */}
        <Box paddingRight={'m'}>
          <Switch asset={code} />
        </Box>
      </Box>
    )
  }, [])

  const renderAssetIcon = useCallback(({ item }: { item: CustomAsset }) => {
    const { code, chain } = item
    return (
      <Box alignItems={'center'} width={scale(50)}>
        <AssetIcon chain={chain} asset={code} />
        <Text
          numberOfLines={1}
          variant={'hintLabel'}
          color="textColor"
          marginTop={'m'}>
          {code}
        </Text>
      </Box>
    )
  }, [])

  useEffect(() => {
    return () => {
      // unmount and reset search input box
      setShowSearchBox(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (activeNetwork === Network.Testnet) {
      myAssets =
        enabledAssets?.reduce((assetList: Asset[], asset) => {
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

    let tempAssets: CustomAsset[] = myAssets.map((item) => ({
      code: item.code,
      chain: item.chain,
    }))

    tempAssets.unshift({ code: 'ALL', chain: 'ALL' as ChainId })

    setData(tempAssets)
  }, [activeNetwork, enabledAssets])

  const scrollPerc =
    (contentOffset.x / (contentSize - scrollViewWidth)) *
    (100 - scrollElementHeightPercent)

  return (
    <Box
      flex={1}
      backgroundColor={'mainBackground'}
      paddingHorizontal="screenPadding">
      {showSearchBox ? (
        <SearchBox items={assets} updateData={setAssets} />
      ) : null}

      <Box
        width={'100%'}
        marginTop={'l'}
        height={scale(horizontalContentHeight)}
        alignItems="center">
        <Box style={styles.scrollBackgroundStyle}>
          <Box
            left={`${Number(scrollPerc || 0).toFixed(0)}%`}
            style={styles.scrollIndicatorstyle}
          />
        </Box>
        <FlatList
          data={data}
          renderItem={renderAssetIcon}
          horizontal
          contentContainerStyle={styles.contentContainerHorStyle}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.code}
          onScroll={(e) => {
            setContentOffset(e.nativeEvent.contentOffset)
          }}
          onContentSizeChange={(width, _) => {
            setContentSize(width)
          }}
          onLayout={(e) => {
            setScrollViewWidth(e.nativeEvent.layout.width)
          }}
        />
      </Box>
      <FlatList
        data={assets}
        style={styles.flatListStyle}
        contentContainerStyle={styles.contentContainerVerStyle}
        renderItem={renderAsset}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  scrollBackgroundStyle: {
    position: 'absolute',
    top: scale(horizontalScrollPosition),
    width: '95%',
    height: scale(1),
    backgroundColor: faceliftPalette.lightGrey,
    zIndex: 1,
    overflow: 'hidden',
  },
  scrollIndicatorstyle: {
    position: 'absolute',
    height: scale(2),
    width: scrollElementHeightPercentStr,
    backgroundColor: faceliftPalette.buttonActive,
  },
  contentContainerHorStyle: {
    marginLeft: scale(-5),
  },
  flatListStyle: {
    marginTop: scale(20),
  },
  contentContainerVerStyle: {
    paddingBottom: scale(10),
  },
})

export default AssetManagement
