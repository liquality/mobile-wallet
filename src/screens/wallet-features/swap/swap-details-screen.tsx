import * as React from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { Box, faceliftPalette, Pressable, Text } from '../../../theme'
import { MainStackParamList } from '../../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { scale } from 'react-native-size-matters'
import { AppIcons } from '../../../assets'
import { useRecoilValue } from 'recoil'
import {
  fiatRatesState,
  historyStateFamily,
  networkState,
  themeMode,
} from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import { retrySwap } from '../../../store/store'
import { BigNumber } from '@liquality/types'
import { formatDate, labelTranslateFn, SCREEN_WIDTH } from '../../../utils'
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
import { unitToCurrency, getAsset } from '@liquality/cryptoassets'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'

const {
  SwapDarkRect,
  SwapLightRect,
  SwapIconGrey,
  SwapIconRed,
  CopyIcon,
  SwapRetry,
  ChevronUp,
  ChevronDown,
  SwapSuccess,
  SwapTknIcon,
} = AppIcons

const svgCardWidth = scale(SCREEN_WIDTH)
const svgCardHeight = scale(120)

type SwapDetailsScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SwapDetailsScreen'
>

const SwapDetailsScreen = ({ navigation, route }: SwapDetailsScreenProps) => {
  const transaction = route.params.swapTransactionConfirmation!
  const fromAsset = route.params.fromAssetData
  const toAsset = route.params.toAssetData
  const fiatRates = useRecoilValue(fiatRatesState)

  const historyItem = useRecoilValue(historyStateFamily(transaction!.id!))
  const activeNetwork = useRecoilValue(networkState)
  const historyStatus = historyItem ? historyItem.status : ''
  const endTime = historyItem ? historyItem.endTime : 0

  const [isExpanded, setIsExpanded] = React.useState(false)
  // const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [swapProvider, setSwapProvider] = React.useState<SwapProvider>()

  const { from, to, fromAmount, toAmount, startTime, network, provider } =
    transaction

  const scrollRef = React.useRef<ScrollView>(null)

  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const onTogglePress = () => {
    setIsExpanded((prev) => {
      return !prev
    })
    setTimeout(() => {
      scrollRef.current?.scrollToEnd()
    }, 0)
  }

  const handleSpeedUpTransaction = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.fromAssetData,
      screenTitle: labelTranslateFn('swapConfirmationScreen.networkSpeed')!,
    })
  }

  const handleRetrySwapPress = async () => {
    if (transaction) await retrySwap(transaction)
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

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal="screenPadding">
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
              justifyContent="space-between">
              {historyStatus === 'SUCCESS' ? (
                <Text
                  variant={'h6'}
                  color="link"
                  onPress={() => {}}
                  tx="swapConfirmationScreen.link"
                />
              ) : (
                <Text
                  variant={'h6'}
                  color="link"
                  onPress={handleRetrySwapPress}
                  tx="swapConfirmationScreen.retry"
                />
              )}
              <Box
                width={1}
                height={scale(15)}
                backgroundColor="inactiveText"
              />
              <Box style={{ marginTop: -scale(5) }}>
                {historyStatus === 'SUCCESS' ? (
                  <SwapSuccess width={20} />
                ) : historyStatus === 'REFUNDED' ? (
                  <SwapRetry width={20} />
                ) : (
                  <ProgressCircle
                    radius={17}
                    current={swapProvider?.statuses[historyStatus!].step + 1}
                    total={swapProvider?.totalSteps}
                  />
                )}
              </Box>
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
            then="$112.12 then" // temp hardcoded
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
            then="$112.12 then" // temp hardcoded
          />
        </Box>
        <Box marginTop={'xl'}>
          <SwapPartitionRow
            title={labelTranslateFn('swapConfirmationScreen.rate')!}
            subTitle="1 inch" // temp hardcoded
            leftSubTitle={`1${from} = ${computeRate(transaction)} ${to}`}
            customView={
              <Box marginRight="s" style={{ marginTop: -scale(2) }}>
                <SwapTknIcon width={20} />
              </Box>
            }
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
                Avg 0.014446 BTC
              </Text>
              <Box
                alignSelf={'flex-start'}
                width={1}
                marginHorizontal="m"
                height={scale(15)}
                backgroundColor="inactiveText"
              />
              <Text
                marginLeft={'s'}
                variant={'swapSubTitle'}
                color={'darkGrey'}>
                $ 0.02
              </Text>
            </Box>
            <Text
              onPress={handleSpeedUpTransaction}
              variant={'speedUp'}
              color={'link'}
              tx="common.speedUp"
            />
          </Box>
        </Box>
        {historyItem ? (
          <Box marginTop={'xl'}>
            <TransactionTimeline
              startDate={formatDate(startTime)}
              completed={endTime ? formatDate(endTime) : ''}
              transBtnLabel={labelTranslateFn('swapConfirmationScreen.retry')!}
              tranBtnPress={() => {}}
              customComponent={[
                {
                  customView: (
                    <Box marginLeft={'xl'}>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Box flexDirection={'row'}>
                          <Text
                            marginRight={'m'}
                            variant={'transLink'}
                            color="link">
                            BTC Approved
                          </Text>
                          <CopyIcon stroke={faceliftPalette.linkTextColor} />
                        </Box>
                      </TouchableOpacity>
                      <Text variant={'subListText'} color="darkGrey">
                        Fee: 0.007446 MATIC / ~ $0.01
                      </Text>
                      <Text variant={'subListText'} color="darkGrey">
                        {'Confirmation {00}'}
                      </Text>
                    </Box>
                  ),
                },
                {
                  customView: (
                    <Box marginLeft={'xl'}>
                      <TouchableOpacity activeOpacity={0.7}>
                        <Box flexDirection={'row'}>
                          <Text
                            marginRight={'m'}
                            variant={'transLink'}
                            color="link">
                            Swap BTC for ETH
                          </Text>
                          <CopyIcon stroke={faceliftPalette.linkTextColor} />
                        </Box>
                      </TouchableOpacity>
                      <Text variant={'subListText'} color="darkGrey">
                        Fee: 0.007446 MATIC / ~ $0.01
                      </Text>
                      <Text variant={'subListText'} color="darkGrey">
                        {'Confirmation {00}'}
                      </Text>
                    </Box>
                  ),
                },
              ]}
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
          <TouchableOpacity activeOpacity={0.7} onPress={onTogglePress}>
            <DynamicIcon width={scale(15)} height={scale(15)} />
          </TouchableOpacity>
        </Box>
        {isExpanded ? (
          <>
            <Box marginTop={'xl'}>
              <SwapPartitionRow
                title={labelTranslateFn('swapConfirmationScreen.startedAt')!}
                leftSubTitle={formatDate(startTime)}
                subTitle="06:51:33 GMT-0400 (EST)"
              />
            </Box>
            {endTime ? (
              <Box marginTop={'xl'}>
                <SwapPartitionRow
                  title={labelTranslateFn('swapConfirmationScreen.finishedAt')!}
                  leftSubTitle={formatDate(endTime)}
                  subTitle="06:51:33 GMT-0400 (EST)"
                />
              </Box>
            ) : null}
            <Box marginTop={'xl'}>
              <SwapPartitionRow
                title={labelTranslateFn('swapConfirmationScreen.rate')!}
                subTitle="1 inch" //hardcoded temp
                leftSubTitle={`1${from} = ${computeRate(transaction)} ${to}`}
                customView={
                  <Box marginRight="s" style={{ marginTop: -scale(2) }}>
                    <SwapTknIcon width={20} />
                  </Box>
                }
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
    </Box>
  )
}

export default SwapDetailsScreen
