import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faExchange,
  faLongArrowUp,
} from '@fortawesome/pro-light-svg-icons'

import * as React from 'react'
import { useAppSelector } from '../hooks'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import ProgressCircle from './animations/progress-circle'
import { formatDate } from '../utils'
import { dpUI } from '../core/utils/coin-formatter'
import SuccessIcon from '../assets/icons/success-icon.svg'
import RefundedIcon from '../assets/icons/refunded.svg'
import { BigNumber } from '@liquality/types'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'

const ActivityFlatList = ({
  navigate,
  selectedAsset,
  children,
}: {
  navigate: (...args: any[]) => void
  selectedAsset?: string
  children: React.ReactElement
}) => {
  const { historyItems = [] } = useAppSelector((state) => {
    const { activeNetwork, activeWalletId, history: historyObject } = state

    return {
      fiatRates: state.fiatRates,
      historyItems: (
        historyObject?.[activeNetwork]?.[activeWalletId] || []
      ).filter((item) =>
        selectedAsset ? item.from === selectedAsset : !!item.id,
      ),
    }
  })

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
    const { id, type, startTime, from, to, status } = item
    let transactionLabel, transactionTime, amount, amountInUsd
    if (item.type === TransactionType.Swap) {
      amount = item.fromAmount
      amountInUsd = item.fromAmountUsd
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
      <View style={styles.row} key={id}>
        <View style={styles.col1}>
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
        </View>
        <View style={styles.col2}>
          <Text style={styles.transaction}>{transactionLabel}</Text>
          <Text style={styles.time}>
            {transactionTime && formatDate(transactionTime)}
          </Text>
        </View>
        <View style={styles.col3}>
          <Text style={styles.amount}>
            {amount &&
              `${unitToCurrency(
                cryptoassets[from],
                new BigNumber(amount),
              ).toNumber()} ${from}`}
          </Text>
          <Text style={styles.status}>
            {`$${dpUI(new BigNumber(amountInUsd), 2)}`}
            {`$${amountInUsd}`}
          </Text>
        </View>
        <View style={styles.col4}>
          {status === 'REFUNDED' && <RefundedIcon />}
          {status === 'SUCCESS' && <SuccessIcon />}
          {!['SUCCESS', 'REFUNDED'].includes(status) && (
            <ProgressCircle radius={17} current={2} total={4} />
          )}
        </View>
        <View style={styles.col5}>
          <Pressable onPress={() => handleChevronPress(item)}>
            <FontAwesomeIcon
              size={20}
              icon={faChevronRight}
              color={'#A8AEB7'}
            />
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <FlatList
      data={historyItems}
      renderItem={renderActivity}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={children}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
    paddingVertical: 10,
  },
  col1: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  col2: {
    flex: 0.3,
    justifyContent: 'center',
  },
  col3: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  col4: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col5: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transaction: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
    marginBottom: 5,
  },
  time: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
  },
  amount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#000',
    fontSize: 13,
    marginBottom: 5,
  },
  status: {
    fontFamily: 'Montserrat-Regular',
    color: '#646F85',
    fontSize: 12,
  },
})

export default ActivityFlatList
