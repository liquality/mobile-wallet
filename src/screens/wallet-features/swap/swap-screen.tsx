import React, {
  FC,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { Alert, Dimensions, Pressable, StyleSheet, Text } from 'react-native'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ChevronRight from '../../../assets/icons/activity-status/chevron-right.svg'
import AngleDown from '../../../assets/icons/angle-down.svg'
import AngleRight from '../../../assets/icons/angle-right.svg'
import ArrowDown from '../../../assets/icons/arrow-down.svg'
import Clock from '../../../assets/icons/clock.svg'
import MessageBanner from '../../../components/ui/message-banner'
import AmountTextInputBlock from '../../../components/ui/amount-text-input-block'
import Label from '../../../components/ui/label'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap/swap-rates'
import { getQuotes, updateMarketData } from '../../../store/store'
import { ActionEnum, NetworkFeeType, RootStackParamList } from '../../../types'
import { BigNumber } from '@liquality/types'
import { assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets'
import { sortQuotes } from '../../../utils'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'
import Button from '../../../theme/button'
import Box from '../../../theme/box'
import SwapFeeSelector from '../../../components/ui/swap-fee-selector'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import { prettyBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'
import { FeeLabel } from '@liquality/wallet-core/dist/store/types'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  balanceStateFamily,
  marketDataState,
  swapPairState,
} from '../../../atoms'

export type SwapEventType = {
  fromAmount?: BigNumber
  toAmount?: BigNumber
}

export const reducer: Reducer<SwapEventType, PayloadAction<SwapEventType>> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'FROM_AMOUNT_UPDATED':
      return {
        ...state,
        fromAmount: action.payload.fromAmount,
      }
    case 'TO_AMOUNT_UPDATED':
      return {
        ...state,
        toAmount: action.payload.toAmount,
      }
    default:
      throw new Error()
  }
}

