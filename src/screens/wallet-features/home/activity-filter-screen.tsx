import * as React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Card, Text, ThemeType } from '../../../theme'
import {
  HORIZONTAL_CONTENT_HEIGHT,
  LARGE_TITLE_HEADER_HEIGHT,
} from '../../../utils'
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
import { AppIcons } from '../../../assets'
import { useTheme } from '@shopify/restyle'
import I18n from 'i18n-js'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'

const { ChevronDown, SwapSuccess, CompletedSwap, ChevronRightIcon } = AppIcons

type IconAsset = {
  code: string
  chain: ChainId
}

interface CustomAsset extends Asset {
  id: string
  showGasLink: boolean
}

type ActivityFilterScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'ActivityFilterScreen'
>

const ActivityFilterScreen = ({ navigation }: ActivityFilterScreenProps) => {
  const [data, setData] = React.useState<IconAsset[]>([])
  const [chainCode, setChainCode] = React.useState('ALL')
  const activeNetwork = useRecoilValue(networkState)
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const theme = useTheme<ThemeType>()
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

  let fakeData = Array(10).fill(10)
  const tapPaddingStyle = theme.spacing.m

  const renderAssetIcon = React.useCallback(
    ({ item }: { item: IconAsset }) => {
      const { code, chain } = item
      const onItemPress = () => {
        setChainCode(code)
      }
      return (
        <Box alignItems={'center'} width={scale(50)} justifyContent="flex-end">
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
          <Box
            width={scale(30)}
            height={scale(1)}
            marginTop={'m'}
            backgroundColor={
              code === chainCode ? 'activeButton' : 'transparent'
            }
          />
        </Box>
      )
    },
    [chainCode],
  )

  const ActivtyHeaderComponent = React.useCallback(() => {
    const resultLength = 1
    const resultString = I18n.t(resultLength > 1 ? 'nosResult' : 'oneResult', {
      count: resultLength,
    })
    return (
      <Box flexDirection={'row'} justifyContent="space-between">
        <Box flexDirection={'row'}>
          <Text variant={'h7'} lineHeight={scale(20)} color="black">
            {resultString}
          </Text>
          <Box
            width={1}
            marginHorizontal="m"
            height={scale(15)}
            backgroundColor="inactiveText"
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ActivityFilterModal', {})}>
            <Text
              variant={'h7'}
              lineHeight={scale(20)}
              color="defaultButton"
              marginRight={'s'}
              tx="sort"
            />
          </TouchableOpacity>
          <Box marginTop={'s'}>
            <ChevronDown width={scale(10)} />
          </Box>
        </Box>
        <Text
          onPress={() =>
            navigation.navigate('AdvancedFilterModal', {
              code: chainCode,
              network: activeNetwork,
            })
          }
          variant={'h7'}
          lineHeight={scale(20)}
          color="defaultButton"
          marginRight={'s'}
          tx="advanced"
        />
      </Box>
    )
  }, [navigation, chainCode, activeNetwork])

  const renderHistoryItem = React.useCallback(
    ({ item }: { item: any }) => {
      return (
        <Box height={scale(77)} flexDirection="row" alignItems={'center'}>
          <CompletedSwap />
          <Box flex={1} alignItems={'center'}>
            <Box width={'85%'} alignItems={'center'}>
              <Box alignSelf="flex-start">
                <Text variant={'h6'} lineHeight={scale(20)} color="darkGrey">
                  10.015493 ARBUSDTUEOHWHE to ARBDAI {item}
                </Text>
              </Box>
              <Box flexDirection={'row'} alignSelf="flex-start">
                <Text variant={'h7'} lineHeight={scale(20)} color="greyMeta">
                  12.30.22, 3:45pm
                </Text>
                <Box
                  width={1}
                  marginHorizontal="m"
                  height={scale(15)}
                  backgroundColor="greyMeta"
                />
                <Text variant={'h7'} lineHeight={scale(20)} color="greyMeta">
                  $123.24
                </Text>
              </Box>
            </Box>
          </Box>
          <Box marginRight={'s'}>
            <SwapSuccess />
          </Box>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ padding: tapPaddingStyle }}>
            <ChevronRightIcon />
          </TouchableOpacity>
        </Box>
      )
    },
    [tapPaddingStyle],
  )

  const marginBottom = theme.spacing.m

  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <Card variant={'headerCard'} height={LARGE_TITLE_HEADER_HEIGHT}>
        <Box flex={1} justifyContent={'flex-end'}>
          <Box
            width={'100%'}
            height={HORIZONTAL_CONTENT_HEIGHT}
            paddingHorizontal="screenPadding">
            <FlatList
              data={data}
              renderItem={renderAssetIcon}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.code}+${index}`}
            />
          </Box>
        </Box>
      </Card>
      <Box flex={1} marginTop="mxxl" paddingHorizontal="screenPadding">
        <ActivtyHeaderComponent />
        <FlatList
          data={fakeData}
          renderItem={renderHistoryItem}
          ListHeaderComponentStyle={{ marginBottom }}
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  chainCodeStyle: {
    alignItems: 'center',
  },
})

export default ActivityFilterScreen
