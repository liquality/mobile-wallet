import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClone } from '@fortawesome/pro-light-svg-icons'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  HistoryItem,
  SwapProvidersEnum,
  TransactionStatusType,
} from '@liquality/core/dist/types'
import { getSwapStatuses } from '../store/store'
import { formatDate } from '../utils'

type ConfirmationBlockProps = {
  address: string
  status: string
  fee: number
  confirmations: number
}

const ConfirmationBlock: React.FC<ConfirmationBlockProps> = (
  props,
): React.ReactElement => {
  const { address, status, fee, confirmations } = props

  const handleCopyAddressPress = async () => {
    Clipboard.setString(address)
    // setButtonPressed(true)
  }

  return (
    <View style={styles.confirmationBlock}>
      <View style={styles.row}>
        <Text style={[styles.label, styles.status]}>{status}</Text>
        <Pressable style={styles.copyBtn} onPress={handleCopyAddressPress}>
          <FontAwesomeIcon icon={faClone} color={'#9C4DF9'} size={10} />
        </Pressable>
      </View>
      <View style={[styles.row]}>
        <Text style={styles.label}>Fee</Text>
        <Text style={styles.amount}>{fee} 0.000021 ETH/ $0.03</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Confirmations</Text>
        <Text style={styles.amount}>{confirmations} </Text>
      </View>
    </View>
  )
}

const EmptyBlock = () => <View style={styles.emptyBlock} />

const Step = ({ completed }: { completed: boolean }) => (
  <View>
    <Svg height="10" width="10">
      <Circle cx="5" cy="5" r="5" fill={completed ? '#2CD2CF' : '#A8AEB7'} />
    </Svg>
  </View>
)

const Separator = ({ completed }: { completed: boolean }) => (
  <View>
    <Svg height="55" width="10">
      <Line
        x1={5}
        y1={0}
        x2={5}
        y2={55}
        strokeWidth={2}
        strokeDasharray={[1, 1]}
        fill="none"
        stroke={completed ? '#2CD2CF' : '#A8AEB7'}
      />
    </Svg>
  </View>
)
const TransactionDetails: React.FC<{ historyItem: HistoryItem }> = (
  props,
): React.ReactElement => {
  const { type, startTime, sendTransaction, swapTransaction } =
    props.historyItem
  const [statuses, setStatuses] = useState<TransactionStatusType[]>([])

  const getConfirmation = (
    step: number,
  ): { confirmations: number; address: string; fee: number } => {
    if (type === 'SWAP' && swapTransaction) {
      const {
        fromFundTx,
        toFundTx,
        toClaimTx,
        fromAddress,
        toAddress,
        fee,
        claimFee,
      } = swapTransaction
      if (step === 0) {
        return {
          confirmations: fromFundTx?.confirmations || 0,
          address: fromAddress,
          fee,
        }
      } else if (step === 1) {
        return {
          confirmations: toFundTx?.confirmations || 0,
          address: toAddress,
          fee: claimFee,
        }
      } else {
        return {
          confirmations: toClaimTx?.confirmations || 0,
          address: fromAddress,
          fee,
        }
      }
    } else if (type === 'SEND' && sendTransaction) {
      const { confirmations = 0, _raw, fee } = sendTransaction
      return {
        confirmations,
        address: _raw.address,
        fee,
      }
    }

    return {}
  }

  useEffect(() => {
    const transactionStatuses = getSwapStatuses(SwapProvidersEnum.LIQUALITY)
    setStatuses(Object.values(transactionStatuses))
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.sentInfo}>
        <Text style={styles.label}>{formatDate(startTime)}</Text>
        <Text style={styles.label}>Started</Text>
      </View>
      {statuses.map((item, index) => {
        const payload = getConfirmation(item.step)
        return (
          <View key={`${item.filterStatus}-${index}`} style={styles.row}>
            {index % 2 === 0 ? (
              <ConfirmationBlock
                address={payload.address}
                status={item.label}
                confirmations={payload.confirmations}
                fee={payload.fee}
              />
            ) : (
              <EmptyBlock />
            )}
            <View style={styles.progress}>
              {index === 0 && (
                <>
                  <View style={styles.start} />
                  <Separator completed={index <= item.step} />
                </>
              )}
              <Step completed={index <= item.step} />
              <Separator completed={index <= item.step} />
              {index === statuses.length - 1 && <View style={styles.start} />}
            </View>
            {index % 2 === 1 ? (
              <ConfirmationBlock
                address={payload.address}
                status={item.label}
                confirmations={payload.confirmations}
                fee={payload.fee}
              />
            ) : (
              <EmptyBlock />
            )}
          </View>
        )
      })}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    marginRight: 5,
  },
  status: {
    fontWeight: '600',
    color: '#9C4DF9',
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
  centered: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  copyBtn: {
    marginLeft: 5,
  },
})

export default TransactionDetails
