import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronRight,
  faExchange,
  faLongArrowUp,
  faLongArrowDown,
} from '@fortawesome/pro-light-svg-icons'

import * as React from 'react'
import { useWalletState } from '../hooks'
import { HistoryItem } from '@liquality/core/dist/types'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import ProgressCircle from './animations/progress-circle'
import { formatDate } from '../utils'
import { cryptoToFiat } from '../core/utils/coin-formatter'

export type ActivityDataElementType = {
  id: string
  transaction: string
  time: string
  amount: number
  status: string
}

const ActivityFlatList = ({
  navigate,
  children,
}: {
  navigate: (...args: unknown[]) => void
  children: React.ReactElement
}) => {
  const { history = [], fiatRates } = useWalletState()

  const handleChevronPress = (historyItem: HistoryItem) => {
    if (historyItem.type === 'SWAP') {
      navigate('SwapConfirmationScreen', {
        swapTransactionConfirmation: historyItem.swapTransaction,
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
    const {
      type,
      totalSteps,
      startTime,
      sendTransaction,
      swapTransaction,
      from,
      to,
    } = item
    let transactionLabel, amountInNative, amountInFiat, transactionTime

    if (type === 'SEND') {
      transactionLabel = `Send ${from}`
      amountInNative = sendTransaction?.value
      amountInFiat = cryptoToFiat(
        unitToCurrency(cryptoassets[from], sendTransaction?.value).toNumber(),
        fiatRates[from],
      )
      transactionTime = startTime
    } else if (type === 'SWAP') {
      transactionLabel = `${from} to ${to}`
      amountInNative = swapTransaction?.fromAmount
      amountInFiat = swapTransaction?.fromAmountUsd
      transactionTime = startTime
    }

    return (
      <View style={styles.row} key={item.id}>
        <View style={styles.col1}>
          {type === 'SWAP' && (
            <FontAwesomeIcon
              size={23}
              icon={faExchange}
              secondaryColor={'#FF287D'}
              color={'#2CD2CF'}
            />
          )}
          {type === 'SEND' && (
            <FontAwesomeIcon size={23} icon={faLongArrowUp} color={'#FF287D'} />
          )}
          {type === 'RECEIVE' && (
            <FontAwesomeIcon
              size={23}
              icon={faLongArrowDown}
              color={'#2CD2CF'}
            />
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
            {amountInNative &&
              `${unitToCurrency(
                cryptoassets[from],
                amountInNative,
              ).toNumber()} ${from}`}
          </Text>
          <Text style={styles.status}>{`$${amountInFiat}`}</Text>
        </View>
        <View style={styles.col4}>
          <ProgressCircle radius={17} current={2} total={totalSteps} />
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
      data={history}
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
    marginRight: 5,
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
