import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import TransactionDetails from '../../../components/transaction-details'
import {
  unitToCurrency,
  assets as cryptoassets,
  chains,
} from '@liquality/cryptoassets'
import { useAppSelector } from '../../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faAngleDown,
  faAngleRight,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import Label from '../../../components/ui/label'
import ProgressCircle from '../../../components/animations/progress-circle'
import ProgressBar from '../../../components/animations/progress-bar'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import Button from '../../../theme/button'
import {
  HistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'
import { cryptoToFiat } from '@liquality/wallet-core/dist/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory/swapProvider'
import { SwapProvider } from '@liquality/wallet-core/dist/swaps/SwapProvider'
import { retrySwap } from '../../../store/store'
import RefundedIcon from '../../../assets/icons/activity-status/refunded.svg'
import Text from '../../../theme/text'
import Box from '../../../theme/box'

type SwapConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwapConfirmationScreen'
>

const SwapConfirmationScreen: React.FC<SwapConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const { fiatRates, history = [] } = useAppSelector((state) => {
    const { history: historyObject, activeNetwork, activeWalletId } = state
    let historyItems: HistoryItem[] = []
    if (historyObject?.[activeNetwork]?.[activeWalletId]) {
      historyItems = historyObject?.[activeNetwork]?.[activeWalletId] || []
    }
    return {
      fiatRates: state.fiatRates,
      history: historyItems,
      activeNetwork,
      activeWalletId,
    }
  })
  const transaction = route.params.swapTransactionConfirmation
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [historyItem, setHistoryItem] = useState<HistoryItem>()
  const [swapProvider, setSwapProvider] = useState<SwapProvider>()

  const {
    fromAmount,
    from,
    to,
    toAmount,
    createdAt,
    expiresAt,
    fee,
    fromFundTx,
    fromFundHash,
    fromCounterPartyAddress,
    toCounterPartyAddress,
    orderId,
    rate,
    minConf,
    secret,
    secretHash,
    claimFee,
    provider,
    network,
  } = transaction || {}

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
    // if (from && activeNetwork && fromFundHash) {
    //   speedUpTransaction(from, activeNetwork, fromFundHash, newFee)
    // } else {
    //   Alert.alert('Failed to speed up transaction')
    // }
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  const handleRetrySwapPress = async () => {
    if (transaction) await retrySwap(transaction)
  }

  useEffect(() => {
    const historyItems = history.filter(
      (item) =>
        item.type === TransactionType.Swap && item.id === transaction?.id,
    )
    if (historyItems.length > 0) {
      setHistoryItem(historyItems[0])
    }

    if (network && provider) {
      setSwapProvider(getSwapProvider(network, provider))
    }
  }, [network, fromFundHash, history, provider, transaction?.id])

  if (!historyItem) {
    return <Box style={styles.container} />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Box
        paddingHorizontal="xl"
        marginBottom={'xl'}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end">
        <Box>
          <Text variant="secondaryInputLabel">STATUS</Text>
          <Text style={styles.content}>
            {from &&
              to &&
              swapProvider?.statuses[historyItem?.status].label
                .replace('{from}', from)
                .replace('{to}', to)}
          </Text>
        </Box>
        {!['SUCCESS', 'REFUNDED'].includes(historyItem?.status) && (
          <Pressable onPress={handleSpeedUpTransaction}>
            <Text variant="link">Speed Up</Text>
          </Pressable>
        )}

        {historyItem?.status === 'SUCCESS' ? (
          <SuccessIcon />
        ) : historyItem?.status === 'REFUNDED' ? (
          <RefundedIcon />
        ) : (
          <ProgressCircle
            radius={17}
            current={swapProvider?.statuses[historyItem.status].step + 1}
            total={swapProvider?.totalSteps}
          />
        )}
      </Box>
      <Box
        justifyContent="space-between"
        paddingHorizontal="xl"
        marginBottom="xl">
        <Text variant="secondaryInputLabel">Trade Time</Text>
        {!['SUCCESS', 'REFUNDED'].includes(historyItem?.status) && (
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end">
            <FontAwesomeIcon icon={faClock} size={15} color="#9C55F6" />
            <Text style={styles.content}>
              {createdAt && elapsedTime(createdAt)}
            </Text>
            <ProgressBar
              width={Dimensions.get('screen').width - 150}
              total={100}
              current={10}
            />
            <Text style={styles.content}>
              {expiresAt && remainingTime(expiresAt)}
            </Text>
          </Box>
        )}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end">
          <Text style={styles.content}>
            {createdAt && `Initiated ${formatDate(Date.parse(createdAt))}`}
          </Text>
          {['SUCCESS', 'REFUNDED'].includes(historyItem?.status) &&
          historyItem?.endTime ? (
            <Text style={styles.content}>{`${'Completed'} ${formatDate(
              historyItem?.endTime,
            )}`}</Text>
          ) : (
            <Text style={styles.content}>
              {expiresAt && `${'Expires'} ${formatDate(expiresAt)}`}
            </Text>
          )}
        </Box>
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingHorizontal="xl"
        marginBottom="xl">
        <View>
          <Text variant="secondaryInputLabel">SENT</Text>
          <Text style={styles.content}>
            {fromAmount &&
              from &&
              `${unitToCurrency(
                cryptoassets[from],
                new BigNumber(fromAmount),
              )} ${from}`}
          </Text>
          <Text style={styles.content}>
            {fromAmount &&
              from &&
              `$${cryptoToFiat(
                unitToCurrency(cryptoassets[from], new BigNumber(fromAmount)),
                fiatRates?.[from] || 0,
              )}`}
          </Text>
        </View>
        <View>
          <Text variant="secondaryInputLabel">
            {historyItem?.status === 'SUCCESS' ? 'RECEIVED' : 'PENDING RECEIPT'}
          </Text>
          <Text style={styles.content}>
            {to &&
              toAmount &&
              `${unitToCurrency(
                cryptoassets[to],
                new BigNumber(toAmount),
              )} ${to}`}
          </Text>
          <Text style={styles.content}>
            {to &&
              toAmount &&
              `$${cryptoToFiat(
                unitToCurrency(cryptoassets[to], new BigNumber(toAmount)),
                fiatRates?.[to] || 0,
              )}`}
          </Text>
        </View>
      </Box>
      {/* {from && to && (
        <SwapRates
          fromAsset={from}
          toAsset={to}
          selectQuote={() => ({})}
          style={{ paddingHorizontal: 20 }}
        />
      )} */}
      <View style={styles.border}>
        <Text variant="secondaryInputLabel">NETWORK SPEED/FEE</Text>
        <Text style={styles.content}>
          {from &&
            `${from} Fee: ${fee} ${chains[cryptoassets[from].chain].fees.unit}`}
        </Text>
        <Text style={styles.content}>
          {to &&
            `${to} Fee: ${claimFee} ${
              chains[cryptoassets[to].chain].fees.unit
            }`}
        </Text>
      </View>
      {historyItem && (
        <TransactionDetails type="SWAP" historyItem={historyItem} />
      )}
      <Box>
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
                {expiresAt && formatDate(expiresAt)}
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
              <Text style={styles.transactionInfo}>{historyItem?.status}</Text>
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
              <Text variant="link">{fromCounterPartyAddress}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Finished At" variant="light" />
              <Text variant="link">{toCounterPartyAddress}</Text>
            </View>
            <View style={styles.cell}>
              <Label text="Secret" variant="light" />
              {isSecretRevealed ? (
                <Text style={styles.transactionInfo}>{secret}</Text>
              ) : (
                <Pressable
                  onPress={() => setIsSecretRevealed(!isSecretRevealed)}>
                  <Text variant="link">Click to reveal secret</Text>
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
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Text>Actions</Text>
                {historyItem?.status !== 'SUCCESS' && (
                  <Button
                    type="tertiary"
                    variant="s"
                    label="Retry"
                    onPress={handleRetrySwapPress}
                    isBorderless={false}
                    isActive={true}
                  />
                )}
              </Box>
            </View>
          </>
        )}
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
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
})

export default SwapConfirmationScreen
