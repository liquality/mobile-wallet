import * as React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Card, Text } from '../../../theme'
import { LARGE_TITLE_HEADER_HEIGHT } from '../../../utils'
import { Asset, ChainId } from '@chainify/types'
import AssetIcon from '../../../components/asset-icon'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import {
  accountsIdsForMainnetState,
  accountsIdsState,
  enabledAssetsState,
  networkState,
} from '../../../atoms'
import { useRecoilValue } from 'recoil'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'

const horizontalContentHeight = 60

type IconAsset = {
  code: string
  chain: ChainId
}

interface CustomAsset extends Asset {
  id: string
  showGasLink: boolean
}

const ActivityFilterScreen = () => {
  const [data, setData] = React.useState<IconAsset[]>([])
  const [chainCode, setChainCode] = React.useState('ALL')
  const activeNetwork = useRecoilValue(networkState)
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const accounts = useRecoilValue(
    activeNetwork === Network.Testnet
      ? accountsIdsState
      : accountsIdsForMainnetState,
  )

  React.useEffect(() => {
    let myAssets: Asset[] = []

    if (activeNetwork === Network.Testnet) {
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

  const renderAssetIcon = React.useCallback(
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
              variant={'subListText'}
              color="greyMeta"
              marginTop={'l'}>
              {code}
            </Text>
          </TouchableOpacity>
        </Box>
      )
    },
    [chainCode],
  )

  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <Card
        variant={'headerCard'}
        height={LARGE_TITLE_HEADER_HEIGHT}
        paddingHorizontal="xl">
        <Box
          width={'100%'}
          marginTop={'xl'}
          height={scale(horizontalContentHeight)}
          alignItems="center">
          <FlatList
            data={data}
            renderItem={renderAssetIcon}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.code}+${index}`}
          />
        </Box>
      </Card>
    </Box>
  )
}

const styles = StyleSheet.create({
  chainCodeStyle: {
    alignItems: 'center',
  },
})

export default ActivityFilterScreen
