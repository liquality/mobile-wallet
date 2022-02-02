import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../../types'
import TransactionDetails from '../../../components/transaction-details'
import {
  unitToCurrency,
  assets as cryptoassets,
  chains,
} from '@liquality/cryptoassets'
import { cryptoToFiat, formatFiat } from '../../../core/utils/coin-formatter'
import { useAppSelector } from '../../../hooks'
import LiqualityButton from '../../../components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faAngleDown,
  faAngleRight,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import Label from '../../../components/ui/label'
import ProgressCircle from '../../../components/animations/progress-circle'
import ProgressBar from '../../../components/animations/progress-bar'

type SwapConfirmationScreenProps = StackScreenProps<
  RootStackParamList,
  'SwapConfirmationScreen'
>

const SendConfirmationScreen: React.FC<SwapConfirmationScreenProps> = ({
  route,
}) => {
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))
  const transaction = route.params.swapTransactionConfirmation
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [isCompleted, setCompleted] = useState(false)
  const {
    fromAmount,
    from,
    to,
    toAmount,
    status,
    createdAt,
    expiresAt,
    fee,
    fromFundTx,
    fromCounterPartyAddress,
    toCounterPartyAddress,
    orderId,
    rate,
    minConf,
    secret,
    secretHash,
  } = transaction

  const formatDate = (ms: string | number): string => {
    const date = new Date(ms)
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  }

  const elapsedTime = (date: string) => {
    const startTime = Date.parse(date)
    const elapsed = Date.now() - startTime
    const minutes = Math.floor(elapsed / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${remainingMinutes}hr`
  }

  const remainingTime = (expirationTime: number) => {
    const remainder = expirationTime - Date.now()
    const minutes = Math.floor(remainder / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${remainingMinutes}hr`
  }

  const handleSpeedUpTransaction = () => {
    //display gas fee selector
  }

  useEffect(() => {
    setCompleted(expiresAt - Date.now() <= 0)
  }, [expiresAt])

  if (!transaction) {
    return <View style={styles.container} />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.block, styles.row]}>
        <View>
          <Text style={styles.label}>STATUS</Text>
          <Text style={styles.content}>{status}</Text>
        </View>
        <Pressable onPress={handleSpeedUpTransaction}>
          <Text style={[styles.textButton, styles.link]}>Speed Up</Text>
        </Pressable>
        <ProgressCircle radius={17} current={2} total={4} />
      </View>
      <View style={styles.block}>
        <Text style={styles.label}>Trade Time</Text>
        {isCompleted && (
          <View style={styles.row}>
            <FontAwesomeIcon icon={faClock} size={15} color="#9C55F6" />
            <Text style={styles.content}>{elapsedTime(createdAt)}</Text>
            <ProgressBar
              width={Dimensions.get('screen').width - 150}
              total={100}
              current={10}
            />
            <Text style={styles.content}>{remainingTime(expiresAt)}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.content}>{`Initiated ${formatDate(
            Date.parse(createdAt),
          )}`}</Text>
          <Text style={styles.content}>{`${
            isCompleted ? 'Completed' : 'Expires'
          } ${formatDate(expiresAt)}`}</Text>
        </View>
      </View>
      <View style={[styles.block, styles.row]}>
        <View>
          <Text style={styles.label}>SENT</Text>
          <Text style={styles.content}>
            {fromAmount &&
              `${unitToCurrency(cryptoassets[from], fromAmount)} ${from}`}
          </Text>
          <Text style={styles.content}>
            {`$${formatFiat(
              cryptoToFiat(
                unitToCurrency(cryptoassets[from], fromAmount).toNumber(),
                fiatRates?.[from] || 0,
              ).toNumber(),
            )}`}
          </Text>
        </View>
        <View>
          <Text style={styles.label}>PENDING RECEIPT</Text>
          <Text style={styles.content}>
            {fromAmount &&
              `${unitToCurrency(cryptoassets[to], toAmount)} ${to}`}
          </Text>
          <Text style={styles.content}>
            {`$${formatFiat(
              cryptoToFiat(
                unitToCurrency(cryptoassets[to], toAmount).toNumber(),
                fiatRates?.[to] || 0,
              ).toNumber(),
            )}`}
          </Text>
        </View>
      </View>
      <View style={styles.border}>
        <Text style={styles.label}>NETWORK SPEED/FEE</Text>
        <Text style={styles.content}>
          {`${from} Fee: ${fee} ${chains[cryptoassets[from].chain].fees.unit}`}
        </Text>
        <Text style={styles.content}>
          {`${to} Fee: ${fee} ${chains[cryptoassets[to].chain].fees.unit}`}
        </Text>
      </View>
      <TransactionDetails
        type="SWAP"
        id={transaction.id}
        hash={transaction.fromFundHash}
      />
      <View>
        <Pressable
          style={styles.expandable}
          onPress={() => setIsExpanded(!isExpanded)}>
          <FontAwesomeIcon
            icon={isExpanded ? faAngleDown : faAngleRight}
            size={15}
          />
          <Label text="ADVANCED" variant="strong" />
        </Pressable>
        {isExpanded && (
          <>
            <View style={styles.cell}>
              <Label text="Counter-party" variant="light" />
              <Text style={styles.transactionInfo}>
                {fromCounterPartyAddress}
              </Text>
            </View>
            <View style={styles.cell}>
              <Label text="Order Id" variant="light" />
              <Text style={styles.transactionInfo}>{orderId}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Started At" variant="light" />
              <Text style={styles.transactionInfo}>{createdAt}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Finished At" variant="light" />
              <Text style={styles.transactionInfo}>
                {formatDate(expiresAt)}
              </Text>
            </View>
            <View style={styles.cell}>
              <Label text="Rate" variant="light" />
              <Text
                style={
                  styles.transactionInfo
                }>{`1${from} = ${rate} ${to}`}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Status" variant="light" />
              <Text style={styles.transactionInfo}>{status}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Buy" variant="light" />
              <Text style={styles.transactionInfo}>{`${toAmount} ${to}`}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Sell" variant="light" />
              <Text
                style={styles.transactionInfo}>{`${fromAmount} ${from}`}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Minimum Confirmations" variant="light" />
              <Text style={styles.transactionInfo}>{minConf}</Text>
            </View>
            <View style={styles.cell}>
              <Label text={`Your ${from} address`} variant="light" />
              <Text style={[styles.transactionInfo, styles.link]}>
                {fromCounterPartyAddress}
              </Text>
            </View>
            <View style={styles.cell}>
              <Label text="Finished At" variant="light" />
              <Text style={[styles.transactionInfo, styles.link]}>
                {toCounterPartyAddress}
              </Text>
            </View>
            <View style={styles.cell}>
              <Label text="Secret" variant="light" />
              {isSecretRevealed ? (
                <Text style={styles.transactionInfo}>{secret}</Text>
              ) : (
                <Pressable
                  onPress={() => setIsSecretRevealed(!isSecretRevealed)}>
                  <Text style={[styles.transactionInfo, styles.link]}>
                    Click to reveal secret
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={styles.cell}>
              <Label text="Secret Hash" variant="light" />
              <Text style={styles.transactionInfo}>{secretHash}</Text>
            </View>
            <View style={styles.cell}>
              <Label
                text={`Your ${from} funding transaction`}
                variant="light"
              />
              <Text style={styles.transactionInfo}>{fromFundTx?.hash}</Text>
            </View>
            <View style={styles.cell}>
              <View style={[styles.action]}>
                <Text>Actions</Text>
                <LiqualityButton
                  text="Retry"
                  variant="small"
                  type="plain"
                  action={() => ({})}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
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
    marginTop: 5,
  },
  cell: {
    borderTopWidth: 1,
    borderTopColor: '#D9DFE5',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  expandable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  transactionInfo: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#9D4DFA',
  },
  textButton: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
})

export default SendConfirmationScreen
