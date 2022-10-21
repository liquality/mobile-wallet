import * as React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/src/store/types'

import ProgressCircle from './animations/progress-circle'
import ActivityFilter from './activity-filter'
import { useFilteredHistory } from '../custom-hooks'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { formatDate, labelTranslateFn } from '../utils'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { useNavigation } from '@react-navigation/core'
import { OverviewProps } from '../screens/wallet-features/home/overview-screen'
import { useRecoilValue } from 'recoil'
import { networkState, showFilterState } from '../atoms'
import { Text, Box, Pressable } from '../theme'
import { AppIcons } from '../assets'

const {
  ChevronRightIcon: ChevronRight,
  PendingSwap,
  CompletedSwap,
  CompletedIcon: SuccessIcon,
  RefundedIcon,
  SendIcon: Send,
} = AppIcons

const ActivityFlatList = ({
  selectedAsset,
  historyCount = 0,
}: {
  selectedAsset?: string
  historyCount?: number
}) => {
  const navigation = useNavigation<OverviewProps['navigation']>()
  const historyItems = useFilteredHistory()
  const activeNetwork = useRecoilValue(networkState)
  const showFilter = useRecoilValue(showFilterState)

  const history = selectedAsset
    ? historyItems.filter((item) => item.from === selectedAsset)
    : historyItems.filter((item) => !!item.id)

  const handleChevronPress = (historyItem: HistoryItem) => {
    if (historyItem.type === TransactionType.Swap) {
      navigation.navigate('SwapDetailsScreen', {
        swapTransactionConfirmation: historyItem,
        screenTitle: `Swap ${historyItem.from} to ${historyItem.to} Details`,
      })
    } else if (historyItem.type === TransactionType.Send) {
      navigation.navigate('SendConfirmationScreen', {
        sendTransactionConfirmation: historyItem,
        screenTitle: `Send ${historyItem.from} Details`,
      })
    }
  }

  const renderActivity = ({ item }: { item: HistoryItem }) => {
    const { id, type, startTime, from, to, status, network, provider } = item
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
      amountInUsd = item.fromAmountUsd
      const swapProvider = getSwapProvider(network, provider)
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
      <Box
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        paddingVertical="m"
        borderBottomWidth={1}
        borderBottomColor="mainBorderColor"
        key={id}>
        <React.Suspense
          fallback={
            <View>
              <Text tx="loadingActivity" />
            </View>
          }>
          <Box
            flex={0.1}
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="s">
            {type === TransactionType.Swap ? (
              ['SUCCESS', 'REFUNDED'].includes(status) ? (
                <CompletedSwap width={23} height={24} />
              ) : (
                <PendingSwap width={23} height={24} />
              )
            ) : (
              <Send width={16} height={18} />
            )}
          </Box>
          <Box flex={0.3} justifyContent="center">
            <Text variant="label">{transactionLabel}</Text>
            <Text variant="amountLabel">
              {startTime && formatDate(startTime)}
            </Text>
          </Box>
          <Box
            flex={0.4}
            justifyContent="center"
            alignItems="flex-end"
            paddingRight="l">
            <Text variant="amount">{amount && `${amount} ${from}`}</Text>
            {!!amountInUsd && (
              <Text variant="amountLabel">{`$${amountInUsd}`}</Text>
            )}
          </Box>
          <Box flex={0.1} justifyContent="center" alignItems="center">
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
          <Box flex={0.1} justifyContent="center" alignItems="center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleChevronPress(item)}>
              <ChevronRight width={12} height={12} />
            </TouchableOpacity>
          </Box>
        </React.Suspense>
      </Box>
    )
  }

  const onBuyCryptoPress = React.useCallback(() => {
    navigation.navigate('BuyCryptoDrawer', {
      isScrolledUp: false,
      token: '',
      showIntro: false,
      screenTitle: labelTranslateFn('buyCrypto')!,
    })
  }, [navigation])

  return (
    <>
      {showFilter ? <ActivityFilter numOfResults={history.length} /> : null}
      {historyCount || history.length ? (
        <>
          {history.map((item) => {
            return renderActivity({ item })
          })}
        </>
      ) : (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <Text tx="letGetYouStarted" variant={'h3'} color="textColor" />
          <Text
            marginVertical={'l'}
            variant={'activityText'}
            textAlign="center"
            color="textColor">
            Lorem ipsum dolor sit amet, consectetur incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Pressable
            label={{ tx: 'buyCrypto' }}
            onPress={onBuyCryptoPress}
            variant="defaultOutline"
            buttonSize={'half'}
          />
        </Box>
      )}
    </>
  )
}

export default ActivityFlatList
