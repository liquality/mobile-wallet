import React, {
  FC,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
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
import GasController from '../../../components/ui/gas-controller'
import Label from '../../../components/ui/label'
import Warning from '../../../components/ui/warning'
import SwapRates from '../../../components/swap-rates'
import { initSwaps } from '../../../store/store'
import {
  ActionEnum,
  AssetDataElementType,
  RootStackParamList,
} from '../../../types'
import { BigNumber } from '@liquality/types'
import { assets as cryptoassets, unitToCurrency } from '@liquality/cryptoassets'
import { prettyBalance } from '../../../core/utils/coin-formatter'
import { useAppSelector } from '../../../hooks'
import { sortQuotes } from '../../../utils'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'
import Button from '../../../theme/button'

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
  const { marketData = [] } = useAppSelector((state) => ({
    marketData: state.marketData,
  }))
  const [areGasControllersVisible, setGasControllersVisible] = useState(true)
  const [fromAsset, setFromAsset] = useState<AssetDataElementType | undefined>(
    swapAssetPair?.fromAsset,
  )
  const [toAsset, setToAsset] = useState<AssetDataElementType>()
  const [selectedQuote, setSelectedQuote] = useState<any>()
  const [error, setError] = useState('')
  const fromNetworkFee = useRef<BigNumber>(new BigNumber(0))
  const toNetworkFee = useRef<BigNumber>(new BigNumber(0))
  const [maximumValue, setMaximumValue] = useState<BigNumber>(new BigNumber(0))
  const [minimumValue, setMinimumValue] = useState<BigNumber>(new BigNumber(0))
  const [bestQuote, setBestQuote] = useState<BigNumber>(new BigNumber(0))
  const [swapProviders, setSwapProviders] = useState<any[]>([])
  const [state, dispatch] = useReducer(reducer, {})

  const toggleGasControllers = () => {
    setGasControllersVisible(!areGasControllersVisible)
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

  const handleSelectQuote = (quote: any) => {
    setSelectedQuote(quote)
  }

  const handleReviewBtnPress = async () => {
    if (!fromAsset || !toAsset || !state.fromAmount || !selectedQuote) {
      throw new Error('Invalid arguments for swap')
    }

    navigation.navigate('SwapReviewScreen', {
      swapTransaction: {
        swapProviderType: selectedQuote.provider,
        fromAsset,
        toAsset,
        fromAmount: state.fromAmount,
        toAmount: bestQuote,
        toNetworkFee: toNetworkFee.current,
        fromNetworkFee: fromNetworkFee.current,
      },
      screenTitle: `Swap ${fromAsset.code} to ${toAsset.code}`,
    })
  }

  const min = useCallback((): BigNumber => {
    //TODO why do we have to check against the liquality type
    const liqualityMarket = marketData?.find(
      (pair) => pair.from === fromAsset?.code && pair.to === toAsset?.code,
      // && getSwapProviderConfig(this.activeNetwork, pair.provider).type ===
      //   SwapProviderType.LIQUALITY,
    )
    return liqualityMarket
      ? new BigNumber(liqualityMarket.min)
      : new BigNumber(0)
  }, [fromAsset?.code, marketData, toAsset?.code])

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
        const promises: Promise<any>[] = []
        for (const provider of swapProviders) {
          const quote = provider.getQuote(
            marketData.filter((md) =>
              selectedQuote ? md.provider === selectedQuote.provider : true,
            ),
            fromAsset?.code,
            toAsset?.code,
            amount,
          )
          if (quote) {
            promises.push(quote)
          }
        }

        if (promises.length === 0) {
          setError(
            "This pair isn't traded yet. See our list of compatible pairs here. You can also suggest list of your token on Liquality Discord",
          )
        } else {
          const responses = await Promise.all(promises)
          const sortedQuotes = sortQuotes(responses.filter((q) => !!q))
          if (sortedQuotes.length) {
            bestQuoteAmount = new BigNumber(
              unitToCurrency(
                cryptoassets[toAsset.code],
                sortedQuotes[0].toAmount?.toNumber() || 0,
              ),
            )
          }
        }
      }

      if (bestQuoteAmount.eq(0)) {
        setError(
          `Quotes not found: ${selectedQuote?.min} - ${selectedQuote?.max}`,
        )
      }
      setBestQuote(bestQuoteAmount)
    },
    [fromAsset, marketData, selectedQuote, swapProviders, toAsset],
  )

  useEffect(() => {
    setSwapProviders(Object.values(initSwaps()))
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
    <SafeAreaView style={styles.container}>
      {!!error && (
        <MessageBanner text1="Error" text2={error} onAction={() => ({})} />
      )}
      <View style={styles.assetBlock}>
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
      </View>
      <View style={[styles.box, styles.row]}>
        <View style={styles.wrapper}>
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
        </View>
        <View style={styles.wrapper}>
          <Label text="Available" variant="light" />
          <Text style={[styles.font, styles.amount]}>
            {fromAsset?.balance &&
              `${prettyBalance(
                new BigNumber(fromAsset?.balance),
                fromAsset?.code,
              )} ${fromAsset?.code}`}
          </Text>
        </View>
      </View>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faArrowDown} color="#A8AEB7" />
      </View>
      <View style={styles.assetBlock}>
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
      </View>

      <SwapRates
        fromAsset={fromAsset?.code || 'BTC'}
        toAsset={toAsset?.code || 'ETH'}
        selectQuote={handleSelectQuote}
        style={{ paddingHorizontal: 20 }}
      />
      <View style={[styles.row, styles.box]}>
        <Pressable
          onPress={toggleGasControllers}
          style={styles.feeOptionsButton}>
          <FontAwesomeIcon
            icon={areGasControllersVisible ? faAngleDown : faAngleRight}
            size={15}
          />
          <Label text="NETWORK SPEED/FEE" variant="strong" />
          <Label
            text={`${fromAsset?.code || 'BTC'} avg / ${
              toAsset?.code || 'ETH'
            } avg`}
            variant="light"
          />
        </Pressable>
      </View>
      {areGasControllersVisible && (
        <>
          <GasController
            assetSymbol={fromAsset?.code || 'BTC'}
            handleCustomPress={() => ({})}
            networkFee={fromNetworkFee}
          />
          <GasController
            assetSymbol={toAsset?.code || 'ETH'}
            handleCustomPress={() => ({})}
            networkFee={toNetworkFee}
          />
          <Warning
            text1="Max slippage is 0.5%."
            text2="If the swap doesn’t complete within 3 hours, you will be refunded in 6
          hours at 20:45 GMT"
            icon={faClock}
          />
        </>
      )}
      <View style={styles.footer}>
        <View style={styles.buttonWrapper}>
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
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('screen').width,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  box: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  assetBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 20,
  },
  wrapper: {
    flexDirection: 'row',
  },
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
  footer: {
    position: 'absolute',
    bottom: 20,
    width: Dimensions.get('screen').width,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

export default SwapScreen
