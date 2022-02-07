import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClone } from '@fortawesome/pro-light-svg-icons'
import Clipboard from '@react-native-clipboard/clipboard'
import { HistoryItem, StateType } from '@liquality/core/dist/types'
import { formatDate } from '../utils'
import {
  dpUI,
  gasUnitToCurrency,
  prettyFiatBalance,
} from '../core/utils/coin-formatter'
import { BigNumber } from '@liquality/types'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import { useAppSelector } from '../hooks'
import Label from './ui/label'

type ConfirmationBlockProps = {
  address?: string
  status: string
  fee?: number
  confirmations: number
  asset: string
  fiatRates: StateType['fiatRates']
}

const ConfirmationBlock: React.FC<ConfirmationBlockProps> = (
  props,
): React.ReactElement => {
  const { address, status, fee, confirmations, asset, fiatRates } = props

  const handleCopyAddressPress = async () => {
    if (address) {
      Clipboard.setString(address)
    }
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
        <Text style={styles.amount}>
          {fiatRates &&
            fee &&
            asset &&
            `${dpUI(
              new BigNumber(gasUnitToCurrency(asset, new BigNumber(fee))),
              9,
            )} ${asset}/ $${prettyFiatBalance(
              unitToCurrency(cryptoassets[asset], fee).toNumber(),
              fiatRates[asset],
            )}`}
        </Text>
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

type TimelineInfo = {
  step: number
  label: string
  asset?: string
  fee?: string
  confirmations?: number
}

type TransactionDetailsProps = {
  type: 'SWAP' | 'SEND'
  historyItem: HistoryItem
}
const TransactionDetails: React.FC<TransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { type, historyItem } = props
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))
  const [statuses, setStatuses] = useState<TimelineInfo[]>([])

  const getConfirmation = (
    step: number,
  ): { confirmations: number; address?: string; fee?: number } => {
    if (type === 'SWAP' && historyItem?.swapTransaction) {
      const {
        fromFundTx,
        toFundTx,
        toClaimTx,
        fromAddress,
        toAddress,
        fee,
        claimFee,
      } = historyItem.swapTransaction
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
    } else if (type === 'SEND' && historyItem?.sendTransaction) {
      const { confirmations = 0, _raw, fee } = historyItem.sendTransaction
      return {
        confirmations,
        address: _raw.address,
        fee,
      }
    }

    return {
      confirmations: 0,
    }
  }

  const handleTransactionCancellation = () => {
    //TODO display gas fee selector
  }

  useEffect(() => {
    let transactionStatuses: TimelineInfo[] = []
    if (!historyItem) {
      return
    }

    const { to, from } = historyItem
    if (type === 'SWAP') {
      // transactionStatuses = getSwapStatuses(SwapProvidersEnum.LIQUALITY)
      const { fromFundTx, toFundTx, toClaimTx } = historyItem.swapTransaction
      transactionStatuses = [
        {
          step: 1,
          label: `Locked ${from}`,
          asset: from,
          fee: fromFundTx?.fee,
          confirmations: fromFundTx?.confirmations,
        },
        {
          step: 2,
          label: `Locked ${to}`,
          asset: to,
          fee: toFundTx?.fee,
          confirmations: toFundTx?.confirmations,
        },
        {
          step: 3,
          label: `Claimed ${from}`,
          asset: from,
          fee: toClaimTx?.fee,
          confirmations: toClaimTx?.confirmations,
        },
      ]
    } else if (type === 'SEND') {
      const { confirmations, fee } = historyItem.sendTransaction
      transactionStatuses = [
        {
          step: 1,
          label: `Initiated ${from} Transfer`,
          asset: from,
          fee,
          confirmations,
        },
        {
          step: 2,
          label: 'Done',
        },
      ]
    }
    if (transactionStatuses) {
      setStatuses(transactionStatuses)
    }
  }, [historyItem, historyItem.swapTransaction, type])

  if (!historyItem) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.sentInfo}>
        <Text style={styles.label}>{formatDate(historyItem.startTime)}</Text>
        <Label text="Started" variant="strong" />
        {historyItem.status !== 'SUCCESS' && (
          <Pressable onPress={handleTransactionCancellation}>
            <Text style={styles.link}>Cancel</Text>
          </Pressable>
        )}
      </View>

      {statuses.map((item, index) => {
        const payload = getConfirmation(item.step)
        return (
          <View key={`${item.label}-${index}`} style={styles.row}>
            {index % 2 === 0 ? (
              <ConfirmationBlock
                address={payload.address}
                status={item.label}
                confirmations={payload.confirmations}
                fee={payload.fee}
                asset={item.asset}
                fiatRates={fiatRates}
              />
            ) : (
              <EmptyBlock />
            )}
            <View style={styles.progress}>
              {index === 0 && (
                <>
                  <View style={styles.start} />
                  <Separator completed={item.step <= historyItem.currentStep} />
                </>
              )}
              <Step completed={item.step <= historyItem.currentStep} />
              <Separator completed={item.step <= historyItem.currentStep} />
              {index === statuses.length - 1 && <View style={styles.start} />}
            </View>
            {index % 2 === 1 ? (
              <ConfirmationBlock
                address={payload.address}
                status={item.label}
                confirmations={payload.confirmations}
                fee={payload.fee}
                asset={item.asset}
                fiatRates={fiatRates}
              />
            ) : (
              <EmptyBlock />
            )}
          </View>
        )
      })}

      {historyItem.status === 'SUCCESS' && (
        <View style={styles.sentInfo}>
          <Label text="Completed" variant="strong" />
          <Text style={styles.label}>{formatDate(historyItem.endTime)}</Text>
        </View>
      )}
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
  link: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#9D4DFA',
  },
})

export default TransactionDetails
