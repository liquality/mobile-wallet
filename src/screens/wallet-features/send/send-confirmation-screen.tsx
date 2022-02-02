import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../../types'
import TransactionDetails from '../../../components/transaction-details'
import { chains, unitToCurrency } from '@liquality/cryptoassets'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { formatDate } from '../../../utils'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/success-icon.svg'

type SendConfirmationScreenProps = StackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
}) => {
  const transaction = route.params.sendTransactionConfirmation!
  const { from, startTime } = transaction
  const {
    value: amount,
    feePrice,
    confirmations = 0,
    status,
  } = transaction?.sendTransaction!

  const handleTransactionSpeedUp = () => {
    //TODO display gas fee selector
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.block, styles.row]}>
        <View>
          <Text style={styles.label}>STATUS</Text>
          <Text style={styles.content}>
            {status === 'SUCCESS'
              ? `Completed / ${
                  chains[cryptoassets[from].chain].safeConfirmations
                } confirmations`
              : `Pending / ${
                  chains[cryptoassets[from].chain].safeConfirmations -
                  confirmations
                } confirmations`}
          </Text>
        </View>
        {status === 'SUCCESS' ? (
          <SuccessIcon />
        ) : (
          <ProgressCircle
            radius={17}
            current={confirmations}
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
        {status !== 'SUCCESS' && (
          <Pressable onPress={handleTransactionSpeedUp}>
            <Text style={styles.link}>Speed Up</Text>
          </Pressable>
        )}
      </View>
      <TransactionDetails
        type="SEND"
        hash={transaction.sendTransaction?.hash}
      />
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