type SwapScreenProps = NativeStackScreenProps<RootStackParamList, 'SwapScreen'>

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { navigation } = props
  const marketData = useRecoilValue(marketDataState)
  const [swapPair, setSwapPair] = useRecoilState(swapPairState)
  const fromBalance = useRecoilValue(
    balanceStateFamily(swapPair.fromAsset?.code),
  )
  const [areFeeSelectorsVisible, setFeeSelectorsVisible] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<SwapQuote>()
  const [error, setError] = useState('')
  const fromNetworkFee = useRef<NetworkFeeType>()
  const toNetworkFee = useRef<NetworkFeeType>()
  const [maximumValue, setMaximumValue] = useState<BigNumber>(new BigNumber(0))
  const [minimumValue, setMinimumValue] = useState<BigNumber>(new BigNumber(0))
  const [bestQuote, setBestQuote] = useState<BigNumber>(new BigNumber(0))
  const [quotes, setQuotes] = useState<any[]>([])
  const [fromNetworkSpeed, setFromNetworkSpeed] = useState<FeeLabel>(
    FeeLabel.Average,
  )
  const [toNetworkSpeed, setToNetworkSpeed] = useState<FeeLabel>(
    FeeLabel.Average,
  )
  const [state, dispatch] = useReducer(reducer, {})

  const toggleFeeSelectors = () => {
    setFeeSelectorsVisible(!areFeeSelectorsVisible)
  }

  const handleFromAssetPress = () => {
    setSwapPair((prevVal) => ({ ...prevVal, fromAsset: undefined }))
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      swapAssetPair: { ...swapPair, fromAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }

  const handleToAssetPress = () => {
    setSwapPair((prevVal) => ({ ...prevVal, toAsset: undefined }))
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      swapAssetPair: { ...swapPair, toAsset: undefined },
      action: ActionEnum.SWAP,
    })
  }

  const handleSelectQuote = (quote: SwapQuote) => {
    setSelectedQuote(quote)
  }

  const handleCancelPress = useCallback(() => {
    navigation.navigate('OverviewScreen')
  }, [navigation])

  const handleReviewBtnPress = async () => {
    if (
      !swapPair.fromAsset ||
      !swapPair.toAsset ||
      !state.fromAmount ||
      !selectedQuote ||
      !fromNetworkFee.current ||
      !toNetworkFee.current
    ) {
      Alert.alert('Invalid arguments for swap')
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
        toAmount: bestQuote.toNumber(),
        quote: selectedQuote,
        fromNetworkFee: fromNetworkFee.current,
        toNetworkFee: toNetworkFee.current,
      },
      screenTitle: `Swap ${swapPair.fromAsset.code} to ${swapPair.toAsset.code} review`,
    })
  }

  const min = useCallback((): BigNumber => {
    //TODO why do we have to check against the liquality type
    const liqualityMarket = marketData?.find(
      (pair) =>
        pair.from === swapPair.fromAsset?.code &&
        pair.to === swapPair.toAsset?.code,
    )
    return liqualityMarket && liqualityMarket.min
      ? new BigNumber(liqualityMarket.min)
      : new BigNumber(0)
  }, [swapPair.fromAsset?.code, marketData, swapPair.toAsset?.code])

  const handleMinPress = () => {
    setMaximumValue(new BigNumber(0))
    setMinimumValue(min())
  }

  const handleMaxPress = () => {
    if (swapPair && swapPair.fromAsset && swapPair.fromAsset.code) {
      const amnt = unitToCurrency(
        cryptoassets[swapPair.fromAsset.code],
        fromBalance || 0,
      )
      setMaximumValue(new BigNumber(amnt))
    }
  }

  const updateBestQuote = useCallback(
    async (amount: BigNumber) => {
      let bestQuoteAmount = new BigNumber(0)
      if (swapPair.fromAsset?.code && swapPair.toAsset?.code) {
        const quoteList = await getQuotes(
          swapPair.fromAsset.code,
          swapPair.toAsset.code,
          amount,
        )

        if (quoteList.length === 0) {
          setError(
            "This pair isn't traded yet. See our list of compatible pairs here. You can also suggest list of your token on Liquality Discord",
          )
        } else {
          const sortedQuotes = sortQuotes(quoteList)
          setQuotes(sortedQuotes)
          if (sortedQuotes.length) {
            setSelectedQuote(sortedQuotes[0])
            bestQuoteAmount = new BigNumber(
              unitToCurrency(
                cryptoassets[swapPair.toAsset.code],
                new BigNumber(sortedQuotes[0].toAmount || 0),
              ),
            )
          }
        }
      }

      if (bestQuoteAmount.eq(0)) {
        setError('Quotes not found')
      }
      setBestQuote(bestQuoteAmount)
    },
    [swapPair.fromAsset?.code, swapPair.toAsset?.code],
  )

  useEffect(() => {
    updateMarketData()
  }, [])

  useEffect(() => {
    const minimum = min()
    setMinimumValue(minimum)
  }, [swapPair, min])

  useEffect(() => {
    setError('')
    const minimum = min()
    updateBestQuote(state.fromAmount?.gt(0) ? state.fromAmount : minimum)
  }, [min, state.fromAmount, updateBestQuote])

  return (
    <Box
      flex={1}
      width={Dimensions.get('window').width}
      backgroundColor="mainBackground">
      {error ? (
        <MessageBanner text1="Error" text2={error} onAction={() => ({})} />
      ) : null}
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
        marginHorizontal="xl">
        <AmountTextInputBlock
          type="FROM"
          label="SEND"
          chain={swapPair.fromAsset?.chain || ChainId.Bitcoin}
          assetSymbol={swapPair.fromAsset?.code || 'BTC'}
          maximumValue={maximumValue}
          minimumValue={minimumValue}
          dispatch={dispatch}
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
            label="Min"
            onPress={handleMinPress}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="tertiary"
            variant="s"
            label="Max"
            onPress={handleMaxPress}
            isBorderless={false}
            isActive={true}
          />
        </Box>
        <Box flexDirection="row">
          <Label text="Available" variant="light" />
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
      </Box>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
        marginHorizontal="xl">
        <AmountTextInputBlock
          type="TO"
          label="RECEIVE"
          chain={swapPair.toAsset?.chain || ChainId.Ethereum}
          assetSymbol={swapPair.toAsset?.code || 'ETH'}
          minimumValue={bestQuote}
        />
        <Pressable style={styles.chevronBtn} onPress={handleToAssetPress}>
          <ChevronRight width={15} height={15} />
        </Pressable>
      </Box>

      {swapPair.fromAsset?.code && swapPair.toAsset?.code ? (
        <SwapRates
          fromAsset={swapPair.fromAsset.code}
          toAsset={swapPair.toAsset.code}
          quotes={quotes}
          selectQuote={handleSelectQuote}
          selectedQuote={selectedQuote}
          clickable
          style={{ paddingHorizontal: 20 }}
        />
      ) : null}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginVertical="m"
        paddingHorizontal="xl">
        <Pressable onPress={toggleFeeSelectors} style={styles.feeOptionsButton}>
          {areFeeSelectorsVisible ? (
            <AngleDown style={styles.dropdown} />
          ) : (
            <AngleRight style={styles.dropdown} />
          )}
          <Label text="NETWORK SPEED/FEE" variant="strong" />
          {swapPair.fromAsset?.code && swapPair.toAsset?.code ? (
            <Label
              text={`${swapPair.fromAsset?.code} ${fromNetworkSpeed} / ${swapPair.toAsset?.code} ${toNetworkSpeed}`}
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
          {swapPair.fromAsset?.code ? (
            <SwapFeeSelector
              asset={swapPair.fromAsset?.code}
              handleCustomPress={() => ({})}
              networkFee={fromNetworkFee}
              selectedQuote={selectedQuote}
              type={'from'}
              changeNetworkSpeed={setFromNetworkSpeed}
            />
          ) : null}
          {swapPair.toAsset?.code ? (
            <SwapFeeSelector
              asset={swapPair.toAsset?.code}
              handleCustomPress={() => ({})}
              networkFee={toNetworkFee}
              selectedQuote={selectedQuote}
              type={'to'}
              changeNetworkSpeed={setToNetworkSpeed}
            />
          ) : null}
          <Warning
            text1="Max slippage is 0.5%."
            text2={`If the swap doesn’t complete within 3 hours, you will be refunded in 6 hours at ${new Date(
              new Date().getTime() + 3 * 60 * 60 * 1000,
            ).toTimeString()}`}>
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
            label="Cancel"
            onPress={handleCancelPress}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label="Review"
            onPress={handleReviewBtnPress}
            isBorderless={false}
            isActive={true}
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
  },
  amount: {
    color: '#000D35',
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
})

export default SwapScreen
