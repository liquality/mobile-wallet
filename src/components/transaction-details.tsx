import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type TransactionType = {
  id: string
  status: string
}

const ConfirmationBlock: React.FC<TransactionType> = (
  transaction,
): React.ReactElement => (
  <View style={styles.confirmationBlock}>
    <View style={styles.row}>
      <Text style={styles.label}>From</Text>
      <Text style={styles.address}>0x1234...5678</Text>
    </View>
    <View style={[styles.row]}>
      <Text style={styles.label}>Fee</Text>
      <Text style={styles.amount}>0.000021 ETH/ $0.03</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Confirmations</Text>
      <Text style={styles.amount}>6 {transaction.status} </Text>
    </View>
  </View>
)

const EmptyBlock = () => <View style={styles.emptyBlock} />

const TransactionDetails: React.FC = (): React.ReactElement => {
  const data: TransactionType[] = [
    { id: '1', status: 'start' },
    { id: '2', status: 'locking' },
    { id: '3', status: 'sending' },
    { id: '4', status: 'end' },
  ]

  const renderTransactionStep = ({
    item,
    index,
  }: {
    item: any
    index: number
  }) => {
    return (
      <View style={styles.row}>
        {index % 2 === 0 ? (
          <ConfirmationBlock id={item.id} status={item.status} />
        ) : (
          <EmptyBlock />
        )}
        <View style={styles.progress}>
          {index === 0 && <View style={styles.start} />}
          <View style={styles.separator} />
          <View style={styles.step} />
          <View style={styles.separator} />
          {index === data.length - 1 && <View style={styles.start} />}
        </View>
        {index % 2 === 1 ? (
          <ConfirmationBlock id={item.id} status={item.status} />
        ) : (
          <EmptyBlock />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>TRANSACTION ID</Text>
        <Text style={styles.address}>0x1234...5678</Text>
      </View>
      <View style={styles.sentInfo}>
        <Text>4/27/2020, 6:51pm</Text>
        <Text style={styles.label}>Sent</Text>
      </View>
      <FlatList
        data={data}
        style={styles.list}
        renderItem={renderTransactionStep}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 10,
    color: '#9D4DFA',
  },
  amount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 10,
    color: '#646F85',
  },
  sentInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  step: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#2CD2CF',
  },
  separator: {
    flex: 0.49,
    width: 1,
    height: 20,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#2CD2CF',
  },
  start: {
    width: 10,
    height: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#2CD2CF',
  },
  list: {
    marginTop: 15,
  },
  emptyBlock: {
    width: '45%',
  },
  confirmationBlock: {
    width: '45%',
    paddingVertical: 5,
  },
  progress: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '4%',
    marginHorizontal: 15,
  },
})

export default TransactionDetails
