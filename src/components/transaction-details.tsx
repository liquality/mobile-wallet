import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Svg, { Circle, Line } from 'react-native-svg'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faClone } from '@fortawesome/pro-light-svg-icons'
import Clipboard from '@react-native-clipboard/clipboard'
import {
  HistoryItem,
  StateType,
  SwapProvidersEnum,
  TransactionStatusType,
} from '@liquality/core/dist/types'
import { getSwapStatuses } from '../store/store'
import { formatDate } from '../utils'
import { dpUI, prettyFiatBalance } from '../core/utils/coin-formatter'
import { BigNumber } from '@liquality/types'
import { unitToCurrency, assets as cryptoassets } from '@liquality/cryptoassets'
import { useAppSelector } from '../hooks'

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
            `${dpUI(
              new BigNumber(unitToCurrency(cryptoassets[asset], fee)),
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

type TransactionDetailsProps = {
  type: 'SWAP' | 'SEND'
  hash?: string
  id?: string
}
const TransactionDetails: React.FC<TransactionDetailsProps> = (
  props,
): React.ReactElement => {
  const { type, hash, id } = props
  const { fiatRates, history } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
    history: state.history,
  }))
  const [statuses, setStatuses] = useState<TransactionStatusType[]>([])
  const [historyItem, setHistoryItem] = useState<HistoryItem>()

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
    const historyItems =
      history?.filter(
        (item) =>
          item.type === type &&
          (item.swapTransaction?.id === id ||
            item.sendTransaction?.hash === hash),
      ) || []
    if (historyItems.length) {
      setHistoryItem(historyItems[0])
    }
    let transactionStatuses = getSwapStatuses(SwapProvidersEnum.LIQUALITY)
    if (type === 'SWAP') {
      transactionStatuses = getSwapStatuses(SwapProvidersEnum.LIQUALITY)
    } else if (type === 'SEND') {
      transactionStatuses = {
        INITIATED: {
          step: 0,
          label: 'INITIATED',
          filterStatus: '',
        },
        SUCCESS: {
          step: 1,
          label: 'SUCCESS',
          filterStatus: '',
        },
      }
    }
    setStatuses(Object.values(transactionStatuses))
  }, [hash, history, id, type])

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
        <Text style={styles.label}>Started</Text>
        {historyItem.status !== 'SUCCESS' && (
          <Pressable onPress={handleTransactionCancellation}>
            <Text style={styles.link}>Cancel</Text>
          </Pressable>
        )}
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
                asset={historyItem.from}
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
                asset={historyItem.from}
                fiatRates={fiatRates}
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
  link: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#9D4DFA',
  },
})

export default TransactionDetails
