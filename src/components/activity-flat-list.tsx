import { FlatList, Pressable, StyleSheet } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faExchange,
  faLongArrowUp,
} from '@fortawesome/pro-light-svg-icons'

import * as React from 'react'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import ProgressCircle from './animations/progress-circle'
import { formatDate } from '../utils'
import SuccessIcon from '../assets/icons/activity-status/completed.svg'
import RefundedIcon from '../assets/icons/activity-status/refunded.svg'
import { BigNumber } from '@liquality/types'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'
import ActivityFilter from './activity-filter'
import { useFilteredHistory } from '../custom-hooks'
import Text from '../theme/text'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory/swapProvider'
import Box from '../theme/box'

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
    if (historyItem.type === 'SWAP') {
      navigate('SwapConfirmationScreen', {
        swapTransactionConfirmation: historyItem,
        screenTitle: `Swap ${historyItem.from} to ${historyItem.to} Details`,
      })
    } else if (historyItem.type === 'SEND') {
      navigate('SendConfirmationScreen', {
        sendTransactionConfirmation: historyItem,
        screenTitle: `Send ${historyItem.from} Details`,
      })
    }
  }

  const renderActivity = ({ item }: { item: HistoryItem }) => {
    const { id, type, startTime, from, to, status, network, provider } = item
    let transactionLabel,
      transactionTime,
      amount,
      amountInUsd,
      totalSteps = 1,
      currentStep = 2
    if (item.type === TransactionType.Swap) {
      amount = item.fromAmount
      amountInUsd = item.fromAmountUsd
      const swapProvider = getSwapProvider(network, provider)
      totalSteps = swapProvider.totalSteps
      currentStep = swapProvider.statuses[status].step + 1
    } else if (item.type === TransactionType.Send) {
      amount = item.amount
      amountInUsd = item.amount
    }

    if (type === TransactionType.Send) {
      transactionLabel = `Send ${from}`
      transactionTime = startTime
    } else if (type === TransactionType.Swap) {
      transactionLabel = `${from} to ${to}`
      transactionTime = startTime
    }

    return (
      <Box
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        paddingVertical="m"
        style={styles.row}
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
          <Text style={styles.transaction}>{transactionLabel}</Text>
          <Text variant="amountLabel">
            {transactionTime && formatDate(transactionTime)}
          </Text>
        </Box>
        <Box
          flex={0.4}
          justifyContent="center"
          alignItems="flex-end"
          paddingRight="l">
          <Text variant="amount">
            {amount &&
              `${unitToCurrency(
                cryptoassets[from],
                new BigNumber(amount),
              ).toNumber()} ${from}`}
          </Text>
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

  return (
    <FlatList
      data={history}
      renderItem={renderActivity}
      keyExtractor={(item, index) => `history-item-${index}`}
      ListHeaderComponent={<ActivityFilter numOfResults={history.length} />}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
  },
  transaction: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
    marginBottom: 5,
  },
})

export default ActivityFlatList
