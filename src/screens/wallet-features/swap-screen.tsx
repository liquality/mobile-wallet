import React, { FC, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import MessageBanner from '../../components/ui/message-banner'
import AmountTextInputBlock from '../../components/ui/amount-text-input-block'
import { ChainId } from '@liquality/cryptoassets/src/types'
import LiqualityButton from '../../components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown } from '@fortawesome/pro-regular-svg-icons'
import {
  faAngleDown,
  faAngleRight,
  faClock,
} from '@fortawesome/pro-light-svg-icons'
import GasController from '../../components/ui/gas-controller'
import Label from '../../components/ui/label'
import Warning from '../../components/ui/warning'
import SwapRates from '../../components/swap-rates'

const SwapScreen: FC = () => {
  const [areGasControllersVisible, setGasControllersVisible] = useState(false)

  const toggleGasControllers = () => {
    setGasControllersVisible(!areGasControllersVisible)
  }

  return (
    <SafeAreaView style={styles.container}>
      <MessageBanner
        text1="No liquidity."
        text2="Request liquidity for tokens via"
        onAction={() => ({})}
      />
      <AmountTextInputBlock
        label="SEND"
        chain={ChainId.Bitcoin}
        assetSymbol="BTC"
        setAmountInFiat={() => ({})}
        setAmountInNative={() => ({})}
      />
      <View style={[styles.box, styles.row]}>
        <View style={styles.wrapper}>
          <LiqualityButton
            text="Min"
            variant="small"
            type="plain"
            action={() => ({})}
          />
          <LiqualityButton
            text="Max"
            variant="small"
            type="plain"
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
      <AmountTextInputBlock
        label="RECEIVE"
        chain={ChainId.Ethereum}
        assetSymbol="ETH"
        setAmountInFiat={() => ({})}
        setAmountInNative={() => ({})}
      />
      <SwapRates />
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
            action={() => ({})}
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
