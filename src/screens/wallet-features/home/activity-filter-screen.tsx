import * as React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Box, Card, Text, ThemeType } from '../../../theme'
import {
  formatDate,
  HORIZONTAL_CONTENT_HEIGHT,
  LARGE_TITLE_HEADER_HEIGHT,
} from '../../../utils'
import { Asset, BigNumber, ChainId } from '@chainify/types'
import AssetIcon from '../../../components/asset-icon'
import {
  HistoryItem,
  Network,
  TransactionType,
} from '@liquality/wallet-core/dist/src/store/types'
import {
  accountsIdsForMainnetState,
  accountsIdsState,
  enabledAssetsState,
  networkState,
} from '../../../atoms'
import { useRecoilValue } from 'recoil'
import { getAllAssets, getAsset, unitToCurrency } from '@liquality/cryptoassets'
import { AppIcons } from '../../../assets'
import { useTheme } from '@shopify/restyle'
import I18n from 'i18n-js'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useFilteredHistory } from '../../../custom-hooks'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ProgressCircle from '../../../components/animations/progress-circle'

const {
  ChevronDown,
  CompletedSwap,
  ChevronRightIcon,
  ResetIcon,
  RefundedIcon,
  PendingSwap,
  SendIcon: Send,
  CompletedIcon: SuccessIcon,
} = AppIcons

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
  const historyItems = useFilteredHistory()

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

  const tapPaddingStyle = theme.spacing.m

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
        <Box flexDirection={'row'}>
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
          <Box
            width={1}
            marginHorizontal="m"
            height={scale(15)}
            backgroundColor="inactiveText"
          />
          <Text variant={'h7'} color={'darkGrey'} lineHeight={scale(20)}>
            3
          </Text>
          <Box marginLeft={'s'} style={styles.iconAdjustment}>
            <TouchableOpacity activeOpacity={0.7}>
              <ResetIcon width={scale(20)} />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    )
  }, [navigation, chainCode, activeNetwork])

  const renderHistoryItem = React.useCallback(
    ({ item }: { item: HistoryItem }) => {
      const { type, startTime, from, to, status, network } = item
      let transactionLabel,
        amount,
        amountInUsd,
        totalSteps = 1,
        currentStep = 2
      if (item.type === TransactionType.Swap) {
        amount = unitToCurrency(
          getAsset(activeNetwork, from),
          new BigNumber(item.fromAmount),
        ).toNumber()
        amountInUsd = amount
        const swapProvider = getSwapProvider(network, item.provider)
        totalSteps = swapProvider.totalSteps
        currentStep = swapProvider.statuses[status].step + 1
      } else if (item.type === TransactionType.Send) {
        amount = unitToCurrency(
          getAsset(activeNetwork, from),
          new BigNumber(item.amount),
        ).toNumber()
        amountInUsd = prettyFiatBalance(amount, item.fiatRate)
      }

      if (type === TransactionType.Send) {
        transactionLabel = `Send ${from}`
      } else if (type === TransactionType.Swap) {
        transactionLabel = `${from} to ${to}`
      }

      return (
        <Box height={scale(77)} flexDirection="row" alignItems={'center'}>
          {type === TransactionType.Swap ? (
            ['SUCCESS', 'REFUNDED'].includes(status) ? (
              <CompletedSwap width={23} height={24} />
            ) : (
              <PendingSwap width={23} height={24} />
            )
          ) : (
            <Send width={16} height={18} />
          )}
          <Box flex={1} alignItems={'center'}>
            <Box width={'90%'} alignItems={'center'}>
              <Box alignSelf="flex-start">
                <Text variant={'h6'} lineHeight={scale(20)} color="darkGrey">
                  {transactionLabel}
                </Text>
              </Box>
              <Box flexDirection={'row'} alignSelf="flex-start">
                <Text variant={'h7'} lineHeight={scale(20)} color="greyMeta">
                  {startTime && formatDate(startTime)}
                </Text>
                <Box
                  width={1}
                  marginHorizontal="m"
                  height={scale(15)}
                  backgroundColor="greyMeta"
                />
                <Box width={'35%'}>
                  <Text
                    variant={'h7'}
                    lineHeight={scale(20)}
                    color="greyMeta"
                    numberOfLines={1}>
                    {`$${amountInUsd}`}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box marginRight={'s'}>
            {status === 'REFUNDED' && <RefundedIcon width={28} height={28} />}
            {status === 'SUCCESS' && <SuccessIcon width={28} height={28} />}
            {!['SUCCESS', 'REFUNDED'].includes(status) && (
              <ProgressCircle
                radius={14}
                current={currentStep}
                total={totalSteps}
              />
            )}
          </Box>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleChevronPress(item)}
            style={{ padding: tapPaddingStyle }}>
            <ChevronRightIcon />
          </TouchableOpacity>
        </Box>
      )
    },
    [activeNetwork, handleChevronPress, tapPaddingStyle],
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
  iconAdjustment: {
    marginTop: -scale(2),
  },
})

export default ActivityFilterScreen
