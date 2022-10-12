import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { getAllAssets, getAsset, unitToCurrency } from '@liquality/cryptoassets'
import AssetIcon from './asset-icon'
import Switch from './ui/switch'
import SearchBox from './ui/search-box'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  balanceStateFamily,
  fiatRatesState,
  networkState,
  showSearchBarInputState,
} from '../atoms'
import { Box, faceliftPalette, Text } from '../theme'
import { scale } from 'react-native-size-matters'
import { Asset, BigNumber, ChainId } from '@chainify/types'
import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import GasModal from '../screens/wallet-features/asset/gas-modal'

const scrollElementHeightPercent = 10
const scrollElementHeightPercentStr = `${scrollElementHeightPercent}%`
const horizontalContentHeight = 60
const horizontalScrollPosition = horizontalContentHeight

type IconAsset = {
  code: string
  chain: ChainId
}

type AssetManagementProps = {
  enabledAssets: string[] | undefined
  accounts: { id: string; name: string }[]
}

interface CustomAsset extends Asset {
  id: string
  showGasLink: boolean
}

const AssetRow = ({
  assetItems,
  showModal,
}: {
  assetItems: CustomAsset
  showModal: () => void
}) => {
  const { name, code, chain, id } = assetItems
  const [prettyFiatBalance, setPrettyFiatBalance] = useState('0')
  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const balance = useRecoilValue(
    balanceStateFamily({
      asset: code,
      assetId: id,
    }),
  )

  useEffect(() => {
    const fiatBalance = fiatRates[code]
      ? cryptoToFiat(
          unitToCurrency(
            getAsset(activeNetwork, getNativeAsset(code)),
            balance,
          ).toNumber(),
          fiatRates[code],
        )
      : 0
    setPrettyFiatBalance(`$${formatFiat(new BigNumber(fiatBalance))}`)
  }, [activeNetwork, balance, code, fiatRates])

  return (
    <Box flexDirection={'row'} alignItems="center" marginTop={'xl'}>
      <AssetIcon chain={chain} asset={code} />
      <Box flex={1} marginLeft="m">
        <Text variant={'listText'} color="darkGrey">
          {name} ({code})
        </Text>
        <Text variant={'subListText'} color="greyMeta">
          {prettyFiatBalance}
        </Text>
      </Box>
      {assetItems.showGasLink ? (
        <Box
          width={30}
          alignSelf="flex-start"
          marginTop={'s'}
          paddingRight={'s'}
          justifyContent="flex-end">
          <Text onPress={showModal} variant={'subListText'} color="link">
            Gas
          </Text>
        </Box>
      ) : (
        <Box paddingRight={'s'}>
          <Switch asset={code} />
        </Box>
      )}
    </Box>
  )
}

const AssetManagement = ({ enabledAssets, accounts }: AssetManagementProps) => {
  const [data, setData] = useState<IconAsset[]>([])
  const [assets, setAssets] = useState<CustomAsset[]>([])
  const [mainAssets, setMaiAssets] = useState<CustomAsset[]>([])
  const activeNetwork = useRecoilValue(networkState)
  const [showSearchBox, setShowSearchBox] = useRecoilState(
    showSearchBarInputState,
  )
  const [contentOffset, setContentOffset] = useState({ x: 0, y: 0 })
  const [contentSize, setContentSize] = useState(0)
  const [scrollViewWidth, setScrollViewWidth] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)

  const showModal = () => {
    setModalVisible(true)
  }

  const renderAsset = useCallback(({ item }: { item: CustomAsset }) => {
    return <AssetRow assetItems={item} showModal={showModal} />
  }, [])

  const renderAssetIcon = useCallback(({ item }: { item: IconAsset }) => {
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

    let tempAssets: Array<CustomAsset> = []
    for (let assetItem of myAssets) {
      let added = false
      accounts.forEach((accItem) => {
        if (assetItem.code === accItem.name) {
          added = true
          tempAssets.push({ ...assetItem, id: accItem.id, showGasLink: true })
        }
        if (!added) {
          const chain = getAsset(activeNetwork, accItem.name).chain
          if (chain === assetItem.chain) {
            tempAssets.push({
              ...assetItem,
              id: accItem.id,
              showGasLink: false,
            })
          }
        }
      })
    }

    setAssets(tempAssets)
    setMaiAssets(tempAssets)

    let tempAssetsIcon: IconAsset[] = accounts.map((accItem) => {
      const item = getAsset(activeNetwork, accItem.name)
      return {
        code: item.code,
        chain: item.chain,
      }
    })

    tempAssetsIcon.unshift({ code: 'ALL', chain: 'ALL' as ChainId })

    setData(tempAssetsIcon)
  }, [accounts, activeNetwork, enabledAssets])

  const scrollPerc =
    (contentOffset.x / (contentSize - scrollViewWidth)) *
    (100 - scrollElementHeightPercent)

  return (
    <Box
      flex={1}
      backgroundColor={'mainBackground'}
      paddingHorizontal="screenPadding">
      {showSearchBox ? (
        <SearchBox
          mainItems={mainAssets}
          items={assets}
          updateData={setAssets}
        />
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
        keyExtractor={(item, index) => `${item.code}+${index}`}
        showsVerticalScrollIndicator={false}
      />
      <GasModal
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
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
