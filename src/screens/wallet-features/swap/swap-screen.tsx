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
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  ActionEnum,
  CustomNetworkFeeType,
  MainStackParamList,
  CustomFeeLabel,
  GasFees,
} from '../../../types'
import {
  Box,
  Text,
  Pressable,
  faceliftPalette,
  TextInput,
  ColorType,
  ScrollView,
  FLEX_1,
} from '../../../theme'
import { AppIcons } from '../../../assets'
import { scale } from 'react-native-size-matters'
import {
  balanceStateFamily,
  fiatRatesState,
  networkState,
  swapPairState,
  swapQuotesState,
  swapQuoteState,
} from '../../../atoms'
import { useRecoilState, useRecoilValue } from 'recoil'
import { BigNumber } from '@liquality/types'
import AssetIcon from '../../../components/asset-icon'
import { labelTranslateFn, sortQuotes } from '../../../utils'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import {
  cryptoToFiat,
  fiatToCrypto,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { fetchFeesForAsset, getQuotes } from '../../../store/store'
import { dpUI } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { SwapProviderType } from '@liquality/wallet-core/dist/src/store/types'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'
import MessageBanner from '../../../components/ui/message-banner'
import I18n from 'i18n-js'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import FeeEditorScreen from '../custom-fee/fee-editor-screen'

const {
  WavyArrow,
  ChevronRightIcon,
  ThinDownArrowActive,
  ThinDoubleArrowActive,
  NetworkSpeedEdit,
  DoubleArrowThick,
  DoubleArrowThickDisabled,
} = AppIcons

type SwapScreenProps = NativeStackScreenProps<MainStackParamList, 'SwapScreen'>

enum InputFocus {
  TO,
  FROM,
  NULL,
}

enum MinOrMax {
  MIN,
  MAX,
  NULL,
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

type SwapEventType = {
  fromAmount: string
  toAmount: string
  minimumValue: string
  maximumValue: string
}

enum SwapEventActionKind {
  FromAmountUpdated = 'FROM_AMOUNT_UPDATED',
  ToAmountUpdated = 'TO_AMOUNT_UPDATED',
  SetMaxVal = 'SET_MAX_VALUE',
  SetMinVal = 'SET_MIN_VALUE',
  SetFromAmtFrmMinVal = 'SET_FROM_AMOUNT_from_MIN_VALUE',
}

export type SwapEventAction =
  | {
      type: SwapEventActionKind.FromAmountUpdated
      payload: { fromAmount: string }
    }
  | {
      type: SwapEventActionKind.ToAmountUpdated
      payload: { toAmount: string }
    }
  | {
      type: SwapEventActionKind.SetMinVal
      payload: { minimumValue: string }
    }
  | {
      type: SwapEventActionKind.SetMaxVal
      payload: { maximumValue: string }
    }

const initialSwapSEventState: SwapEventType = {
  fromAmount: '',
  maximumValue: '',
  minimumValue: '',
  toAmount: '',
}

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
    default:
      throw new Error()
  }
}

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { navigation, route } = props
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const fromBalance = useRecoilValue(
    balanceStateFamily({
      asset: swapPair.fromAsset?.code || '',
      assetId: swapPair.fromAsset?.id || '',
    }),
  )
  const activeNetwork = useRecoilValue(networkState)
  const [error, setError] = useState<ErrorMsgAndType>({ msg: '', type: null })
  const [quotes, setQuotes] = useRecoilState(swapQuotesState)
  const [focusType, setFocusType] = React.useState(InputFocus.NULL)
  const [minOrMax, setMinOrMax] = React.useState(MinOrMax.NULL)
  const fromNetworkFee = useRef<CustomNetworkFeeType>()
  const toNetworkFee = useRef<CustomNetworkFeeType>()
  const [gasFees, setGasFees] = useState<GasFees>()
  const [state, dispatch] = useReducer(reducer, initialSwapSEventState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [selectedQuote, setSelectedQuote] = useRecoilState(swapQuoteState)
  const [isFromAmountNative, setIsFromAmountNative] = useState(true)
  const [isToAmountNative, setIsToAmountNative] = useState(true)
  const [showFeeEditorModal, setShowFeeEditorModal] = useState(false)

  const fromFocused = () => {
    setFocusType(InputFocus.FROM)
  }

  const onBlur = () => {
    setFocusType(InputFocus.NULL)
  }

  useEffect(() => {
    if (swapPair.toAsset?.code && selectedQuote) {
      const bestQuoteAmountWhenCrypto = new BigNumber(
        unitToCurrency(
          getAsset(activeNetwork, swapPair.toAsset.code),
          new BigNumber(selectedQuote?.toAmount),
        ),
      )
      let calculatedAmount = ''
      if (isFromAmountNative) {
        calculatedAmount = String(
          bestQuoteAmountWhenCrypto.multipliedBy(
            new BigNumber(state.fromAmount || 0),
          ),
        )
      } else {
        const fromFiatToCrypto =
          (
            swapPair.fromAsset &&
            fiatToCrypto(
              new BigNumber(state.fromAmount || 0),
              fiatRates?.[swapPair.fromAsset.code] || 0,
            )
          )?.toString() || ''
        calculatedAmount = String(
          bestQuoteAmountWhenCrypto.multipliedBy(
            new BigNumber(fromFiatToCrypto || 0),
          ),
        )
      }
      const toCryptoToFiat =
        (
          swapPair.toAsset &&
          cryptoToFiat(
            new BigNumber(calculatedAmount || 0),
            fiatRates?.[swapPair.toAsset.code] || 0,
          )
        )?.toString() || ''

      if (isToAmountNative) {
        dispatch({
          type: SwapEventActionKind.ToAmountUpdated,
          payload: {
            toAmount: dpUI(Number(calculatedAmount), 6).toString(),
          },
        })
      } else {
        dispatch({
          type: SwapEventActionKind.ToAmountUpdated,
          payload: { toAmount: dpUI(Number(toCryptoToFiat), 6).toString() },
        })
      }
    }
  }, [
    activeNetwork,
    state.fromAmount,
    swapPair.toAsset?.code,
    selectedQuote,
    isFromAmountNative,
    swapPair.fromAsset,
    fiatRates,
    swapPair.toAsset,
    isToAmountNative,
  ])

  useEffect(() => {
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
        speed: CustomFeeLabel.Custom,
        value: route.params.customFee,
      }
      if (
        nativeCustomFeeCode === nativeToCode &&
        nativeCustomFeeCode === nativeFromCode
      ) {
        toNetworkFee.current = params
        fromNetworkFee.current = params
      } else if (nativeCustomFeeCode === nativeToCode) {
        toNetworkFee.current = params
      } else if (nativeCustomFeeCode === nativeFromCode) {
        fromNetworkFee.current = params
      }
    } else {
      let params = {
        speed: FeeLabel.Average,
        value: gasFees?.average.toNumber() || 0,
      }
      toNetworkFee.current = params
      fromNetworkFee.current = params
    }
  }, [
    route.params.code,
    route.params.customFee,
    swapPair,
    swapPair.fromAsset,
    swapPair.toAsset,
    gasFees,
  ])

  useEffect(() => {
    fetchFeesForAsset(swapPair.fromAsset?.code || '').then((result) =>
      setGasFees(result),
    )
  }, [swapPair.fromAsset])

  useEffect(() => {
    async function getQuoteList() {
      if (swapPair.fromAsset?.code && swapPair.toAsset?.code) {
        try {
          const quoteList = await getQuotes(
            swapPair.fromAsset.code,
            swapPair.toAsset.code,
            new BigNumber(1),
          )

          if (quoteList && quoteList?.length) {
            const sortedQuotes = sortQuotes(activeNetwork, quoteList)
            const swapProvider = getSwapProvider(
              activeNetwork,
              sortedQuotes[0].provider as SwapProviderType,
            )
            const minValue = await swapProvider.getMin({
              network: activeNetwork,
              from: swapPair.fromAsset.code,
              to: swapPair.toAsset.code,
              amount: new BigNumber(1),
            })

            const bestQuoteAmount = new BigNumber(
              unitToCurrency(
                getAsset(activeNetwork, swapPair.toAsset.code),
                new BigNumber(sortedQuotes[0].toAmount || 0),
              ),
            )

            if (bestQuoteAmount.eq(0)) {
              setError({
                msg: labelTranslateFn('swapScreen.quoteNotFnd')!,
                type: null,
              })
            }

            dispatch({
              type: SwapEventActionKind.SetMinVal,
              payload: {
                minimumValue: minValue.toString(),
              },
            })

            setSelectedQuote(quoteList[0])
            setQuotes(quoteList)
          } else {
            setSelectedQuote(null)
            setQuotes([])
            setError({
              msg: labelTranslateFn('swapScreen.isNotTraded')!,
              type: ErrorMessaging.PairsList,
            })
          }
        } catch (error) {
          // handle error here
        }
      }
    }
    if (fromBalance <= 0) {
      setError({
        type: ErrorMessaging.NotEngLiq,
        msg: labelTranslateFn('swapScreen.notEnoughLiquidityTryAgain')!,
      })
      setSelectedQuote(null)
      setQuotes([])
      return
    }
    getQuoteList()
    setError({ msg: '', type: null })
  }, [
    activeNetwork,
    swapPair.fromAsset?.code,
    swapPair.toAsset?.code,
    fromBalance,
    navigation,
    setQuotes,
    setSelectedQuote,
  ])

  const getMinValue = () => {
    dispatch({
      type: SwapEventActionKind.FromAmountUpdated,
      payload: { fromAmount: state.minimumValue },
    })
  }

  const getMaxValue = () => {
    if (swapPair && swapPair.fromAsset && swapPair.fromAsset.code && gasFees) {
      const amount = unitToCurrency(
        getAsset(activeNetwork, swapPair.fromAsset.code),
        fromBalance || 0,
      )

      const maximumValue = amount.minus(gasFees.average)
      if (maximumValue.lte(0)) {
        setError({
          msg: labelTranslateFn('swapScreen.notEnoughLiquidityTryAgain')!,
          type: ErrorMessaging.NotEngLiq,
        })
      } else {
        let calculatedAmount = ''
        if (!isFromAmountNative) {
          calculatedAmount =
            (
              swapPair.fromAsset &&
              cryptoToFiat(
                maximumValue,
                fiatRates?.[swapPair.fromAsset.code] || 0,
              )
            )?.toString() || ''
        } else {
          calculatedAmount = maximumValue.toString()
        }

        dispatch({
          type: SwapEventActionKind.SetMaxVal,
          payload: {
            maximumValue: dpUI(Number(calculatedAmount), 6).toString(),
          },
        })
      }
    }
  }

  const handleTextChange = (text: string) => {
    // avoid more than one decimal points and only number are allowed
    const validated = text.match(/^(\d*\.{0,1}\d{0,20}$)/)
    if (validated) {
      dispatch({
        type: SwapEventActionKind.FromAmountUpdated,
        payload: { fromAmount: text },
      })
    }
  }

  const onQuotesPress = () => {
    const screenTitle = I18n.t(
      quotes.length === 1 ? 'oneProviderQuote' : 'nosProviderQuote',
      { quote: quotes.length },
    )
    navigation.navigate('SwapProviderModal', { screenTitle })
  }

  const onMinOrMaxFnPress = (selected: MinOrMax) => {
    setMinOrMax(selected)
    setTimeout(() => {
      setMinOrMax(MinOrMax.NULL)
    }, 2000)
  }

  const handleFromAssetPress = useCallback(() => {
    navigation.push('AssetChooserScreen', {
      screenTitle: labelTranslateFn('swapScreen.selectAssetForSwap')!,
      swapAssetPair: { ...swapPair, fromAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }, [navigation, swapPair])

  const handleToAssetPress = useCallback(() => {
    navigation.push('AssetChooserScreen', {
      screenTitle: labelTranslateFn('swapScreen.selectAssetForSwap')!,
      swapAssetPair: { ...swapPair, toAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }, [navigation, swapPair])

  const fromBackgroundColor: keyof ColorType =
    focusType === InputFocus.FROM ? 'lightInputActiveColor' : 'mediumWhite'

  const isMinActive = MinOrMax.MIN === minOrMax
  const isMaxActive = MinOrMax.MAX === minOrMax

  const currentBalance =
    (swapPair.fromAsset &&
      `${prettyBalance(
        new BigNumber(fromBalance),
        swapPair.fromAsset.code,
      )} ${labelTranslateFn('balance')}`) ||
    ''

  const fromCryptoToFiat =
    (
      swapPair.fromAsset &&
      cryptoToFiat(
        new BigNumber(state.fromAmount || 0),
        fiatRates?.[swapPair.fromAsset.code] || 0,
      )
    )?.toString() || ''

  const fromFiatToCrypto =
    (
      swapPair.fromAsset &&
      fiatToCrypto(
        new BigNumber(state.fromAmount || 0),
        fiatRates?.[swapPair.fromAsset.code] || 0,
      )
    )?.toString() || ''

  const toCryptoToFiat =
    (
      swapPair.toAsset &&
      cryptoToFiat(
        new BigNumber(state.toAmount || 0),
        fiatRates?.[swapPair.toAsset.code] || 0,
      )
    )?.toString() || ''

  const toFiatToCrypto =
    (
      swapPair.toAsset &&
      fiatToCrypto(
        new BigNumber(state.toAmount || 0),
        fiatRates?.[swapPair.toAsset.code] || 0,
      )
    )?.toString() || ''

  const fromFormatedFiat =
    formatFiat(BigNumber(fromCryptoToFiat)).toString() || ''

  const toFormatedFiat = formatFiat(BigNumber(toCryptoToFiat)).toString() || ''

  const handleFromWavyArrowPress = () => {
    setIsFromAmountNative((prev) => {
      if (prev) {
        dispatch({
          type: SwapEventActionKind.FromAmountUpdated,
          payload: { fromAmount: dpUI(Number(fromCryptoToFiat), 6).toString() },
        })
      } else {
        dispatch({
          type: SwapEventActionKind.FromAmountUpdated,
          payload: { fromAmount: dpUI(Number(fromFiatToCrypto), 6).toString() },
        })
      }
      return !prev
    })
  }

  const handleToWavyArrowPress = () => {
    setIsToAmountNative((prev) => {
      if (prev) {
        dispatch({
          type: SwapEventActionKind.ToAmountUpdated,
          payload: { toAmount: dpUI(Number(toCryptoToFiat), 6).toString() },
        })
      } else {
        dispatch({
          type: SwapEventActionKind.ToAmountUpdated,
          payload: { toAmount: dpUI(Number(toFiatToCrypto), 6).toString() },
        })
      }
      return !prev
    })
  }

  const handleReviewBtnPress = async () => {
    const assetsAreSameChain =
      getNativeAsset(swapPair.fromAsset?.code || '') ===
      getNativeAsset(swapPair.toAsset?.code || '')

    if (
      !swapPair.fromAsset ||
      !swapPair.toAsset ||
      !state.fromAmount ||
      !selectedQuote ||
      !fromNetworkFee.current ||
      !toNetworkFee.current
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
        fromAmount: Number(state.fromAmount) || 0,
        toAmount: Number(state.toAmount) || 0,
        quote: selectedQuote,
        fromNetworkFee: fromNetworkFee.current,
        toNetworkFee: toNetworkFee.current,
      },
      assetsAreSameChain,
      screenTitle: I18n.t('swapScreen.swapReview', {
        swapPairfromAssetCode: swapPair.fromAsset.code,
        swapPairtoAssetCode: swapPair.toAsset.code,
      }),
    })
  }
  const onSwapArrowPress = () => {
    setSwapPair({ fromAsset: swapPair.toAsset, toAsset: swapPair.fromAsset })
  }

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

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <Box flex={1}>
        <Box flex={0.75}>
          <ScrollView
            style={FLEX_1}
            scrollEnabled={!!error.msg}
            showsVerticalScrollIndicator={false}>
            {error.msg ? (
              <Box paddingVertical={'xl'}>{getCompatibleErrorMsg()}</Box>
            ) : null}
            <Box height={scale(355)} width="100%">
              <Box
                height={scale(175)}
                width={'100%'}
                backgroundColor={fromBackgroundColor}
                padding={'xl'}>
                <Box flexDirection={'row'} marginTop="m">
                  {swapPair.fromAsset ? (
                    <Text variant={'subListBoldText'} color="darkGrey">
                      {swapPair?.fromAsset.code || ''}
                    </Text>
                  ) : null}
                  <Text marginLeft={'s'} variant="subListText" color="darkGrey">
                    {currentBalance}
                  </Text>
                </Box>
                <Box
                  flexDirection={'row'}
                  marginTop={'s'}
                  justifyContent="space-between"
                  height={scale(36)}
                  width={'100%'}>
                  <Box flex={0.8}>
                    <TextInput
                      cursorColor={faceliftPalette.active}
                      variant={'swapInput'}
                      placeholder="0.00"
                      onChangeText={handleTextChange}
                      onFocus={fromFocused}
                      onBlur={onBlur}
                      maxLength={15}
                      value={state.fromAmount}
                      keyboardType="numeric"
                    />
                  </Box>
                  <TouchableWithoutFeedback onPress={handleFromAssetPress}>
                    <Box
                      justifyContent="space-between"
                      flexDirection="row"
                      zIndex={100}
                      alignItems={'center'}>
                      <AssetIcon
                        asset={swapPair.fromAsset?.code}
                        chain={swapPair.fromAsset?.chain}
                      />
                      <ChevronRightIcon width={scale(15)} height={scale(15)} />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
                <Box flexDirection={'row'} alignItems="center">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleFromWavyArrowPress}>
                    <WavyArrow />
                  </TouchableOpacity>
                  <Text
                    variant={'h7'}
                    color="darkGrey"
                    lineHeight={scale(30)}
                    paddingLeft="s"
                    paddingTop="s">
                    {isFromAmountNative
                      ? `$${fromFormatedFiat}`
                      : `${swapPair.fromAsset?.code} ${fromFiatToCrypto}`}
                  </Text>
                </Box>
                <Box flexDirection={'row'} alignItems="center" marginTop={'m'}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      getMinValue()
                      onMinOrMaxFnPress(MinOrMax.MIN)
                    }}>
                    <Box
                      borderBottomColor={
                        isMinActive ? 'defaultButton' : 'transparent'
                      }
                      borderBottomWidth={1}>
                      <Text
                        variant={'transLink'}
                        color={isMinActive ? 'defaultButton' : 'greyMeta'}
                        tx="common.min"
                      />
                    </Box>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      getMaxValue()
                      onMinOrMaxFnPress(MinOrMax.MAX)
                    }}>
                    <Box
                      borderBottomColor={
                        isMaxActive ? 'defaultButton' : 'transparent'
                      }
                      borderBottomWidth={1}
                      marginLeft="l">
                      <Text
                        variant={'transLink'}
                        color={isMaxActive ? 'defaultButton' : 'greyMeta'}
                        tx="common.max"
                      />
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box height={scale(5)} width={'100%'} />
              <Box
                height={scale(175)}
                width={'100%'}
                backgroundColor={'mediumWhite'}
                padding={'xl'}>
                <Box flexDirection={'row'} marginTop="m">
                  <Text variant={'subListBoldText'} color="darkGrey">
                    {swapPair?.toAsset?.code || ''}
                  </Text>
                </Box>
                <Box
                  flexDirection={'row'}
                  marginTop={'s'}
                  justifyContent="space-between"
                  height={scale(36)}
                  width={'100%'}>
                  <Box flex={0.8}>
                    <TextInput
                      cursorColor={faceliftPalette.active}
                      variant={'swapInput'}
                      placeholder="0.00"
                      editable={false}
                      onFocus={fromFocused}
                      onBlur={onBlur}
                      value={state.toAmount}
                      maxLength={15}
                    />
                  </Box>
                  <TouchableWithoutFeedback onPress={handleToAssetPress}>
                    <Box
                      justifyContent="space-between"
                      flexDirection="row"
                      alignItems={'center'}>
                      <AssetIcon
                        asset={swapPair.toAsset?.code}
                        chain={swapPair.toAsset?.chain}
                      />
                      <ChevronRightIcon width={scale(15)} height={scale(15)} />
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
                <Box flexDirection={'row'} alignItems="center">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleToWavyArrowPress}>
                    <WavyArrow />
                  </TouchableOpacity>
                  <Text
                    variant={'h7'}
                    color="darkGrey"
                    lineHeight={scale(30)}
                    paddingLeft="s"
                    paddingTop="s">
                    {isToAmountNative
                      ? `$${toFormatedFiat}`
                      : `${swapPair.toAsset?.code} ${toFiatToCrypto}`}
                  </Text>
                </Box>
              </Box>
              <Box position={'absolute'} height="100%" right={0} zIndex={0}>
                <Box
                  position={'relative'}
                  flex={1}
                  justifyContent="center"
                  alignItems={'flex-end'}>
                  <Box style={styles.arrowLeft} />
                  <Box position={'absolute'} right={-scale(5)}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={onSwapArrowPress}>
                      <ThinDownArrowActive />
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            </Box>
            {swapPair.fromAsset?.code &&
            swapPair.toAsset?.code &&
            selectedQuote ? (
              <Box
                flexDirection={'row'}
                marginTop="m"
                alignItems="center"
                justifyContent={'center'}>
                <Text
                  lineHeight={scale(30)}
                  marginRight="s"
                  color={'darkGrey'}
                  variant={'addressLabel'}>
                  {swapPair.fromAsset?.code} ={' '}
                  {dpUI(calculateQuoteRate(selectedQuote)).toString()}{' '}
                  {swapPair.toAsset?.code}
                </Text>
                <ThinDoubleArrowActive />
              </Box>
            ) : null}
            {quotes.length ? (
              <Text
                textAlign={'center'}
                color={'defaultButton'}
                onPress={onQuotesPress}
                marginTop="m"
                variant={'addressLabel'}>
                {quotes.length} {labelTranslateFn('quotes')}
              </Text>
            ) : null}
            <Box
              flexDirection={'row'}
              marginTop="xxl"
              alignItems="center"
              justifyContent={'center'}>
              <Text
                lineHeight={scale(30)}
                marginRight="s"
                color={'defaultButton'}
                variant={'addressLabel'}
                tx="common.networkSpeed"
                onPress={() => setShowFeeEditorModal(true)}
              />
              <NetworkSpeedEdit />
            </Box>
          </ScrollView>
        </Box>
        <Box flex={0.25}>
          <Box marginVertical={'xl'}>
            <Pressable
              label={{ tx: 'common.next' }}
              onPress={handleReviewBtnPress}
              variant="solid"
              disabled={!!error.msg}
              customView={
                <Box
                  flexDirection={'row'}
                  alignItems="center"
                  justifyContent={'center'}>
                  {error.msg ? (
                    <DoubleArrowThickDisabled />
                  ) : (
                    <DoubleArrowThick />
                  )}
                  <Text
                    marginLeft="m"
                    color={error.msg ? 'inactiveText' : 'white'}
                    variant={'h6'}
                    lineHeight={scale(30)}
                    tx="common.review"
                  />
                </Box>
              }
            />
          </Box>
          <Text
            onPress={navigation.goBack}
            textAlign={'center'}
            variant="link"
            tx="termsScreen.cancel"
          />
        </Box>
      </Box>
      {showFeeEditorModal && swapPair.fromAsset && (
        <FeeEditorScreen
          onClose={setShowFeeEditorModal}
          selectedAsset={swapPair.fromAsset?.code}
          amount={new BigNumber(fromBalance)}
          applyFee={() => {
            setShowFeeEditorModal(false)
          }}
        />
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  arrowLeft: {
    borderTopWidth: scale(40),
    borderRightWidth: scale(40),
    borderBottomWidth: scale(40),
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: faceliftPalette.lightBackground,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
})

export default SwapScreen
