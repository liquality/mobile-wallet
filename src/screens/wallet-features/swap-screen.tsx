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
          <Text style={[styles.font, styles.label]}>Available</Text>
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
      <View style={[styles.box, styles.row]}>
        <Label text="RATE" />
        <LiqualityButton
          text="Liquality"
          variant="small"
          type="plain"
          action={() => ({})}
        />
      </View>
      <View style={[styles.row, styles.box]}>
        <Pressable
          onPress={toggleGasControllers}
          style={styles.feeOptionsButton}>
          <FontAwesomeIcon
            icon={areGasControllersVisible ? faAngleDown : faAngleRight}
            size={15}
          />
          <Text style={styles.speedLabel}>NETWORK SPEED/FEE</Text>
          <Text style={styles.speedValue}>{'BTC avg / ETH avg'}</Text>
        </Pressable>
      </View>
      {areGasControllersVisible && (
        <>
          <GasController assetSymbol="BTC" handleCustomPress={() => ({})} />
          <GasController assetSymbol="ETH" handleCustomPress={() => ({})} />
        </>
      )}
      <View style={[styles.row, styles.box]}>
        <FontAwesomeIcon
          icon={faClock}
          size={15}
          color="#9C55F6"
          style={styles.icon}
        />
        <Text style={[styles.font, styles.warning]}>
          Max slippage is 0.5%.{' '}
          <Text style={styles.warningMessage}>
            If the swap doesn’t complete within 3 hours, you will be refunded in
            6 hours at 20:45 GMT
          </Text>
        </Text>
      </View>
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
  },
  label: {
    color: '#646F85',
    marginRight: 5,
  },
  icon: {
    alignSelf: 'flex-start',
    marginRight: 5,
  },
  speedLabel: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    marginRight: 5,
  },
  speedValue: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
  },
  feeOptionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  warning: {
    textAlign: 'justify',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 16,
  },
  warningMessage: {
    fontWeight: '300',
  },
})

export default SwapScreen
