import React, {
  FC,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { ActionEnum, MainStackParamList } from '../../../types'
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
  // walletState,
} from '../../../atoms'
import { useRecoilState, useRecoilValue } from 'recoil'
// import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { SwapQuote } from '@liquality/wallet-core/dist/src/swaps/types'
import { BigNumber } from '@liquality/types'
import AssetIcon from '../../../components/asset-icon'
import { labelTranslateFn, sortQuotes } from '../../../utils'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import {
  cryptoToFiat,
  fiatToCrypto,
  formatFiat,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { getQuotes } from '../../../store/store'
import { dpUI } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { calculateQuoteRate } from '@liquality/wallet-core/dist/src/utils/quotes'
import { getSwapProvider } from '@liquality/wallet-core/dist/src/factory/swap'
import { SwapProviderType } from '@liquality/wallet-core/dist/src/store/types'
import { getAsset, unitToCurrency } from '@liquality/cryptoassets'

const {
  WavyArrow,
  ChevronRightIcon,
  ThinDownArrowActive,
  ThinDoubleArrowActive,
  NetworkSpeedEdit,
  DoubleArrowThick,
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

// enum ErrorMessaging {
//   EnableToken,
//   PairsList,
//   MultipleSwaps,
//   NotEngRequestTkn,
//   NotEngLiq,
//   MoreTknReq,
// }

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
  | {
      type: SwapEventActionKind.SetFromAmtFrmMinVal
      payload: { minimumValue: string }
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
    case SwapEventActionKind.SetFromAmtFrmMinVal:
      return {
        ...state,
        fromAmount: payload.minimumValue,
        maximumValue: '',
      }
    default:
      throw new Error()
  }
}

// interface ErrorMsgAndType {
//   msg: string
//   type: ErrorMessaging | null
// }

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { navigation } = props
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const fromBalance = useRecoilValue(
    balanceStateFamily({
      asset: swapPair.fromAsset?.code || '',
      assetId: swapPair.fromAsset?.id || '',
    }),
  )
  const activeNetwork = useRecoilValue(networkState)
  // const [error, setError] = useState<ErrorMsgAndType>({ msg: '', type: null })
  const [quotes, setQuotes] = useState<any[]>([])
  const [focusType, setFocusType] = React.useState(InputFocus.NULL)
  const [minOrMax, setMinOrMax] = React.useState(MinOrMax.NULL)
  // const [gas, setGasFee] = useState('0')
  // const wallet = useRecoilValue(walletState)
  // const { activeWalletId } = wallet
  const [state, dispatch] = useReducer(reducer, initialSwapSEventState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const [selectedQuote, setSelectedQuote] = useState<SwapQuote>()
  const [isFromAmountNative, setIsFromAmountNative] = useState(true)
  const [isToAmountNative, setIsToAmountNative] = useState(true)

  // const assetsAreSameChain =
  //   getNativeAsset(swapPair.fromAsset?.code || '') ===
  //   getNativeAsset(swapPair.toAsset?.code || '')

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
      dispatch({
        type: SwapEventActionKind.ToAmountUpdated,
        payload: {
          toAmount: calculatedAmount,
        },
      })
    }
  }, [
    activeNetwork,
    state.fromAmount,
    swapPair.toAsset?.code,
    selectedQuote,
    isFromAmountNative,
    swapPair.fromAsset,
    fiatRates,
  ])

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

            dispatch({
              type: SwapEventActionKind.SetMinVal,
              payload: {
                minimumValue: minValue.toString(),
              },
            })

            setSelectedQuote(sortedQuotes[0])
            setQuotes(sortedQuotes)
          }
        } catch (error) {
          // handle error here
        }
      }
    }
    getQuoteList()
  }, [activeNetwork, swapPair.fromAsset?.code, swapPair.toAsset?.code])

  const getMinValue = () => {
    dispatch({
      type: SwapEventActionKind.FromAmountUpdated,
      payload: { fromAmount: state.minimumValue },
    })
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
          payload: { fromAmount: fromCryptoToFiat },
        })
      } else {
        dispatch({
          type: SwapEventActionKind.FromAmountUpdated,
          payload: { fromAmount: fromFiatToCrypto },
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
          payload: { toAmount: toCryptoToFiat },
        })
      } else {
        dispatch({
          type: SwapEventActionKind.ToAmountUpdated,
          payload: { toAmount: toFiatToCrypto },
        })
      }
      return !prev
    })
  }

  const onSwapArrowPress = () => {
    setSwapPair({ fromAsset: swapPair.toAsset, toAsset: swapPair.fromAsset })
  }

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <Box flex={1}>
        <Box flex={0.75}>
          <ScrollView style={FLEX_1}>
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
                      cursorColor={faceliftPalette.buttonDefault}
                      variant={'swapInput'}
                      placeholder="0.00"
                      onChangeText={handleTextChange}
                      onFocus={fromFocused}
                      onBlur={onBlur}
                      maxLength={15}
                      value={state.fromAmount}
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
                      cursorColor={faceliftPalette.buttonDefault}
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
                marginTop="m"
                variant={'addressLabel'}>
                {quotes.length} Quotes
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
              />
              <NetworkSpeedEdit />
            </Box>
          </ScrollView>
        </Box>
        <Box flex={0.25}>
          <Box marginVertical={'xl'}>
            <Pressable
              label={{ tx: 'common.next' }}
              onPress={() => {}}
              variant="solid"
              customView={
                <Box
                  flexDirection={'row'}
                  alignItems="center"
                  justifyContent={'center'}>
                  <DoubleArrowThick />
                  <Text
                    marginLeft="m"
                    color={'white'}
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
