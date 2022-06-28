import * as React from 'react'
import { FlatList, Pressable } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faExchange,
  faLongArrowUp,
} from '@fortawesome/pro-light-svg-icons'
import { assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'

import ProgressCircle from './animations/progress-circle'
import SuccessIcon from '../assets/icons/activity-status/completed.svg'
import RefundedIcon from '../assets/icons/activity-status/refunded.svg'
import ActivityFilter from './activity-filter'
import { useFilteredHistory } from '../custom-hooks'
import Text from '../theme/text'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory/swap'
import Box from '../theme/box'
import { downloadAssetAcitivity, formatDate } from '../utils'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'

const ActivityFlatList = ({
  navigate,
  selectedAsset,
}: {
  navigate: (...args: any[]) => void
  selectedAsset?: string
}) => {
  const historyItems = useFilteredHistory()
  const history = selectedAsset
    ? historyItems.filter((item) => item.from === selectedAsset)
    : historyItems.filter((item) => !!item.id)

  const handleChevronPress = (historyItem: HistoryItem) => {
    if (historyItem.type === TransactionType.Swap) {
      navigate('SwapConfirmationScreen', {
        swapTransactionConfirmation: historyItem,
        screenTitle: `Swap ${historyItem.from} to ${historyItem.to} Details`,
      })
    } else if (historyItem.type === TransactionType.Send) {
      navigate('SendConfirmationScreen', {
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
        cryptoassets[from],
        new BigNumber(item.fromAmount),
      ).toNumber()
      amountInUsd = item.fromAmountUsd
      const swapProvider = getSwapProvider(network, provider)
      totalSteps = swapProvider.totalSteps
      currentStep = swapProvider.statuses[status].step + 1
    } else if (item.type === TransactionType.Send) {
      amount = unitToCurrency(
        cryptoassets[from],
        new BigNumber(item.amount),
      ).toNumber()
      amountInUsd = prettyFiatBalance(amount, item.fiatRate)
    }

    if (type === TransactionType.Send) {
      transactionLabel = `Send ${from}`
    } else if (type === TransactionType.Swap) {
      transactionLabel = `${from} to ${to}`
    }

    //console.log('In activity flatlist')

    return (
      <Box
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        paddingVertical="m"
        borderBottomWidth={1}
        borderBottomColor="mainBorderColor"
        key={id}>
        <Box
          flex={0.1}
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="s">
          {type === TransactionType.Swap && (
            <FontAwesomeIcon
              size={23}
              icon={faExchange}
              secondaryColor={'#FF287D'}
              color={'#2CD2CF'}
            />
          )}
          {type === TransactionType.Send && (
            <FontAwesomeIcon size={23} icon={faLongArrowUp} color={'#FF287D'} />
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
          {status === 'REFUNDED' && <RefundedIcon />}
          {status === 'SUCCESS' && <SuccessIcon />}
          {!['SUCCESS', 'REFUNDED'].includes(status) && (
            <ProgressCircle
              radius={17}
              current={currentStep}
              total={totalSteps}
            />
          )}
        </Box>
        <Box flex={0.1} justifyContent="center" alignItems="center">
          <Pressable onPress={() => handleChevronPress(item)}>
            <FontAwesomeIcon
              size={20}
              icon={faChevronRight}
              color={'#A8AEB7'}
            />
          </Pressable>
        </Box>
      </Box>
    )
  }

  const handleExport = React.useCallback(() => {
    downloadAssetAcitivity(history as HistoryItem[])

    // This is for better performance
    // i.e, history.length is the only thing that matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.length])

  return (
    <FlatList
      data={history}
      renderItem={renderActivity}
      keyExtractor={(item, index) => `history-item-${index}`}
      ListHeaderComponent={
        <ActivityFilter numOfResults={history.length} onExport={handleExport} />
      }
    />
  )
}

export default ActivityFlatList
