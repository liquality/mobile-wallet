import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import SwapTransactionDetails from '../../../components/swap/swap-transaction-details'
import {
  unitToCurrency,
  assets as cryptoassets,
  chains,
} from '@liquality/cryptoassets'
import { useAppSelector } from '../../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faAngleRight } from '@fortawesome/pro-light-svg-icons'
import Label from '../../../components/ui/label'
import ProgressCircle from '../../../components/animations/progress-circle'
import SuccessIcon from '../../../assets/icons/activity-status/completed.svg'
import Button from '../../../theme/button'
import {
  HistoryItem,
  SwapHistoryItem,
  TransactionType,
} from '@liquality/wallet-core/dist/store/types'
import {
  cryptoToFiat,
  dpUI,
  prettyBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { getSwapProvider } from '@liquality/wallet-core/dist/factory/swapProvider'
import { SwapProvider } from '@liquality/wallet-core/dist/swaps/SwapProvider'
import { retrySwap } from '../../../store/store'
import RefundedIcon from '../../../assets/icons/activity-status/refunded.svg'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/utils/quotes'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import SwapRates from '../../../components/swap/swap-rates'

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
  const [historyItem, setHistoryItem] = useState<SwapHistoryItem>()
  const [swapProvider, setSwapProvider] = useState<SwapProvider>()

  const {
    id,
    fromAmount,
    from,
    to,
    toAmount,
    startTime,
    fee,
    toFundHash,
    fromFundHash,
    fromCounterPartyAddress,
    toCounterPartyAddress,
    receiveTxHash,
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

  const handleSpeedUpTransaction = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  const handleRetrySwapPress = async () => {
    if (transaction) await retrySwap(transaction)
  }

  const computeRate = (swapQuote: SwapQuote) => {
    return dpUI(calculateQuoteRate(swapQuote))
  }
  useEffect(() => {
    const historyItems = history.filter(
      (item) =>
        item.type === TransactionType.Swap && item.id === transaction?.id,
    )
    if (historyItems.length > 0) {
      setHistoryItem(historyItems[0] as SwapHistoryItem)
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
      {from && to && (
        <SwapRates
          fromAsset={from}
          toAsset={to}
          quotes={[]}
          selectedQuote={historyItem}
          selectQuote={() => ({})}
          clickable={false}
          style={{ paddingHorizontal: 20 }}
        />
      )}
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
      {historyItem && <SwapTransactionDetails historyItem={historyItem} />}
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
            {!!fromCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Counter-party" variant="light" />
                <Text style={styles.transactionInfo}>
                  {fromCounterPartyAddress}
                </Text>
              </Box>
            )}
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label text="Order Id" variant="light" />
              <Text style={styles.transactionInfo}>{id}</Text>
            </Box>
            {!!startTime && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Started At" variant="light" />
                <Text style={styles.transactionInfo}>
                  {formatDate(startTime)}
                </Text>
              </Box>
            )}
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label text="Finished At" variant="light" />
              <Text style={styles.transactionInfo}>
                {historyItem?.endTime && formatDate(historyItem?.endTime)}
              </Text>
            </Box>
            {transaction && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Rate" variant="light" />
                <Text style={styles.transactionInfo}>{`1${from} = ${computeRate(
                  transaction,
                )} ${to}`}</Text>
              </Box>
            )}
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label text="Status" variant="light" />
              <Text style={styles.transactionInfo}>{historyItem?.status}</Text>
            </Box>
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label text="Buy" variant="light" />
              {!!toAmount && !!to && (
                <Text style={styles.transactionInfo}>{`${prettyBalance(
                  new BigNumber(toAmount),
                  to,
                )} ${to}`}</Text>
              )}
            </Box>
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label text="Sell" variant="light" />
              {!!fromAmount && !!from && (
                <Text style={styles.transactionInfo}>{`${prettyBalance(
                  new BigNumber(fromAmount),
                  from,
                )} ${from}`}</Text>
              )}
            </Box>
            {!!minConf && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Minimum Confirmations" variant="light" />
                <Text style={styles.transactionInfo}>{minConf}</Text>
              </Box>
            )}
            {!!fromCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text={`Your ${from} address`} variant="light" />
                <Text variant="link">{fromCounterPartyAddress}</Text>
              </Box>
            )}
            {!!toCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text={`Your ${to} address`} variant="light" />
                <Text variant="link">{toCounterPartyAddress}</Text>
              </Box>
            )}
            {!!secret && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Secret" variant="light" />
                {isSecretRevealed ? (
                  <Text style={styles.transactionInfo}>{secret}</Text>
                ) : (
                  <Pressable
                    onPress={() => setIsSecretRevealed(!isSecretRevealed)}>
                    <Text variant="link">Click to reveal secret</Text>
                  </Pressable>
                )}
              </Box>
            )}
            {!!secretHash && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label text="Secret Hash" variant="light" />
                <Text style={styles.transactionInfo}>{secretHash}</Text>
              </Box>
            )}
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label
                text={`Your ${from} funding transaction`}
                variant="light"
              />
              <Text style={styles.transactionInfo}>{fromFundHash}</Text>
            </Box>
            {!!toFundHash && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={`Your ${to} funding transaction`}
                  variant="light"
                />
                <Text style={styles.transactionInfo}>{toFundHash}</Text>
              </Box>
            )}
            {!!receiveTxHash && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={`Your ${to} receive transaction`}
                  variant="light"
                />
                <Text style={styles.transactionInfo}>{receiveTxHash}</Text>
              </Box>
            )}
            {!['SUCCESS', 'REFUNDED'].includes(historyItem?.status) && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Text>Actions</Text>
                  <Button
                    type="tertiary"
                    variant="s"
                    label="Retry"
                    onPress={handleRetrySwapPress}
                    isBorderless={false}
                    isActive={true}
                  />
                </Box>
              </Box>
            )}
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
