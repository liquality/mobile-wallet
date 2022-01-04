import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../../types'
import TransactionDetails from '../../../components/transaction-details'

type SendConfirmationScreenProps = StackScreenProps<
  RootStackParamList,
  'SendConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SendConfirmationScreenProps> = ({
  route,
}) => {
  const { amount, asset } = route.params.sendTransaction || {}

  return (
    <View style={styles.container}>
      <View style={[styles.block, styles.row]}>
        <View>
          <Text style={styles.label}>STATUS</Text>
          <Text style={styles.content}>Pending 4 confirmations</Text>
        </View>
        <Text>Status</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>TIME</Text>
        <Text style={styles.content}>{new Date().toUTCString()}</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>SENT</Text>
        <Text style={styles.content}>
          {amount && `${amount.dp(6)} ${asset}`}
        </Text>
      </View>
      <View style={styles.border}>
        <Text style={styles.label}>NETWORK SPEED/FEE</Text>
        <Text style={styles.content}>
          {asset} Fee: 0.0x [TKN/unit] | 0.0x gwei
        </Text>
      </View>
      <TransactionDetails />
    </View>
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
})

export default SendConfirmationScreen
