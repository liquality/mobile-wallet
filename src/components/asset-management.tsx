import React, { FC, useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import AssetIcon from './asset-icon'
import SearchBox from './ui/search-box'
import { useRecoilValue } from 'recoil'
import { networkState } from '../atoms'
import { Box, faceliftPalette, HEADER_TITLE_STYLE, Text } from '../theme'
import { scale } from 'react-native-size-matters'
import { Asset, ChainId } from '@chainify/types'
import GasModal from '../screens/wallet-features/asset/gas-modal'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import AssetRow from './asset-row'
import { useHeaderHeight } from '@react-navigation/elements'
import { SCREEN_HEIGHT } from '../utils'
import { AppIcons } from '../assets'

const horizontalContentHeight = 60
const { ChevronLeft } = AppIcons

type IconAsset = {
  code: string
  chain: ChainId
}

type AssetManagementProps = {
  enabledAssets: string[] | undefined
  accounts: { id: string; name: string }[]
  selectedAsset?: string
}

interface CustomAsset extends Asset {
  id: string
  showGasLink: boolean
}

const EmptyComponent = () => {
  const headerHeight = useHeaderHeight()
  return (
    <Box
      height={
        SCREEN_HEIGHT - headerHeight - 2 * horizontalContentHeight // textinput height
      }
      justifyContent="center"
      alignItems={'center'}
      width={'95%'}>
      <Text color={'textColor'} variant="h3" tx="hmm" />
      <Text color={'textColor'} variant="h3" tx="cantFndTkn" />
    </Box>
  )
}

const AssetManagement: FC<AssetManagementProps> = (props) => {
  const { enabledAssets, accounts, selectedAsset, onClose } = props
  const [data, setData] = useState<IconAsset[]>([])
  const [assets, setAssets] = useState<CustomAsset[]>([])
  const [mainAssets, setMainAssets] = useState<CustomAsset[]>([])
  const [chainAssets, setChainAssets] = useState<CustomAsset[]>([])
  const [chainCode, setChainCode] = useState(selectedAsset || 'ALL')
  const activeNetwork = useRecoilValue(networkState)
  const [showSearchBox, setShowSearchBox] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const { BuyCryptoCloseDark, SearchIcon } = AppIcons

  const showModal = () => {
    setModalVisible(true)
  }

  useEffect(() => {
    if (chainCode !== 'ALL') {
      const chain = getAsset(activeNetwork, chainCode).chain

      const result = mainAssets.filter((item) => item.chain === chain)
      setChainAssets(result)
      setAssets(result)
    } else {
      setChainAssets(mainAssets)
      setAssets(mainAssets)
    }
  }, [activeNetwork, chainCode, mainAssets])

  useEffect(() => {
    return () => {
      // unmount and reset search input box
      setShowSearchBox(false)
    }
  }, [])

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (enabledAssets) {
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
    setMainAssets(tempAssets)
    setChainAssets(tempAssets)

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

  const renderAsset = useCallback(({ item }: { item: CustomAsset }) => {
    return <AssetRow assetItems={item} showModal={showModal} />
  }, [])

  const renderAssetIcon = useCallback(
    ({ item }: { item: IconAsset }) => {
      const { code, chain } = item
      const onItemPress = () => {
        setChainCode(code)
      }

      return (
        <Box
          alignItems={'center'}
          borderBottomColor={
            code === chainCode ? 'activeButton' : 'transparent'
          }
          borderBottomWidth={code === chainCode ? scale(1) : 0}
          width={scale(50)}>
          <TouchableOpacity
            onPress={onItemPress}
            activeOpacity={0.7}
            style={styles.chainCodeStyle}>
            <AssetIcon chain={chain} asset={code} />
            <Text
              numberOfLines={1}
              variant={'hintLabel'}
              color="textColor"
              marginTop={'m'}>
              {code}
            </Text>
          </TouchableOpacity>
        </Box>
      )
    },
    [chainCode],
  )

  return (
    <Box
      flex={1}
      backgroundColor={'mainBackground'}
      paddingHorizontal="screenPadding">
      {showSearchBox ? (
        <Box
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          height={scale(50)}>
          <SearchBox
            mainItems={chainAssets}
            items={assets}
            updateData={setAssets}
          />
          <TouchableWithoutFeedback onPress={() => setShowSearchBox(false)}>
            <BuyCryptoCloseDark
              fill={'#646F85'}
              width={scale(15)}
              height={scale(15)}
            />
          </TouchableWithoutFeedback>
        </Box>
      ) : (
        <Box
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          height={scale(50)}>
          <TouchableWithoutFeedback onPress={onClose}>
            <ChevronLeft width={scale(10)} height={scale(10)} />
          </TouchableWithoutFeedback>
          <Text
            style={[
              HEADER_TITLE_STYLE,
              { lineHeight: scale(1.6 * 16), height: scale(1.3 * 16) },
            ]}
            tx="manageAssets"
          />
          <Box paddingHorizontal={'s'} paddingVertical="m">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowSearchBox(true)}>
              <SearchIcon width={scale(15)} height={scale(15)} />
            </TouchableOpacity>
          </Box>
        </Box>
      )}
      <Box
        width={'100%'}
        marginTop={'l'}
        height={scale(horizontalContentHeight)}
        alignItems="center">
        <FlatList
          data={data}
          renderItem={renderAssetIcon}
          horizontal
          contentContainerStyle={styles.contentContainerHorStyle}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.code}+${index}`}
        />
      </Box>
      <FlatList
        data={assets}
        style={styles.flatListStyle}
        contentContainerStyle={styles.contentContainerVerStyle}
        renderItem={renderAsset}
        keyExtractor={(item, index) => `${item.code}+${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyComponent}
      />
      <GasModal
        isVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  contentContainerHorStyle: {
    marginLeft: scale(-5),
    borderBottomColor: faceliftPalette.lightGrey,
    borderBottomWidth: scale(1),
  },
  flatListStyle: {
    marginTop: scale(20),
  },
  contentContainerVerStyle: {
    paddingBottom: scale(10),
  },
  chainCodeStyle: {
    alignItems: 'center',
  },
})

export default AssetManagement
