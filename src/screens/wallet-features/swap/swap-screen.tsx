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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  faAngleDown,
  faAngleRight,
  faArrowDown,
  faChevronRight,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import MessageBanner from '../../../components/ui/message-banner'
import AmountTextInputBlock from '../../../components/ui/amount-text-input-block'
import Label from '../../../components/ui/label'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap/swap-rates'
import { getQuotes, updateMarketData } from '../../../store/store'
import {
  ActionEnum,
  AssetDataElementType,
  NetworkFeeType,
  RootStackParamList,
} from '../../../types'
import { BigNumber } from '@liquality/types'
import { assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets'
import { useAppSelector } from '../../../hooks'
import { sortQuotes } from '../../../utils'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'
import Button from '../../../theme/button'
import Box from '../../../theme/box'
import SwapFeeSelector from '../../../components/ui/swap-fee-selector'
import { SwapQuote } from '@liquality/wallet-core/dist/swaps/types'
import { prettyBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'
import { FeeLabel } from '@liquality/wallet-core/dist/store/types'

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
  const { navigation, route } = props
  const { swapAssetPair } = route.params
  const { marketData = {}, activeNetwork } = useAppSelector((state) => ({
    marketData: state.marketData,
    activeNetwork: state.activeNetwork,
  }))
  const [areFeeSelectorsVisible, setFeeSelectorsVisible] = useState(true)
  const [fromAsset, setFromAsset] = useState<AssetDataElementType | undefined>(
    swapAssetPair?.fromAsset,
  )
  const [toAsset, setToAsset] = useState<AssetDataElementType>()
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
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      swapAssetPair: {
        toAsset,
      },
      action: ActionEnum.SWAP,
    })
  }

  const handleToAssetPress = () => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      swapAssetPair: {
        fromAsset,
      },
      action: ActionEnum.SWAP,
    })
  }

  const handleSelectQuote = (quote: SwapQuote) => {
    setSelectedQuote(quote)
  }

  const handleReviewBtnPress = async () => {
    if (
      !fromAsset ||
      !toAsset ||
      !state.fromAmount ||
      !selectedQuote ||
      !fromNetworkFee.current ||
      !toNetworkFee.current
    ) {
      Alert.alert('Invalid arguments for swap')
      return
    }

    navigation.navigate('SwapReviewScreen', {
      swapTransaction: {
        fromAsset,
        toAsset,
        fromAmount: state.fromAmount.toNumber(),
        toAmount: bestQuote.toNumber(),
        quote: selectedQuote,
        fromNetworkFee: fromNetworkFee.current,
        toNetworkFee: toNetworkFee.current,
      },
      screenTitle: `Swap ${fromAsset.code} to ${toAsset.code} review`,
    })
  }

  const min = useCallback((): BigNumber => {
    //TODO why do we have to check against the liquality type
    const liqualityMarket = marketData?.[activeNetwork]?.find(
      (pair) => pair.from === fromAsset?.code && pair.to === toAsset?.code,
    )
    return liqualityMarket && liqualityMarket.min
      ? new BigNumber(liqualityMarket.min)
      : new BigNumber(0)
  }, [activeNetwork, fromAsset?.code, marketData, toAsset?.code])

  const handleMinPress = () => {
    setMaximumValue(new BigNumber(0))
    setMinimumValue(min())
  }

  const handleMaxPress = () => {
    if (
      swapAssetPair &&
      swapAssetPair.fromAsset &&
      swapAssetPair.fromAsset.code
    ) {
      const amnt = unitToCurrency(
        cryptoassets[swapAssetPair.fromAsset.code],
        swapAssetPair.fromAsset?.balance || 0,
      )
      setMaximumValue(new BigNumber(amnt))
    }
  }

  const updateBestQuote = useCallback(
    async (amount: BigNumber) => {
      let bestQuoteAmount = new BigNumber(0)
      if (fromAsset?.code && toAsset?.code) {
        const quoteList = await getQuotes(fromAsset.code, toAsset.code, amount)

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
                cryptoassets[toAsset.code],
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
    [fromAsset?.code, toAsset?.code],
  )

  useEffect(() => {
    updateMarketData()
  }, [])

  useEffect(() => {
    if (swapAssetPair) {
      setFromAsset(swapAssetPair.fromAsset)
      setToAsset(swapAssetPair.toAsset)
    }

    const minimum = min()
    setMinimumValue(minimum)
  }, [swapAssetPair, min])

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
          chain={fromAsset?.chain || ChainId.Bitcoin}
          assetSymbol={fromAsset?.code || 'BTC'}
          maximumValue={maximumValue}
          minimumValue={minimumValue}
          dispatch={dispatch}
        />
        <Pressable style={styles.chevronBtn} onPress={handleFromAssetPress}>
          <FontAwesomeIcon icon={faChevronRight} size={15} color="#A8AEB7" />
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
          {fromAsset?.balance && fromAsset?.code ? (
            <Text style={[styles.font, styles.amount]}>
              {fromAsset?.balance &&
                `${prettyBalance(
                  new BigNumber(fromAsset.balance),
                  fromAsset.code,
                )} ${fromAsset.code}`}
            </Text>
          ) : null}
        </Box>
      </Box>
      <Box alignItems="center" marginVertical="m" paddingHorizontal="xl">
        <FontAwesomeIcon icon={faArrowDown} color="#A8AEB7" />
      </Box>
      <Box
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-end"
        marginHorizontal="xl">
        <AmountTextInputBlock
          type="TO"
          label="RECEIVE"
          chain={toAsset?.chain || ChainId.Ethereum}
          assetSymbol={toAsset?.code || 'ETH'}
          minimumValue={bestQuote}
        />
        <Pressable style={styles.chevronBtn} onPress={handleToAssetPress}>
          <FontAwesomeIcon icon={faChevronRight} color="#A8AEB7" />
        </Pressable>
      </Box>

      {fromAsset?.code && toAsset?.code ? (
        <SwapRates
          fromAsset={fromAsset.code}
          toAsset={toAsset.code}
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
          <FontAwesomeIcon
            icon={areFeeSelectorsVisible ? faAngleDown : faAngleRight}
            size={15}
          />
          <Label text="NETWORK SPEED/FEE" variant="strong" />
          {fromAsset?.code && toAsset?.code ? (
            <Label
              text={`${fromAsset?.code} ${fromNetworkSpeed} / ${toAsset?.code} ${toNetworkSpeed}`}
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
          {fromAsset?.code ? (
            <SwapFeeSelector
              asset={fromAsset?.code}
              handleCustomPress={() => ({})}
              networkFee={fromNetworkFee}
              selectedQuote={selectedQuote}
              type={'from'}
              changeNetworkSpeed={setFromNetworkSpeed}
            />
          ) : null}
          {toAsset?.code ? (
            <SwapFeeSelector
              asset={toAsset?.code}
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
            ).toTimeString()}`}
            icon={faClock}
          />
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
            onPress={() => navigation.navigate('OverviewScreen')}
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
})

export default SwapScreen
