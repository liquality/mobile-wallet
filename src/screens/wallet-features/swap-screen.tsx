import React, { FC, useEffect, useState } from 'react'
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { MarketDataType } from '@liquality/core/dist/types'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown } from '@fortawesome/pro-regular-svg-icons'
import { StackScreenProps } from '@react-navigation/stack'
import {
  faAngleDown,
  faAngleRight,
  faChevronRight,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import MessageBanner from '../../components/ui/message-banner'
import AmountTextInputBlock from '../../components/ui/amount-text-input-block'
import LiqualityButton from '../../components/ui/button'
import GasController from '../../components/ui/gas-controller'
import Label from '../../components/ui/label'
import Warning from '../../components/ui/warning'
import SwapRates from '../../components/swap-rates'
import { initSwaps } from '../../store/store'
import {
  ActionEnum,
  AssetDataElementType,
  RootStackParamList,
} from '../../types'

type SwapScreenProps = StackScreenProps<RootStackParamList, 'SwapScreen'>

const SwapScreen: FC<SwapScreenProps> = (props) => {
  const { navigation, route } = props
  const [fetchingAsset, setFetchingAsset] = useState<'TO' | 'FROM'>('TO')
  const [areGasControllersVisible, setGasControllersVisible] = useState(false)
  const [fromAsset, setFromAsset] = useState<AssetDataElementType>()
  const [toAsset, setToAsset] = useState<AssetDataElementType>()
  const [, setSelectedQuote] = useState<MarketDataType>()

  const toggleGasControllers = () => {
    setGasControllersVisible(!areGasControllersVisible)
  }

  const handleFromAssetPress = () => {
    setFetchingAsset('FROM')
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      action: ActionEnum.SWAP,
    })
  }

  const handleToAssetPress = () => {
    setFetchingAsset('TO')
    navigation.navigate('AssetChooserScreen', {
      screenTitle: 'Select asset for Swap',
      action: ActionEnum.SWAP,
    })
  }

  const handleSelectQuote = (quote: MarketDataType) => {
    setSelectedQuote(quote)
  }

  useEffect(() => {
    initSwaps()
    const asset = route.params.assetData
    if (asset) {
      if (fetchingAsset === 'TO') {
        setToAsset(asset)
      } else if (fetchingAsset === 'FROM') {
        setFromAsset(asset)
      }
    }
  }, [fetchingAsset, route.params.assetData])

  return (
    <SafeAreaView style={styles.container}>
      <MessageBanner
        text1="No liquidity."
        text2="Request liquidity for tokens via"
        onAction={() => ({})}
      />
      <View style={styles.assetBlock}>
        <AmountTextInputBlock
          label="SEND"
          chain={fromAsset?.chain || ChainId.Bitcoin}
          assetSymbol={fromAsset?.code || 'BTC'}
          setAmountInFiat={() => ({})}
          setAmountInNative={() => ({})}
        />
        <Pressable style={styles.chevronBtn} onPress={handleFromAssetPress}>
          <FontAwesomeIcon icon={faChevronRight} size={15} color="#A8AEB7" />
        </Pressable>
      </View>
      <View style={[styles.box, styles.row]}>
        <View style={styles.wrapper}>
          <LiqualityButton
            text="Min"
            variant="small"
            type="plain"
            contentType="numeric"
            action={() => ({})}
          />
          <LiqualityButton
            text="Max"
            variant="small"
            type="plain"
            contentType="numeric"
            action={() => ({})}
          />
        </View>
        <View style={styles.wrapper}>
          <Label text="Available" variant="light" />
          <Text style={[styles.font, styles.amount]}>3.123456 BTC</Text>
        </View>
      </View>
      <View style={styles.box}>
        <FontAwesomeIcon icon={faArrowDown} color="#A8AEB7" />
      </View>
      <View style={styles.assetBlock}>
        <AmountTextInputBlock
          label="RECEIVE"
          chain={toAsset?.chain || ChainId.Ethereum}
          assetSymbol={toAsset?.code || 'ETH'}
          setAmountInFiat={() => ({})}
          setAmountInNative={() => ({})}
        />
        <Pressable style={styles.chevronBtn} onPress={handleToAssetPress}>
          <FontAwesomeIcon icon={faChevronRight} color="#A8AEB7" />
        </Pressable>
      </View>

      <SwapRates
        fromAsset={fromAsset?.code || 'BTC'}
        toAsset={toAsset?.code || 'ETH'}
        selectQuote={handleSelectQuote}
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
          <Label text="BTC avg / ETH avg" variant="light" />
        </Pressable>
      </View>
      {areGasControllersVisible && (
        <>
          <GasController assetSymbol="BTC" handleCustomPress={() => ({})} />
          <GasController assetSymbol="ETH" handleCustomPress={() => ({})} />
          <Warning
            text1="Max slippage is 0.5%."
            text2="If the swap doesn’t complete within 3 hours, you will be refunded in 6
          hours at 20:45 GMT"
            icon={faClock}
          />
        </>
      )}
      <View style={styles.footer}>
        <View style={[styles.buttonWrapper]}>
          <LiqualityButton
            text="Cancel"
            variant="medium"
            type="negative"
            action={() => navigation.navigate('OverviewScreen')}
          />
          <LiqualityButton
            text="Review"
            variant="medium"
            type="positive"
            action={() => ({})}
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
