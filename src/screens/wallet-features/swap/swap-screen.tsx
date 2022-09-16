import React, {
  FC,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import MessageBanner from '../../../components/ui/message-banner'
import AmountTextInputBlock from '../../../components/ui/amount-text-input-block'
import Label from '../../../components/ui/label'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap/swap-rates'
import { getQuotes } from '../../../store/store'
import { ActionEnum, NetworkFeeType, RootStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import {
  FADE_IN_OUT_DURATION,
  labelTranslateFn,
  sortQuotes,
} from '../../../utils'
import { Box, Text, Button, palette } from '../../../theme'
import SwapFeeSelector from '../../../components/ui/swap-fee-selector'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  balanceStateFamily,
  swapPairState,
  networkState,
  swapScreenDoubleLongEvent as SSDLE,
  SwapScreenPopUpTypes,
} from '../../../atoms'
import I18n from 'i18n-js'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import {
  feePerUnit,
  isEIP1559Fees,
  newSendFees,
} from '@liquality/wallet-core/dist/src/utils/fees'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Card } from '../../../theme'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import AssetIcon from '../../../components/asset-icon'
import { LikelyWaitProps } from '../../../components/ui/fee-selector'
import { fetchFeesForAsset } from '../../../store/store'
import AtomicSwapPopUp from './atomic-swap-popup'
import { AppIcons, Fonts } from '../../../assets'

const {
  ChevronRightIcon: ChevronRight,
  AngleDownIcon: AngleDown,
  AngleRightIcon: AngleRight,
  ArrowDown,
  Clock,
} = AppIcons

export type SwapEventType = {
  fromAmount?: BigNumber
  toAmount?: BigNumber
  minimumValue?: BigNumber
  maximumValue?: BigNumber
}

export enum SwapEventActionKind {
  FromAmountUpdated = 'FROM_AMOUNT_UPDATED',
  ToAmountUpdated = 'TO_AMOUNT_UPDATED',
  SetMaxVal = 'SET_MAX_VALUE',
  SetMinVal = 'SET_MIN_VALUE',
  SetFromAmtFrmMinVal = 'SET_FROM_AMOUNT_from_MIN_VALUE',
}

export type SwapEventAction =
  | {
      type: SwapEventActionKind.FromAmountUpdated
      payload: { fromAmount: BigNumber }
    }
  | {
      type: SwapEventActionKind.ToAmountUpdated
      payload: { toAmount: BigNumber }
    }
  | {
      type: SwapEventActionKind.SetMinVal
      payload: { minimumValue: BigNumber }
    }
  | {
      type: SwapEventActionKind.SetMaxVal
      payload: { maximumValue: BigNumber }
    }
  | {
      type: SwapEventActionKind.SetFromAmtFrmMinVal
      payload: { minimumValue: BigNumber }
    }

const initialSwapSEventState: SwapEventType = {
  fromAmount: new BigNumber(1),
  maximumValue: new BigNumber(0),
  minimumValue: new BigNumber(0),
  toAmount: new BigNumber(0),
}

enum Direction {
  From,
  To,
}

enum ErrorMessaging {
  EnableToken,
  PairsList,
  MultipleSwaps,
  NotEngRequestTkn,
  NotEngLiq,
  MoreTknReq,
}

interface ErrorMsgAndType {
  msg: string
  type: ErrorMessaging | null
}

type AmountTextInputBlockHandle = React.ElementRef<typeof AmountTextInputBlock>

export const reducer: Reducer<SwapEventType, SwapEventAction> = (
  state,
  action,
): SwapEventType => {
  const { payload, type } = action
  switch (type) {
    case SwapEventActionKind.FromAmountUpdated:
      return {
        ...state,
        fromAmount: payload.fromAmount,
      }
    case SwapEventActionKind.ToAmountUpdated:
      return {
        ...state,
        toAmount: payload.toAmount,
      }
    case SwapEventActionKind.SetMaxVal:
      return {
        ...state,
        maximumValue: payload.maximumValue,
        fromAmount: payload.maximumValue,
      }
    case SwapEventActionKind.SetMinVal:
      return {
        ...state,
        minimumValue: payload.minimumValue,
      }
    case SwapEventActionKind.SetFromAmtFrmMinVal:
      return {
        ...state,
        fromAmount: payload.minimumValue,
        maximumValue: new BigNumber(0),
      }
    default:
      throw new Error()
  }
}

