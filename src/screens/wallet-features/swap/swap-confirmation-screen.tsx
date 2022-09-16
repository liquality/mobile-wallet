import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Pressable, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import SwapTransactionDetails from '../../../components/swap/swap-transaction-details'
import { unitToCurrency, getAsset, getChain } from '@liquality/cryptoassets'
import Label from '../../../components/ui/label'
import ProgressCircle from '../../../components/animations/progress-circle'
import {
  dpUI,
  prettyBalance,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { SwapProvider } from '@liquality/wallet-core/dist/src/swaps/SwapProvider'
import { retrySwap } from '../../../store/store'
import { Box, Text, Button } from '../../../theme'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import SwapRates from '../../../components/swap/swap-rates'
import { formatDate, labelTranslateFn } from '../../../utils'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  fiatRatesState,
  historyStateFamily,
  networkState,
  swapScreenDoubleLongEvent as SSDLE,
  SwapScreenPopUpTypes,
} from '../../../atoms'
import I18n from 'i18n-js'
import AtomicSwapPopUp from './atomic-swap-popup'
import { AppIcons, Fonts } from '../../../assets'

const {
  AngleDownIcon: AngleDown,
  AngleRightIcon: AngleRight,
  CompletedIcon: SuccessIcon,
  RefundedIcon,
} = AppIcons

type SwapConfirmationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwapConfirmationScreen'
>

