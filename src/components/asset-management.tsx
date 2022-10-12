import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import AssetIcon from './asset-icon'
import SearchBox from './ui/search-box'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue, useRecoilState } from 'recoil'
import { networkState, showSearchBarInputState } from '../atoms'
import { Box, faceliftPalette, Text } from '../theme'
import { scale } from 'react-native-size-matters'
import { Asset, ChainId } from '@chainify/types'
import GasModal from '../screens/wallet-features/asset/gas-modal'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AssetRow from './asset-row'

const horizontalContentHeight = 60

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

const AssetManagement = ({ enabledAssets, accounts }: AssetManagementProps) => {
  const [data, setData] = useState<IconAsset[]>([])
  const [assets, setAssets] = useState<CustomAsset[]>([])
  const [mainAssets, setMainAssets] = useState<CustomAsset[]>([])
  const [chainAssets, setChainAssets] = useState<CustomAsset[]>([])
  const [chainCode, setChainCode] = useState('ALL')
  const activeNetwork = useRecoilValue(networkState)
  const [showSearchBox, setShowSearchBox] = useRecoilState(
    showSearchBarInputState,
  )
  const [modalVisible, setModalVisible] = useState(false)

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
        <SearchBox
          mainItems={chainAssets}
          items={assets}
          updateData={setAssets}
        />
      ) : null}
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