type SwapScreenProps = NativeStackScreenProps<RootStackParamList, 'SwapScreen'>

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { route, navigation } = props
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const fromBalance = useRecoilValue(
    balanceStateFamily({
      asset: swapPair.fromAsset?.code || '',
      assetId: swapPair.fromAsset?.id || '',
    }),
  )
  const [gasFees, setGasFees] = useState<GasFees>()

  const activeNetwork = useRecoilValue(networkState)
  const [areFeeSelectorsVisible, setFeeSelectorsVisible] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<SwapQuote>()
  const [error, setError] = useState<ErrorMsgAndType>({ msg: '', type: null })
  const fromNetworkFee = useRef<NetworkFeeType>()
  const toNetworkFee = useRef<NetworkFeeType>()
  const [quotes, setQuotes] = useState<any[]>([])
  const [fromNetworkSpeed, setFromNetworkSpeed] = useState<FeeLabel>(
    FeeLabel.Average,
  )
  const [toNetworkSpeed, setToNetworkSpeed] = useState<FeeLabel>(
    FeeLabel.Average,
  )
  const [state, dispatch] = useReducer(reducer, initialSwapSEventState)

  const [swapScreenPopTypes, setSwapScreenPopTypes] = useRecoilState(SSDLE)

  const [gas, setGasFee] = useState('0')

  const toggleFeeSelectors = () => {
    setFeeSelectorsVisible(!areFeeSelectorsVisible)
  }
  const assetsAreSameChain =
    getNativeAsset(swapPair.fromAsset?.code) ===
    getNativeAsset(swapPair.toAsset?.code)

  const wallet = setupWallet({
    ...defaultOptions,
  })
  const { activeWalletId } = wallet.state

  const amountInputRef = useRef<AmountTextInputBlockHandle>(null)
  const amountInputRefTo = useRef<AmountTextInputBlockHandle>(null)

  const handleFromAssetPress = () => {
    setSwapPair((prevVal) => ({ ...prevVal, fromAsset: undefined }))
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('swapScreen.selectAssetForSwap')!,
      swapAssetPair: { ...swapPair, fromAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }

  const onDoubleTapOrLongPress = useCallback(
    (popUpTypes: SwapScreenPopUpTypes) => () => {
      setSwapScreenPopTypes(popUpTypes)
      setTimeout(() => {
        setSwapScreenPopTypes(SwapScreenPopUpTypes.Null)
      }, 3000)
    },
    [setSwapScreenPopTypes],
  )

  const handleToAssetPress = () => {
    setSwapPair((prevVal) => ({ ...prevVal, toAsset: undefined }))
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('swapScreen.selectAssetForSwap')!,
      swapAssetPair: { ...swapPair, toAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }

  const handleSelectQuote = (quote: SwapQuote) => {
    setSelectedQuote(quote)
  }

  const handleCancelPress = useCallback(() => {
    navigation.navigate('OverviewScreen', {})
  }, [navigation])
  const handleReviewBtnPress = async () => {
    if (
      !swapPair.fromAsset ||
      !swapPair.toAsset ||
      !state.fromAmount ||
      !selectedQuote ||
      !fromNetworkFee.current ||
      (!toNetworkFee.current && !assetsAreSameChain)
    ) {
      Alert.alert(labelTranslateFn('swapScreen.invalidArgs')!)
      return
    }

    //TODO Update wallet-core so it does not return objects with functions in them
    delete selectedQuote.min
    delete selectedQuote.max

    navigation.navigate('SwapReviewScreen', {
      swapTransaction: {
        fromAsset: swapPair.fromAsset,
        toAsset: swapPair.toAsset,
        fromAmount: state.fromAmount.toNumber(),
        toAmount: state.toAmount?.toNumber() || 0,
        quote: selectedQuote,
        fromNetworkFee: fromNetworkFee.current,
        toNetworkFee: toNetworkFee.current,
      },
      screenTitle: I18n.t('swapScreen.swapReview', {
        swapPairfromAssetCode: swapPair.fromAsset.code,
        swapPairtoAssetCode: swapPair.toAsset.code,
      }),
      assetsAreSameChain,
    })
  }

  const handleMinPress = () => {
    amountInputRef.current?.setAfterDispatch(state.minimumValue?.toString()!)
    dispatch({
      type: SwapEventActionKind.SetFromAmtFrmMinVal,
      payload: { minimumValue: state.minimumValue! },
    })
  }

  const handleMaxPress = () => {
    //TODO Fix this. maximumValue = fromBalance - Fee
    if (swapPair && swapPair.fromAsset && swapPair.fromAsset.code) {
      const amnt = unitToCurrency(
        getAsset(activeNetwork, swapPair.fromAsset.code),
        fromBalance || 0,
      )
      amountInputRef.current?.setAfterDispatch(amnt?.toString()!)
      dispatch({
        type: SwapEventActionKind.SetMaxVal,
        payload: {
          maximumValue: new BigNumber(amnt),
        },
      })
    }
  }

  const handleCustomPressBtn = (
    code: string,
    chain: ChainId,
    direction: Direction,
    networkFee: NetworkFeeType,
    networkSpeed: FeeLabel,
  ) => {
    navigation.navigate(
      isEIP1559Fees(chain) ? 'CustomFeeEIP1559Screen' : 'CustomFeeScreen',
      {
        assetData: route.params.assetData,
        code,
        screenTitle: labelTranslateFn('sendScreen.networkSpeed')!,
        amountInput:
          direction === Direction.From
            ? state.fromAmount?.toString()
            : state.toAmount?.toString(),
        fee: gasFees,
        speedMode: networkSpeed,
        swap: true,
      },
    )
  }

  const getAssetFees = () => {
    const assetFees = {}
    const suggestedFees = wallet.getters.suggestedFeePrices(
      getNativeAsset(swapPair.fromAsset.code),
    )

    if (suggestedFees) {
      Object.assign(assetFees, suggestedFees)
    }
    return assetFees
  }

  const updateBestQuote = useCallback(async () => {
    const amount = state.fromAmount?.gt(0) ? state.fromAmount : new BigNumber(1)
    let bestQuoteAmount = amount
    if (swapPair.fromAsset?.code && swapPair.toAsset?.code) {
      const quoteList = await getQuotes(
        swapPair.fromAsset.code,
        swapPair.toAsset.code,
        amount,
      )

      if (quoteList?.length === 0) {
        setError({
          msg: labelTranslateFn('swapScreen.isNotTraded')!,
          type: ErrorMessaging.PairsList,
        })
      } else {
        const sortedQuotes = sortQuotes(activeNetwork, quoteList)
        setQuotes(sortedQuotes)
        if (sortedQuotes.length) {
          const swapProvider = getSwapProvider(
            activeNetwork,
            sortedQuotes[0].provider,
          )
          setSelectedQuote(sortedQuotes[0])
          const minValue = await swapProvider.getMin({
            network: activeNetwork,
            from: swapPair.fromAsset.code,
            to: swapPair.toAsset.code,
            amount: amount,
          })

          //TODO: Not sure if all this logic is needed, as we are currently accessing the
          //same fees in another way using getFeeAsset(asset),
          const { fromTxType } = swapProvider
          const assetFees = getAssetFees(swapPair.fromAsset?.chain)
          const feesToPopulate = {
            [activeNetwork]: newSendFees(),
            [activeNetwork]: newSendFees(),
          }
          const totalFees = await swapProvider.estimateFees({
            network: activeNetwork,
            walletId: activeWalletId,
            asset: swapPair.fromAsset.code,
            txType: fromTxType,
            quote: sortedQuotes[0],
            feePrices: Object.values(assetFees).map((fee) =>
              feePerUnit(
                fee.fee,
                getAsset(activeNetwork, swapPair.fromAsset.code).chain,
              ),
            ),
          })
          if (!totalFees) return

          for (const [speed, fee] of Object.entries(assetFees)) {
            const feePrice = feePerUnit(
              fee.fee,
              getAsset(activeNetwork, swapPair.fromAsset.code).chain,
            )

            feesToPopulate[activeNetwork][speed] =
              feesToPopulate[activeNetwork][speed] + totalFees[feePrice]
          }
          //

          dispatch({
            type: SwapEventActionKind.SetMinVal,
            payload: {
              minimumValue: minValue,
            },
          })
          bestQuoteAmount = new BigNumber(
            unitToCurrency(
              getAsset(activeNetwork, swapPair.toAsset.code),
              new BigNumber(sortedQuotes[0].toAmount || 0),
            ),
          )
        }
      }
    }

    if (bestQuoteAmount.eq(0)) {
      setError({
        msg: labelTranslateFn('swapScreen.quoteNotFnd')!,
        type: null,
      })
    }
    dispatch({
      type: SwapEventActionKind.ToAmountUpdated,
      payload: { toAmount: bestQuoteAmount },
    })
    amountInputRefTo.current?.setAfterDispatch(bestQuoteAmount?.toString()!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeNetwork,
    state.fromAmount,
    swapPair?.fromAsset?.code,
    swapPair?.toAsset?.code,
  ])

  useEffect(() => {
    if (swapPair.toAsset) {
      fetchFeesForAsset(swapPair.toAsset?.code).then((gasFee) => {
        setGasFee(gasFee.average.toFixed(2))
      })
    }
  }, [swapPair.toAsset])

  useEffect(() => {
    updateBestQuote()
    let nativeCustomFeeCode = route.params.code
      ? getNativeAsset(route.params.code)
      : ''
    let nativeToCode = swapPair.toAsset
      ? getNativeAsset(swapPair.toAsset.code)
      : ''
    let nativeFromCode = swapPair.fromAsset
      ? getNativeAsset(swapPair.fromAsset.code)
      : ''
    if (swapPair && route.params.customFee) {
      let params = {
        speed: 'custom',
        value: route.params.customFee,
      }
      if (
        nativeCustomFeeCode === nativeToCode &&
        nativeCustomFeeCode === nativeFromCode
      ) {
        setToNetworkSpeed('custom')
        setFromNetworkSpeed('custom')
        toNetworkFee.current = params
        fromNetworkFee.current = params
      } else if (nativeCustomFeeCode === nativeToCode) {
        toNetworkFee.current = params
        setToNetworkSpeed('custom')
      } else if (nativeCustomFeeCode === nativeFromCode) {
        fromNetworkFee.current = params
        setFromNetworkSpeed('custom')
      }
    }
  }, [
    route.params.code,
    route.params.customFee,
    swapPair,
    swapPair.fromAsset,
    swapPair.toAsset,
    updateBestQuote,
  ])

  const getCompatibleErrorMsg = React.useCallback(() => {
    const { msg, type } = error
    if (!msg) {
      return null
    }

    const onOkDoItPress = () => {}
    const onTextPress = () => {}
    const onGetTokenPress = () => {}

    switch (type) {
      case ErrorMessaging.EnableToken:
        return (
          <MessageBanner
            text1={I18n.t('swapScreen.toTradePair', {
              token: swapPair.fromAsset?.code,
            })}
            btnLabel={{ tx: 'swapScreen.okDoIt' }}
            onAction={onOkDoItPress}
          />
        )
      case ErrorMessaging.PairsList:
        return (
          <MessageBanner
            text1={{ tx: 'swapScreen.isNotTraded' }}
            linkTxt={{ tx: 'swapScreen.here' }}
            onTextPress={onTextPress}
            text2={I18n.t('swapScreen.youCanAlsoSuggestToken', {
              token: swapPair.fromAsset?.code,
              channel: 'Discord',
            })}
          />
        )
      case ErrorMessaging.MultipleSwaps:
        return (
          <MessageBanner
            text1={{ tx: 'swapScreen.isNotTradedMaybeThereIsWay' }}
          />
        )
      case ErrorMessaging.NotEngRequestTkn:
        return (
          <MessageBanner
            text1={I18n.t('swapScreen.notEnoughLiquidityYouCanReq', {
              token: swapPair.fromAsset?.code,
              channel: 'Discord',
            })}
          />
        )
      case ErrorMessaging.NotEngLiq:
        return (
          <MessageBanner
            text1={{ tx: 'swapScreen.notEnoughLiquidityTryAgain' }}
          />
        )
      case ErrorMessaging.MoreTknReq:
        return (
          <MessageBanner
            text1={I18n.t('swapScreen.moreTokenRequired', {
              token: swapPair.fromAsset?.code,
            })}
            btnLabel={I18n.t('swapScreen.getToken', {
              token: swapPair.fromAsset?.code,
            })}
            onAction={onGetTokenPress}
          />
        )
      case ErrorMessaging.EnableToken:
        return (
          <MessageBanner
            text1={I18n.t('swapScreen.toTradePair', {
              token: swapPair.fromAsset?.code,
            })}
            btnLabel={{ tx: 'swapScreen.okDoIt' }}
            onAction={onOkDoItPress}
          />
        )
      default:
        return <MessageBanner text1={msg} />
    }
  }, [error, swapPair.fromAsset?.code])

  const renderSwapFeeSelector = () => {
    const { fees } = wallet.state

    let feeForAsset

    const isEthFromAsset = swapPair.fromAsset
      ? swapPair.fromAsset.code === 'ETH'
      : false
    if (isEthFromAsset) {
      feeForAsset = swapPair.toAsset
        ? fees[activeNetwork]?.[activeWalletId]?.[swapPair.toAsset?.code]
        : null
    } else {
      feeForAsset = swapPair.fromAsset
        ? fees[activeNetwork]?.[activeWalletId]?.[swapPair.fromAsset?.code]
        : null
    }

    const likelyWaitForAsset: LikelyWaitProps = feeForAsset
      ? {
          slow: feeForAsset?.slow.wait || 0,
          average: feeForAsset?.average.wait || 0,
          fast: feeForAsset?.fast.wait || 0,
        }
      : {
          slow: 0,
          average: 0,
          fast: 0,
        }
    //If swap is on the same chain, there is just 1 type of gasfees
    if (assetsAreSameChain)
      return (
        <>
          {swapPair.fromAsset?.code ? (
            <SwapFeeSelector
              asset={getNativeAsset(swapPair.fromAsset?.code)}
              handleCustomPress={() =>
                handleCustomPressBtn(
                  swapPair.fromAsset?.code!,
                  swapPair.fromAsset?.chain!,
                  Direction.From,
                  fromNetworkFee,
                  fromNetworkSpeed,
                )
              }
              networkFee={fromNetworkFee}
              selectedQuote={selectedQuote}
              type={'from'}
              changeNetworkSpeed={setFromNetworkSpeed}
              gasFees={gasFees}
              setGasFees={setGasFees}
              customFee={route.params.customFee}
              customFeeAsset={route.params.code}
              fromAsset={getNativeAsset(swapPair.fromAsset?.code)}
              doubleLongTapFeelabel={swapScreenPopTypes}
              likelyWait={likelyWaitForAsset}
            />
          ) : null}
        </>
      )
    else {
      return (
        <>
          {swapPair.fromAsset?.code ? (
            <SwapFeeSelector
              asset={swapPair.fromAsset?.code}
              handleCustomPress={() =>
                handleCustomPressBtn(
                  swapPair.fromAsset?.code!,
                  swapPair.fromAsset?.chain!,
                  Direction.From,
                  fromNetworkFee,
                  fromNetworkSpeed,
                )
              }
              networkFee={fromNetworkFee}
              selectedQuote={selectedQuote}
              type={'from'}
              changeNetworkSpeed={setFromNetworkSpeed}
              gasFees={gasFees}
              setGasFees={setGasFees}
              customFee={route.params.customFee}
              customFeeAsset={route.params.code}
              fromAsset={getNativeAsset(swapPair.fromAsset?.code)}
              doubleLongTapFeelabel={swapScreenPopTypes}
              likelyWait={likelyWaitForAsset}
            />
          ) : null}
          {swapPair.toAsset?.code ? (
            <SwapFeeSelector
              asset={swapPair.toAsset?.code}
              handleCustomPress={() =>
                handleCustomPressBtn(
                  swapPair.toAsset?.code!,
                  swapPair.toAsset?.chain!,
                  Direction.To,
                  toNetworkFee,
                  toNetworkSpeed,
                )
              }
              networkFee={toNetworkFee}
              selectedQuote={selectedQuote}
              type={'to'}
              changeNetworkSpeed={setToNetworkSpeed}
              gasFees={gasFees}
              setGasFees={setGasFees}
              customFee={route.params.customFee}
              customFeeAsset={route.params.code}
              toAsset={getNativeAsset(swapPair.toAsset?.code)}
              doubleLongTapFeelabel={swapScreenPopTypes}
              likelyWait={likelyWaitForAsset}
            />
          ) : null}
        </>
      )
    }
  }

  const availableGas = I18n.t('overviewScreen.availableGas', {
    gas,
    token: swapPair.toAsset?.code,
  })

  return (
    <Box flex={1}>
      <TouchableWithoutFeedback
        onPress={() => setSwapScreenPopTypes(SwapScreenPopUpTypes.Null)}>
        <Box
          flex={1}
          width={Dimensions.get('window').width}
          backgroundColor="mainBackground">
          {getCompatibleErrorMsg()}
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="flex-end"
            marginHorizontal="xl">
            <AmountTextInputBlock
              type="FROM"
              defaultAmount={state.fromAmount}
              label={labelTranslateFn('common.send')!}
              chain={swapPair.fromAsset?.chain || ChainId.Bitcoin}
              assetSymbol={swapPair.fromAsset?.code || 'BTC'}
              dispatch={dispatch}
              ref={amountInputRef}
              doubleOrLongPress={onDoubleTapOrLongPress(
                SwapScreenPopUpTypes.FromAsset,
              )}
            />
            <Pressable style={styles.chevronBtn} onPress={handleFromAssetPress}>
              <ChevronRight width={15} height={15} />
            </Pressable>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            marginVertical="m"
            paddingHorizontal="xl">
            <Box flexDirection="row">
              <Button
                type="tertiary"
                variant="s"
                label={{ tx: 'common.min' }}
                onPress={handleMinPress}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="tertiary"
                variant="s"
                label={{ tx: 'common.max' }}
                onPress={handleMaxPress}
                isBorderless={false}
                isActive={true}
              />
            </Box>
            <Box flexDirection="row">
              <Label text={{ tx: 'common.available' }} variant="light" />
              {fromBalance && swapPair.fromAsset?.code ? (
                <Text style={[styles.font, styles.amount]}>
                  {fromBalance &&
                    `${prettyBalance(
                      new BigNumber(fromBalance),
                      swapPair.fromAsset.code,
                    )} ${swapPair.fromAsset.code}`}
                </Text>
              ) : null}
            </Box>
          </Box>
          <Box alignItems="center" marginVertical="m" paddingHorizontal="xl">
            <ArrowDown />
            {swapScreenPopTypes === SwapScreenPopUpTypes.FromAsset ? (
              <Box position={'absolute'} right={20} bottom={10} zIndex={1}>
                <Animated.View
                  key={'swapPopupForFromAsset'}
                  entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
                  exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
                  <Card variant={'swapPopup'} width={180} height={60}>
                    <Box flexDirection={'row'} alignItems={'center'} flex={1}>
                      <Box
                        width={34}
                        height={34}
                        borderRadius={17}
                        marginHorizontal={'m'}>
                        <AssetIcon
                          size={33}
                          asset={swapPair.fromAsset?.code}
                          chain={swapPair.fromAsset?.chain}
                        />
                      </Box>
                      <Box flex={1}>
                        <Text>{swapPair.fromAsset?.code}</Text>
                        <Text fontSize={12} color="tertiaryForeground">
                          {shortenAddress(swapPair.fromAsset?.address || '')}
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Animated.View>
              </Box>
            ) : null}
          </Box>
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="flex-end"
            zIndex={1}
            marginHorizontal="xl">
            <AmountTextInputBlock
              type="TO"
              defaultAmount={state.toAmount}
              label={labelTranslateFn('common.receive')!}
              chain={swapPair.toAsset?.chain || ChainId.Ethereum}
              assetSymbol={swapPair.toAsset?.code || 'ETH'}
              ref={amountInputRefTo}
              doubleOrLongPress={onDoubleTapOrLongPress(
                SwapScreenPopUpTypes.ToAsset,
              )}
            />
            <Pressable style={styles.chevronBtn} onPress={handleToAssetPress}>
              <ChevronRight width={15} height={15} />
            </Pressable>
            {swapScreenPopTypes === SwapScreenPopUpTypes.ToAsset ? (
              <Box position={'absolute'} right={10} top={80}>
                <Box flex={1} alignItems="center" justifyContent={'center'}>
                  <Animated.View
                    key={'swapPopupForToAsset'}
                    entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
                    exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
                    <Card
                      variant={'swapPopUpForToAsset'}
                      height={60}
                      width={200}
                      style={{ borderLeftColor: swapPair.toAsset?.color }}>
                      <Box flexDirection={'row'} alignItems={'center'} flex={1}>
                        <Box
                          width={30}
                          height={30}
                          borderRadius={15}
                          marginHorizontal={'s'}
                          style={{ backgroundColor: swapPair.toAsset?.color }}
                        />
                        <Box flex={1}>
                          <Text>{swapPair.toAsset?.name}</Text>
                          <Text fontSize={12} color="tertiaryForeground">
                            {shortenAddress(swapPair.toAsset?.address || '')}
                          </Text>
                          <Text fontSize={12} color="tertiaryForeground">
                            {availableGas}
                          </Text>
                        </Box>
                      </Box>
                      {Platform.OS === 'ios' && (
                        <Box
                          position={'absolute'}
                          right={'30%'}
                          top={-7}
                          zIndex={1}>
                          <Box
                            flex={1}
                            alignItems="center"
                            justifyContent={'center'}>
                            <Card
                              variant={'rightArrowCard'}
                              style={{ transform: [{ rotate: '-135deg' }] }}
                            />
                          </Box>
                        </Box>
                      )}
                    </Card>
                  </Animated.View>
                </Box>
              </Box>
            ) : null}
            {swapScreenPopTypes === SwapScreenPopUpTypes.AtomicSwap ? (
              <AtomicSwapPopUp bottom={-20} />
            ) : null}
          </Box>

          {swapPair.fromAsset?.code && swapPair.toAsset?.code ? (
            <Box>
              <SwapRates
                fromAsset={swapPair.fromAsset.code}
                toAsset={swapPair.toAsset.code}
                quotes={quotes}
                selectQuote={handleSelectQuote}
                selectedQuote={selectedQuote}
                clickable
                style={styles.paddingHorizontal}
                doubleOrLongPress={onDoubleTapOrLongPress(
                  SwapScreenPopUpTypes.AtomicSwap,
                )}
              />
            </Box>
          ) : null}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginVertical="m"
            paddingHorizontal="xl">
            <Pressable
              onPress={toggleFeeSelectors}
              style={styles.feeOptionsButton}>
              {areFeeSelectorsVisible ? (
                <AngleDown style={styles.dropdown} />
              ) : (
                <AngleRight style={styles.dropdown} />
              )}
              <Label text={{ tx: 'common.networkSpeed' }} variant="strong" />
              {swapPair.fromAsset?.code && swapPair.toAsset?.code ? (
                <Label
                  text={
                    assetsAreSameChain
                      ? `${getNativeAsset(
                          swapPair.fromAsset?.code,
                        )} ${fromNetworkSpeed}`
                      : `${swapPair.fromAsset?.code} ${fromNetworkSpeed} / ${swapPair.toAsset?.code} ${toNetworkSpeed}`
                  }
                  variant="light"
                />
              ) : null}
            </Pressable>
          </Box>
          {areFeeSelectorsVisible &&
          fromNetworkFee &&
          toNetworkFee &&
          selectedQuote ? (
            <>
              {renderSwapFeeSelector()}
              <Warning
                text1={{ tx1: 'common.maxSlippage' }}
                text2={I18n.t('common.swapDoesnotComp', {
                  date: `${new Date(
                    new Date().getTime() + 3 * 60 * 60 * 1000,
                  ).toTimeString()}`,
                })}>
                <Clock width={15} height={15} style={styles.icon} />
              </Warning>
            </>
          ) : null}
          <Box
            position="absolute"
            bottom={20}
            width={Dimensions.get('screen').width}>
            <Box flexDirection="row" justifyContent="space-around">
              <Button
                type="secondary"
                variant="m"
                label={{ tx: 'common.cancel' }}
                onPress={handleCancelPress}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label={{ tx: 'common.review' }}
                onPress={handleReviewBtnPress}
                isBorderless={false}
                isActive={true}
              />
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = StyleSheet.create({
  font: {
    fontFamily: Fonts.Regular,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
  },
  amount: {
    color: palette.black2,
    marginVertical: 5,
    lineHeight: 18,
  },
  feeOptionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronBtn: {
    marginLeft: 15,
    marginBottom: 10,
  },
  icon: {
    alignSelf: 'flex-start',
    marginRight: 5,
  },
  dropdown: {
    marginRight: 5,
  },
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
})

export default SwapScreen
