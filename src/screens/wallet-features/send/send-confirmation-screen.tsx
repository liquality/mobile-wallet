import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../../types'
import TransactionDetails from '../../../components/transaction-details'
import { chains, unitToCurrency } from '@liquality/cryptoassets'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { formatDate } from '../../../utils'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import { useAppSelector } from '../../../hooks'
import { HistoryItem } from '@liquality/core/dist/types'

type SendConfirmationScreenProps = StackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const transaction = route.params.sendTransactionConfirmation!
  const { from, startTime } = transaction
  const { value: amount, feePrice } = transaction?.sendTransaction!
  const [historyItem, setHistoryItem] = useState<HistoryItem>(transaction)
  const { history = [] } = useAppSelector((state) => {
    const { activeNetwork, activeWalletId, history: historyObject } = state
    let historyItems: HistoryItem[] = []
    if (activeNetwork && activeWalletId && historyObject) {
      historyItems = historyObject?.[activeNetwork]?.[activeWalletId]
    }
    return {
      history: historyItems,
      activeNetwork,
    }
  })

  const handleTransactionSpeedUp = () => {
    //TODO display gas fee selector
    // if (from && activeNetwork && hash) {
    //   speedUpTransaction(from, activeNetwork, hash, newFee)
    // } else {
    //   Alert.alert('Failed to speed up transaction')
    // }
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  useEffect(() => {
    const historyItems = history.filter(
      (item) =>
        item.type === 'SEND' &&
        item.sendTransaction?.hash === transaction.sendTransaction?.hash,
    )
    if (historyItems.length > 0) {
      setHistoryItem(historyItems[0])
    }
  }, [history, transaction.sendTransaction?.hash])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.block, styles.row]}>
        <View>
          <Text style={styles.label}>STATUS</Text>
          <Text style={styles.content}>
            {historyItem.status === 'SUCCESS'
              ? `Completed / ${
                  chains[cryptoassets[from].chain].safeConfirmations
                } confirmations`
              : `Pending / ${
                  chains[cryptoassets[from].chain].safeConfirmations -
                  (historyItem?.sendTransaction?.confirmations || 0)
                } confirmations`}
          </Text>
        </View>
        {historyItem.status === 'SUCCESS' ? (
          <SuccessIcon />
        ) : (
          <ProgressCircle
            radius={17}
            current={historyItem.sendTransaction?.confirmations || 0}
            total={chains[cryptoassets[from].chain].safeConfirmations}
          />
        )}
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>TIME</Text>
        <Text style={styles.content}>{formatDate(startTime)}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>SENT</Text>
        <Text style={styles.content}>
          {amount &&
            `${unitToCurrency(
              cryptoassets[transaction?.from],
              amount,
            ).toNumber()} ${transaction?.from}`}
        </Text>
      </View>
      <View style={[styles.border, styles.row]}>
        <View>
          <Text style={styles.label}>NETWORK SPEED/FEE</Text>
          <Text style={styles.content}>
            {`${transaction?.from} Fee: ${feePrice}x ${
              chains[cryptoassets[transaction?.from].chain].fees.unit
            }`}
          </Text>
        </View>
        {historyItem.status !== 'SUCCESS' && (
          <Pressable onPress={handleTransactionSpeedUp}>
            <Text style={styles.link}>Speed Up</Text>
          </Pressable>
        )}
      </View>
      <TransactionDetails type="SEND" historyItem={historyItem} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
  block: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  border: {
    justifyContent: 'space-between',
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D9DFE5',
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
  },
  content: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    color: '#646F85',
  },
  link: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#9D4DFA',
  },
})

export default SendConfirmationScreen
