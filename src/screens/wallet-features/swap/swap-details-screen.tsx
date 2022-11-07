import * as React from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
} from 'react-native'
import { Box, faceliftPalette, Pressable, Text } from '../../../theme'
import {
  AccountType,
  ActionEnum,
  ExtendedFeeLabel,
  MainStackParamList,
} from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  balanceStateFamily,
  fiatRatesState,
  historyStateFamily,
  networkState,
  swapPairState,
  themeMode,
} from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { BigNumber } from '@liquality/types'
import { formatDate, labelTranslateFn, Log, SCREEN_WIDTH } from '../../../utils'
import SwapPartitionRow from './swap-partition-row'
import SwapThreeRow from './swap-three-row'
import TransactionTimeline from './transaction-timeline'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SwapProvider } from '@liquality/wallet-core/dist/src/swaps/SwapProvider'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'
import {
  dpUI,
  prettyBalance,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import ProgressCircle from '../../../components/animations/progress-circle'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { unitToCurrency, getAsset, getChain } from '@liquality/cryptoassets'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import { TimelineStep } from '@liquality/wallet-core/dist/src/utils/timeline'
import { getTimeline, speedUpTransaction } from '../../../store/store'
import {
  FeeLabel,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import { CustomComponentProps } from './transaction-timeline'
import { TxStatus } from '@chainify/types'
import SwapConfirmedBlock from './swap-confirmed-block'
import { getTransactionExplorerLink } from '@liquality/wallet-core/dist/src/utils/asset'
import FeeEditorScreen from '../custom-fee/fee-editor-screen'
import SpeedUpModal from '../custom-fee/speed-up-modal'

const {
  SwapDarkRect,
  SwapLightRect,
  SwapIconGrey,
  SwapIconRed,
  SwapRetry,
  ChevronUp,
  ChevronDown,
  SwapSuccess,
} = AppIcons

const svgCardWidth = scale(SCREEN_WIDTH)
const svgCardHeight = scale(120)

type SwapDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SwapDetailsScreen'
>

const SwapDetailsScreen = ({ navigation, route }: SwapDetailsScreenProps) => {
  const transaction = route.params.swapTransactionConfirmation!
  const fiatRates = useRecoilValue(fiatRatesState)
  const historyItem = useRecoilValue(
    historyStateFamily(transaction!.id!),
  ) as SwapHistoryItem
  const activeNetwork = useRecoilValue(networkState)
  const fromAsset = getAsset(activeNetwork, transaction.from)
  const toAsset = getAsset(activeNetwork, transaction.to)
  const historyStatus = historyItem ? historyItem.status : ''
  const endTime = historyItem ? historyItem.endTime : 0
  const [timeline, setTimeline] = React.useState<TimelineStep[]>()
  const setSwapPair = useSetRecoilState(swapPairState)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [swapProvider, setSwapProvider] = React.useState<SwapProvider>()
  const [showFeeEditorModal, setShowFeeEditorModal] = React.useState(false)
  const [showSpeedUpModal, setShowSpeedUpModal] = React.useState(false)
  const [networkSpeed, setNetworkSpeed] = React.useState<ExtendedFeeLabel>(
    historyItem.feeLabel || FeeLabel.Average,
  )
  const [isLoading, setIsLoading] = React.useState(false)
  const fromBalance = useRecoilValue(
    balanceStateFamily({
      asset: historyItem.from || '',
      assetId: historyItem.fromAccountId,
    }),
  )
  const {
    from,
    to,
    fromAmount,
    toAmount,
    startTime,
    network,
    provider,
    claimFee,
  } = transaction

  const scrollRef = React.useRef<ScrollView>(null)

  const theme = useRecoilValue(themeMode)

  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  React.useEffect(() => {
    if (!historyItem) {
      return
    }
    getTimeline(historyItem).then(setTimeline)
  }, [historyItem])

  const onTogglePress = () => {
    setIsExpanded((prev) => {
      return !prev
    })
    setTimeout(() => {
      scrollRef.current?.scrollToEnd()
    }, 0)
  }

  const handleSpeedUpTransaction = () => {
    setShowFeeEditorModal(true)
  }

  const handleRetrySwapPress = async () => {
    const tempFromAsset = getAsset(activeNetwork, transaction.from)
    const tempToAsset = getAsset(activeNetwork, transaction.to)
    const fA: AccountType = {
      id: transaction.fromAccountId || '',
      ...tempFromAsset,
      assets: {},
      balance: 0,
    }
    const tA: AccountType = {
      id: transaction.toAccountId || '',
      ...tempToAsset,
      balance: 0,
      assets: {},
    }
    setSwapPair({ fromAsset: fA, toAsset: tA })
    navigation.navigate('SwapScreen', {
      swapAssetPair: { fromAsset: fA, toAsset: tA },
    })
  }

  const handleIntiatSpeedUpSwap = async (fee: number) => {
    try {
      const amount = unitToCurrency(
        getAsset(activeNetwork, historyItem.from),
        fromBalance || 0,
      )
      if (amount.minus(fee).gte(0)) {
        setIsLoading(true)
        await speedUpTransaction(
          historyItem.id,
          historyItem.swapTx.hash, // swapTx key is missing for SwapHistoryItem interface
          historyItem.from,
          activeNetwork,
          fee,
        )
      } else {
        Alert.alert('Unable to Speed up the transaction because of low balance')
      }
      setIsLoading(false)
      setNetworkSpeed(networkSpeed)
    } catch (error) {
      setIsLoading(false)
      setNetworkSpeed(historyItem.feeLabel)
      Log(`Failed to perform swap: ${error}`, 'error')
      Alert.alert(labelTranslateFn('swapReviewScreen.failedToPerfSwap')!)
    }
  }

  const computeRate = React.useCallback((swapQuote: SwapQuote) => {
    return dpUI(calculateQuoteRate(swapQuote))
  }, [])

  React.useEffect(() => {
    if (network && provider) {
      setSwapProvider(getSwapProvider(network, provider))
    }
  }, [network, provider])

  if (!historyItem || !swapProvider) {
    return (
      <Box backgroundColor={'mainBackground'} paddingVertical="l">
        <Text tx="common.load" />
      </Box>
    )
  }

  const LowerBgSvg = currentTheme === 'light' ? SwapDarkRect : SwapLightRect

  const UppperBgSvg = currentTheme === 'dark' ? SwapDarkRect : SwapLightRect
  const success = true
  const SwapIcon = success ? SwapIconGrey : SwapIconRed

  const DynamicIcon = isExpanded ? ChevronUp : ChevronDown

  const customComponent: Array<CustomComponentProps> = []

  let confirmationNum: any

  if (timeline?.length) {
    confirmationNum = timeline[0].tx?.confirmations
    let isFromIdAdded = false
    for (let item of timeline) {
      if (item.tx?.status === TxStatus.Failed) {
        customComponent.push({
          dotColor: 'danger',
          customView: (
            <Box marginLeft={'xl'}>
              <Text marginRight={'m'} variant={'transLink'} color="danger">
                {item.title}
              </Text>
              <Text variant={'subListText'} color="danger">
                {`${item.tx.from} for ${item.tx.to}`}
              </Text>
            </Box>
          ),
        })
      } else {
        const constructUrl = item.tx
          ? getTransactionExplorerLink(
              item.tx.hash,
              isFromIdAdded ? historyItem.from : historyItem.to,
              historyItem.network,
            )
          : ''
        customComponent.push({
          customView: (
            <SwapConfirmedBlock
              address={
                isFromIdAdded
                  ? historyItem.toAccountId
                  : historyItem.fromAccountId
              }
              status={item.title}
              confirmations={item.tx?.confirmations || 0}
              fee={item.tx?.fee}
              asset={historyItem.from}
              fiatRates={fiatRates}
              txHash={historyItem.id}
              fiatRate={
                isFromIdAdded ? fiatRates?.[to] || 0 : fiatRates?.[from] || 0
              }
              url={constructUrl}
            />
          ),
        })
        isFromIdAdded = true
      }
    }
  }

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="l">
      <ScrollView
        contentContainerStyle={{ paddingBottom: scale(30) }}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}>
        <Box alignItems={'center'} marginTop="m">
          <Box
            width={svgCardWidth}
            height={svgCardHeight}
            alignItems="center"
            justifyContent={'center'}>
            <Box
              flexDirection={'row'}
              width={scale(240)}
              justifyContent="space-evenly">
              {fromAsset ? (
                <Box alignItems={'center'}>
                  <AssetIcon chain={fromAsset.chain} size={scale(41)} />
                  <Text marginTop={'m'} color="textColor" variant={'iconLabel'}>
                    {fromAsset.code}
                  </Text>
                </Box>
              ) : null}
              <Box
                height={scale(65)}
                alignItems="center"
                justifyContent={'center'}>
                <SwapIcon />
              </Box>
              {toAsset ? (
                <Box alignItems={'center'}>
                  <AssetIcon chain={toAsset.chain} size={scale(41)} />
                  <Text marginTop={'m'} color="textColor" variant={'iconLabel'}>
                    {toAsset.code}
                  </Text>
                </Box>
              ) : null}
            </Box>
            <Box position={'absolute'} zIndex={-1}>
              <UppperBgSvg width={svgCardWidth} height={svgCardHeight} />
            </Box>
            <Box
              position={'absolute'}
              zIndex={-2}
              top={scale(5)}
              left={scale(5)}>
              <LowerBgSvg width={svgCardWidth} height={svgCardHeight} />
            </Box>
          </Box>
        </Box>
        <Box marginTop={'xxl'}>
          <Text variant={'listText'} color="greyMeta" tx="status" />
          <Box flexDirection={'row'} justifyContent="space-between">
            <Box flex={0.65}>
              <Text
                variant={'swapSubTitle'}
                color={success ? 'greyBlack' : 'danger'}>
                {from &&
                  to &&
                  swapProvider?.statuses[historyStatus!].label
                    .replace('{from}', from)
                    .replace('{to}', to)}
              </Text>
            </Box>
            <Box
              flex={0.35}
              flexDirection={'row'}
              justifyContent={
                historyStatus === 'SUCCESS' ? 'flex-end' : 'space-between'
              }>
              {historyStatus !== 'SUCCESS' ? (
                <Text
                  variant={'h6'}
                  color="link"
                  onPress={handleRetrySwapPress}
                  tx="swapConfirmationScreen.retry"
                />
              ) : null}
              {historyStatus !== 'SUCCESS' ? (
                <Box
                  width={1}
                  height={scale(15)}
                  backgroundColor="inactiveText"
                />
              ) : null}
              {historyStatus === 'SUCCESS' ? (
                <Box style={{ marginTop: -scale(5) }}>
                  <SwapSuccess width={20} />
                </Box>
              ) : historyStatus === 'REFUNDED' ? (
                <Box style={{ marginTop: -scale(5) }}>
                  <SwapRetry width={20} />
                </Box>
              ) : (
                <Box style={{ marginTop: -scale(8) }}>
                  <ProgressCircle
                    radius={17}
                    current={swapProvider?.statuses[historyStatus!].step + 1}
                    total={swapProvider?.totalSteps}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {startTime ? (
          <Box marginTop={'xl'}>
            <SwapPartitionRow
              title={labelTranslateFn('initiated')!}
              showParitionLine={false}
              subTitle={formatDate(startTime)}
            />
          </Box>
        ) : null}
        {endTime ? (
          <Box marginTop={'xl'}>
            <SwapPartitionRow
              title={labelTranslateFn('common.completed')!}
              subTitle={formatDate(endTime)}
              showParitionLine={false}
            />
          </Box>
        ) : null}
        <Box marginTop={'xl'}>
          <SwapThreeRow
            title={labelTranslateFn('sendTranDetailComp.sent')!}
            subTitle={
              fromAmount &&
              from &&
              `${unitToCurrency(
                getAsset(activeNetwork, from),
                new BigNumber(fromAmount),
              )} ${from}`
            }
            today={
              fromAmount &&
              from &&
              `$${prettyFiatBalance(
                unitToCurrency(
                  getAsset(activeNetwork, from),
                  new BigNumber(fromAmount),
                ),
                fiatRates?.[from] || 0,
              )}`
            }
          />
        </Box>
        <Box marginTop={'xl'}>
          <SwapThreeRow
            title={labelTranslateFn('swapConfirmationScreen.received')!}
            subTitle={
              to &&
              toAmount &&
              `${unitToCurrency(
                getAsset(activeNetwork, to),
                new BigNumber(toAmount),
              )} ${to}`
            }
            today={
              to &&
              toAmount &&
              `$${prettyFiatBalance(
                unitToCurrency(
                  getAsset(activeNetwork, to),
                  new BigNumber(toAmount),
                ),
                fiatRates?.[to] || 0,
              )}`
            }
          />
        </Box>
        <Box marginTop={'xl'}>
          <SwapPartitionRow
            title={labelTranslateFn('swapConfirmationScreen.rate')!}
            subTitle={`1 ${from} = ${computeRate(transaction)} ${to}`}
            showParitionLine={false}
          />
        </Box>
        <Box marginTop={'xl'}>
          <Text
            variant={'listText'}
            color="greyMeta"
            tx="common.networkSpeed"
          />
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}>
            <Box flexDirection={'row'} alignItems={'center'}>
              <Text variant={'swapSubTitle'} color={'darkGrey'}>
                {to &&
                  `${to} Fee: ${claimFee} ${
                    getChain(activeNetwork, getAsset(activeNetwork, to).chain)
                      .fees.unit
                  }`}
              </Text>
            </Box>
            {confirmationNum && confirmationNum === 0 ? (
              isLoading ? (
                <ActivityIndicator color={faceliftPalette.buttonActive} />
              ) : (
                <Text
                  onPress={handleSpeedUpTransaction}
                  variant={'speedUp'}
                  color={'link'}
                  tx="common.speedUp"
                />
              )
            ) : null}
          </Box>
        </Box>
        {historyItem && timeline?.length ? (
          <Box marginTop={'xl'}>
            <TransactionTimeline
              startDate={formatDate(startTime)}
              completed={endTime ? formatDate(endTime) : ''}
              transBtnLabel={labelTranslateFn('swapConfirmationScreen.retry')!}
              tranBtnPress={handleRetrySwapPress}
              customComponent={customComponent}
            />
          </Box>
        ) : null}
        <Box
          flexDirection={'row'}
          marginTop="xl"
          justifyContent="space-between"
          alignItems={'center'}>
          <Text
            variant={'listText'}
            color="greyBlack"
            tx="swapConfirmationScreen.actions"
          />
          <Pressable
            label={{ tx: 'optionTbd' }}
            style={{
              width: scale(100),
              height: scale(30),
            }}
            buttonSize="half"
            variant={'defaultOutline'}
            onPress={() => {}}
          />
        </Box>
        <TouchableOpacity activeOpacity={0.7} onPress={onTogglePress}>
          <Box
            flexDirection={'row'}
            marginTop="xl"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderBottomColor={'greyBlack'}
            paddingBottom="m"
            alignItems={'center'}>
            <Text
              variant={'listText'}
              color="greyBlack"
              tx="swapConfirmationScreen.advanced"
            />
            <DynamicIcon width={scale(15)} height={scale(15)} />
          </Box>
        </TouchableOpacity>
        {isExpanded ? (
          <>
            <Box marginTop={'xl'}>
              <SwapPartitionRow
                title={labelTranslateFn('swapConfirmationScreen.startedAt')!}
                subTitle={formatDate(startTime)}
                showParitionLine={false}
              />
            </Box>
            {endTime ? (
              <Box marginTop={'xl'}>
                <SwapPartitionRow
                  title={labelTranslateFn('swapConfirmationScreen.finishedAt')!}
                  subTitle={formatDate(endTime)}
                  showParitionLine={false}
                />
              </Box>
            ) : null}
            <Box marginTop={'xl'}>
              <SwapPartitionRow
                title={labelTranslateFn('swapConfirmationScreen.rate')!}
                subTitle={`1 ${from} = ${computeRate(transaction)} ${to}`}
                showParitionLine={false}
              />
            </Box>
            {historyItem ? (
              <Box marginTop={'xl'}>
                <SwapPartitionRow
                  title={labelTranslateFn('status')!}
                  showParitionLine={false}
                  subTitle={historyItem.status || ''}
                />
              </Box>
            ) : null}
            {!!toAmount && !!to ? (
              <Box marginTop={'xl'}>
                <SwapPartitionRow
                  title={labelTranslateFn('swapConfirmationScreen.buy')!}
                  showParitionLine={false}
                  subTitle={`${prettyBalance(
                    new BigNumber(toAmount),
                    to,
                  )} ${to}`}
                />
              </Box>
            ) : null}
            {!!fromAmount && !!from ? (
              <Box marginTop={'xl'}>
                <SwapPartitionRow
                  title={labelTranslateFn('swapConfirmationScreen.sell')!}
                  showParitionLine={false}
                  subTitle={`${prettyBalance(
                    new BigNumber(fromAmount),
                    from,
                  )} ${from}`}
                />
              </Box>
            ) : null}
            {transaction ? (
              <Box
                paddingVertical={'xl'}
                borderBottomWidth={scale(1)}
                borderBottomColor="mediumGrey">
                <SwapPartitionRow
                  title={labelTranslateFn('swapConfirmationScreen.yourTrans')!}
                  showParitionLine={false}
                  subTitle={transaction.id}
                />
              </Box>
            ) : null}
          </>
        ) : null}
      </ScrollView>
      {showFeeEditorModal && historyItem && (
        <FeeEditorScreen
          onClose={setShowFeeEditorModal}
          selectedAsset={historyItem.from}
          amount={new BigNumber(historyItem.fromAmount)}
          applyFee={(fee) => {
            setShowFeeEditorModal(false)
            if (confirmationNum) {
              if (confirmationNum === 0) {
                handleIntiatSpeedUpSwap(fee.toNumber())
              } else {
                setShowSpeedUpModal(true)
              }
            }
          }}
          transactionType={ActionEnum.SWAP}
          applyNetworkSpeed={setNetworkSpeed}
          networkSpeed={networkSpeed}
          isSpeedUp={true}
        />
      )}
      <SpeedUpModal
        visible={showSpeedUpModal}
        onClose={() => setShowSpeedUpModal(false)}
      />
    </Box>
  )
}

export default SwapDetailsScreen
