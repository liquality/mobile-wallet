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
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/src/store/types'
import {
  activityFilterState,
  enabledAssetsState,
  networkState,
} from '../../../atoms'
import { useRecoilState, useRecoilValue } from 'recoil'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import { useTheme } from '@shopify/restyle'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useFilteredHistory } from '../../../custom-hooks'
import HistoryItemComponent from '../../../components/overview/history-item-component'
import ActivtyHeaderComponent from './activity-header-component'

type IconAsset = {
  code: string
  chain: ChainId
}

type ActivityFilterScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'ActivityFilterScreen'
>

const ActivityFilterScreen = ({ navigation }: ActivityFilterScreenProps) => {
  const [data, setData] = React.useState<IconAsset[]>([])
  const [chainCode, setChainCode] = React.useState('ALL')
  const historyItems = useFilteredHistory()
  const [assetFilter, setAssetFilter] = useRecoilState(activityFilterState)
  const activeNetwork = useRecoilValue(networkState)
  const enabledAssets = useRecoilValue(enabledAssetsState)
  const theme = useTheme<ThemeType>()

  const handleUpdateFilter = React.useCallback(
    (payload: any) => {
      setAssetFilter((currVal) => ({ ...currVal, ...payload }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetFilter],
  )

  const handleCodeSortFilter = React.useCallback(
    (value: string) => {
      handleUpdateFilter({ codeSort: value })
    },
    [handleUpdateFilter],
  )

  React.useEffect(() => {
    let myAssets =
      enabledAssets.reduce((assetList: Asset[], asset) => {
        if (getAllAssets().testnet.hasOwnProperty(asset)) {
          assetList.push({
            ...getAsset(activeNetwork, asset),
            contractAddress: getAsset(activeNetwork, asset).contractAddress,
          })
        }
        return assetList
      }, []) || []

    let customArray: IconAsset[] = []

    for (let asset of myAssets) {
      for (let item of historyItems) {
        if (item.from === asset.code) {
          customArray.push({ code: asset.code, chain: asset.chain })
        }
      }
    }

    let tempAssetsIcon: IconAsset[] = customArray.map((accItem) => {
      const item = getAsset(activeNetwork, accItem.code)
      return {
        code: item.code,
        chain: item.chain,
      }
    })

    tempAssetsIcon.unshift({ code: 'ALL', chain: 'ALL' as ChainId })

    setData(tempAssetsIcon)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork])

  const handleChevronPress = React.useCallback(
    (historyItem: HistoryItem) => {
      if (historyItem.type === TransactionType.Swap) {
        navigation.navigate('SwapDetailsScreen', {
          swapTransactionConfirmation: historyItem,
          screenTitle: `Swap ${historyItem.from} to ${historyItem.to} Details`,
        })
      } else if (historyItem.type === TransactionType.Send) {
        navigation.navigate('SendConfirmationScreen', {
          sendTransactionConfirmation: historyItem,
          screenTitle: 'Send Details',
        })
      }
    },
    [navigation],
  )

  const renderAssetIcon = React.useCallback(
    ({ item }: { item: IconAsset }) => {
      const { code, chain } = item
      const onItemPress = () => {
        setChainCode(code)
        handleCodeSortFilter(code)
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
    [chainCode, handleCodeSortFilter],
  )

  const renderHistoryItem = React.useCallback(
    ({ item }: { item: HistoryItem }) => {
      return (
        <HistoryItemComponent
          onPress={() => handleChevronPress(item)}
          item={item}
        />
      )
    },
    [handleChevronPress],
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
        <ActivtyHeaderComponent chainCode={chainCode} network={activeNetwork} />
        <FlatList
          data={historyItems}
          renderItem={renderHistoryItem}
          ListHeaderComponentStyle={{ marginBottom }}
          keyExtractor={(item) => item.id}
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
