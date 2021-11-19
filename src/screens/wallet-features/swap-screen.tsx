import { StyleSheet, View, Text, Pressable } from 'react-native'
import React, { FC, useState } from 'react'
import MessageBanner from '../../components/ui/message-banner'
import AmountTextInputBlock from '../../components/ui/amount-text-input-block'
import { ChainId } from '@liquality/cryptoassets/src/types'
import LiqualityButton from '../../components/button'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown } from '@fortawesome/pro-regular-svg-icons'
import { faAngleDown, faAngleRight } from '@fortawesome/pro-light-svg-icons'
import GasController from '../../components/ui/gas-controller'

const SwapScreen: FC = () => {
  const [areGasControllersVisible, setGasControllersVisible] = useState(false)
  const toggleGasControllers = () => {
    setGasControllersVisible(!areGasControllersVisible)
  }

  return (
    <View style={styles.container}>
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
        <Text>RATE</Text>
        <LiqualityButton
          text="Liquality"
          variant="small"
          type="plain"
          action={() => ({})}
        />
      </View>
      <View style={styles.box}>
        <View style={styles.row}>
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
      </View>
      <View style={[styles.row, styles.box]}>
        <Text>Max slippage is 0.5%. </Text>
        <Text>
          If the swap doesn’t complete within 3 hours, you will be refunded in 6
          hours at 20:45 GMT
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  wrapper: {
    flexDirection: 'row',
  },
  font: {
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
    marginVertical: 10,
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
})

export default SwapScreen