const SwapConfirmationScreen: React.FC<SwapConfirmationScreenProps> = ({
  route,
  navigation,
}) => {
  const transaction = route.params.swapTransactionConfirmation
  const fiatRates = useRecoilValue(fiatRatesState)

  const historyItem = useRecoilValue(historyStateFamily(transaction!.id!))
  const activeNetwork = useRecoilValue(networkState)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [swapProvider, setSwapProvider] = useState<SwapProvider>()
  const [swapScreenPopTypes, setSwapScreenPopTypes] = useRecoilState(SSDLE)

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

  const handleSpeedUpTransaction = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: labelTranslateFn('swapConfirmationScreen.networkSpeed')!,
    })
  }

  const onDoubleTapOrLongPress = useCallback(() => {
    setSwapScreenPopTypes(SwapScreenPopUpTypes.AtomicSwap)
    setTimeout(() => {
      setSwapScreenPopTypes(SwapScreenPopUpTypes.Null)
    }, 3000)
  }, [setSwapScreenPopTypes])

  const handleRetrySwapPress = async () => {
    if (transaction) await retrySwap(transaction)
  }

  const computeRate = useCallback((swapQuote: SwapQuote) => {
    return dpUI(calculateQuoteRate(swapQuote))
  }, [])

  useEffect(() => {
    if (network && provider) {
      setSwapProvider(getSwapProvider(network, provider))
    }
  }, [network, provider])

  if (!historyItem || !swapProvider) {
    return (
      <Box style={styles.container}>
        <Text tx="common.load" />
      </Box>
    )
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
          <Text variant="secondaryInputLabel" tx="common.status" />
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
            <Text variant="link" tx="common.speedUp" />
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
          <Text variant="secondaryInputLabel" tx="common.sent" />
          <Text style={styles.content}>
            {fromAmount &&
              from &&
              `${unitToCurrency(
                getAsset(activeNetwork, from),
                new BigNumber(fromAmount),
              )} ${from}`}
          </Text>
          <Text style={styles.content}>
            {fromAmount &&
              from &&
              `$${prettyFiatBalance(
                unitToCurrency(
                  getAsset(activeNetwork, from),
                  new BigNumber(fromAmount),
                ),
                fiatRates?.[from] || 0,
              )}`}
          </Text>
        </View>
        <View>
          <Text variant="secondaryInputLabel">
            {historyItem?.status === 'SUCCESS'
              ? labelTranslateFn('swapConfirmationScreen.received')
              : labelTranslateFn('swapConfirmationScreen.pendingReceipt')}
          </Text>
          <Text style={styles.content}>
            {to &&
              toAmount &&
              `${unitToCurrency(
                getAsset(activeNetwork, to),
                new BigNumber(toAmount),
              )} ${to}`}
          </Text>
          <Text style={styles.content}>
            {to &&
              toAmount &&
              `$${prettyFiatBalance(
                unitToCurrency(
                  getAsset(activeNetwork, to),
                  new BigNumber(toAmount),
                ),
                fiatRates?.[to] || 0,
              )}`}
          </Text>
        </View>
        {swapScreenPopTypes === SwapScreenPopUpTypes.AtomicSwap ? (
          <AtomicSwapPopUp left={20} bottom={-35} />
        ) : null}
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
          doubleOrLongPress={onDoubleTapOrLongPress}
        />
      )}
      <View style={styles.border}>
        <Text variant="secondaryInputLabel" tx="common.networkSpeed" />
        <Text style={styles.content}>
          {from &&
            `${from} Fee: ${fee} ${
              getChain(activeNetwork, getAsset(activeNetwork, to).chain).fees
                .unit
            }`}
        </Text>
        <Text style={styles.content}>
          {to &&
            `${to} Fee: ${claimFee} ${
              getChain(activeNetwork, getAsset(activeNetwork, to).chain).fees
                .unit
            }`}
        </Text>
      </View>
      {historyItem && <SwapTransactionDetails historyItem={historyItem} />}
      <Box>
        <Pressable
          style={styles.expandable}
          onPress={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <AngleDown style={styles.dropdown} />
          ) : (
            <AngleRight style={styles.dropdown} />
          )}
          <Label
            text={{ tx: 'swapConfirmationScreen.advanced' }}
            variant="strong"
          />
        </Pressable>
        {isExpanded && (
          <>
            {!!fromCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={{ tx: 'swapConfirmationScreen.counterParty' }}
                  variant="light"
                />
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
              <Label
                text={{ tx: 'swapConfirmationScreen.orderId' }}
                variant="light"
              />
              <Text style={styles.transactionInfo}>{id}</Text>
            </Box>
            {!!startTime && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={{ tx: 'swapConfirmationScreen.startedAt' }}
                  variant="light"
                />
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
              <Label
                text={{ tx: 'swapConfirmationScreen.finishedAt' }}
                variant="light"
              />
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
                <Label
                  text={{ tx: 'swapConfirmationScreen.rate' }}
                  variant="light"
                />
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
              <Label text={{ tx: 'common.status' }} variant="light" />
              <Text style={styles.transactionInfo}>{historyItem?.status}</Text>
            </Box>
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label
                text={{ tx: 'swapConfirmationScreen.buy' }}
                variant="light"
              />
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
              <Label
                text={{ tx: 'swapConfirmationScreen.sell' }}
                variant="light"
              />
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
                <Label
                  text={{ tx: 'swapConfirmationScreen.minConfirm' }}
                  variant="light"
                />
                <Text style={styles.transactionInfo}>{minConf}</Text>
              </Box>
            )}
            {!!fromCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={I18n.t('swapConfirmationScreen.yourFrmAddress', {
                    from,
                  })}
                  variant="light"
                />
                <Text variant="link">{fromCounterPartyAddress}</Text>
              </Box>
            )}
            {!!toCounterPartyAddress && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={I18n.t('swapConfirmationScreen.yourToAddress', {
                    to,
                  })}
                  variant="light"
                />
                <Text variant="link">{toCounterPartyAddress}</Text>
              </Box>
            )}
            {!!secret && (
              <Box
                borderTopWidth={1}
                borderTopColor="mainBorderColor"
                paddingHorizontal={'xl'}
                paddingVertical={'m'}>
                <Label
                  text={{ tx: 'swapConfirmationScreen.secret' }}
                  variant="light"
                />
                {isSecretRevealed ? (
                  <Text style={styles.transactionInfo}>{secret}</Text>
                ) : (
                  <Pressable
                    onPress={() => setIsSecretRevealed(!isSecretRevealed)}>
                    <Text
                      variant="link"
                      tx="swapConfirmationScreen.clickToRevealSecret"
                    />
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
                <Label
                  text={{ tx: 'swapConfirmationScreen.secretHast' }}
                  variant="light"
                />
                <Text style={styles.transactionInfo}>{secretHash}</Text>
              </Box>
            )}
            <Box
              borderTopWidth={1}
              borderTopColor="mainBorderColor"
              paddingHorizontal={'xl'}
              paddingVertical={'m'}>
              <Label
                text={I18n.t('swapConfirmationScreen.yourFrFunding', { from })}
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
                  text={I18n.t('swapConfirmationScreen.yourToFunding', {
                    to,
                  })}
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
                  text={I18n.t('swapConfirmationScreen.yourToReceive', {
                    to,
                  })}
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
                  <Text tx="swapConfirmationScreen.actions" />
                  <Button
                    type="tertiary"
                    variant="s"
                    label={{ tx: 'swapConfirmationScreen.retry' }}
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
    fontFamily: Fonts.Regular,
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
    fontFamily: Fonts.Regular,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
  },
  dropdown: {
    marginRight: 5,
  },
})

export default SwapConfirmationScreen
