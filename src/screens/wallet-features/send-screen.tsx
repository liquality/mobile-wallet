import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'
import { chains } from '@liquality/cryptoassets'
import { StackScreenProps } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { RootStackParamList, UseInputStateReturnType } from '../../types'
import ETHIcon from '../../assets/icons/crypto/eth.svg'
import BTCIcon from '../../assets/icons/crypto/btc.svg'
import { faQrcode } from '@fortawesome/pro-light-svg-icons'
import LiqualityButton from '../../components/button'
import { DataElementType } from '../../components/asset-flat-list'
import { useAppSelector } from '../../hooks'
import { NetworkEnum } from '../../core/config'
import BigNumber from 'bignumber.js'
import {
  calculateAvailableAmnt,
  calculateGasFee,
} from '../../core/utils/fee-calculator'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = StackScreenProps<RootStackParamList, 'SendScreen'>

const SendScreen = ({ navigation, route }: SendScreenProps) => {
  const { code, balance, chain }: DataElementType = route.params.assetData!
  const {
    activeWalletId,
    activeNetwork = NetworkEnum.Testnet,
    fees,
  } = useAppSelector((state) => ({
    activeWalletId: state.activeWalletId,
    activeNetwork: state.activeNetwork,
    fees: state.fees,
  }))
  const [speedMode, setSpeedMode] = useState('slow')
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0))
  const [availableAmount, setAvailableAmount] = useState<number>(0)
  const [error, setError] = useState('')
  const amountInput = useInputState('')
  const addressInput = useInputState('')

  const getAssetIcon = (asset: string) => {
    if (asset.toLowerCase() === 'eth' || asset.toLowerCase() === 'ethereum') {
      return <ETHIcon width={28} height={28} />
    } else {
      return <BTCIcon width={28} height={28} />
    }
  }

  const isNumber = (value: string): boolean => {
    return /^\d+(.\d+)?$/.test(value)
  }

  const validate = (): boolean => {
    if (amountInput.value.length === 0 || !isNumber(amountInput.value)) {
      setError('Enter a valid amount')
      return false
    } else if (new BigNumber(amountInput.value).gt(balance)) {
      setError('Lower amount. This exceeds available balance.')
      return false
    } else if (!chain || !chains[chain].isValidAddress(addressInput.value)) {
      setError('Wrong format. Please check the address.')
      return false
    }

    return true
  }

  useEffect(() => {
    if (!fees || !activeNetwork || !activeWalletId || !chain) {
      setError('Please refresh your wallet')
      return
    }

    const gasFee = calculateGasFee(
      code,
      fees[activeNetwork][activeWalletId][chain][speedMode]?.fee,
    )

    if (!gasFee) {
      setError('Please refresh your wallet')
      return
    }

    setFee(new BigNumber(gasFee))
    setAvailableAmount(calculateAvailableAmnt(code, gasFee, balance.toNumber()))
  }, [code, speedMode, fees, activeWalletId, activeNetwork, chain, balance])

  const handleReviewPress = () => {
    if (validate()) {
      navigation.navigate('SendReviewScreen', {
        screenTitle: `Send ${code} Review`,
        sendTransaction: {
          amount: new BigNumber(amountInput.value),
          gasFee: fee!,
          destinationAddress: addressInput.value,
          asset: code,
        },
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.sendWrapper}>
          <View style={styles.row}>
            <Text>SEND</Text>
            <Pressable style={styles.amountInFiatBtn}>
              <Text style={styles.amountInFiat}>$0.00</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.sendInput}
              keyboardType={'numeric'}
              onChangeText={amountInput.onChangeText}
              onFocus={() => setError('')}
              value={amountInput.value}
              autoCorrect={false}
              returnKeyType="done"
            />
            <View style={styles.asset}>
              {getAssetIcon(code)}
              <Text style={styles.assetName}>{code}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.balanceTextWrapper}>
              <Text style={styles.availableBalanceLabel}>Available</Text>
              <Text style={styles.availableBalance}>
                {availableAmount} {code}
              </Text>
            </View>
            <Pressable
              style={styles.maxBtn}
              onPress={() => amountInput.onChangeText(balance.toString())}>
              <Text style={styles.maxLabel}>Max</Text>
            </Pressable>
          </View>
          <View style={styles.sendToWrapper}>
            <Text>SEND TO</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.sendToInput}
                onChangeText={addressInput.onChangeText}
                onFocus={() => setError('')}
                value={addressInput.value}
                autoCorrect={false}
                returnKeyType="done"
              />
              <FontAwesomeIcon icon={faQrcode} />
            </View>
          </View>
          <View />
        </View>
      </View>
      <View style={styles.contentBlock}>
        <View style={styles.row}>
          <Text style={styles.speedLabel}>NETWORK SPEED/FEE</Text>
          <Text style={styles.speedValue}>
            {`(${speedMode} / ${fee} ${code})`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.speedAssetName}>{code}</Text>
          <View style={styles.speedBtnsWrapper}>
            <Pressable
              style={[
                styles.speedBtn,
                styles.speedLeftBtn,
                speedMode === 'slow' && styles.speedBtnSelected,
              ]}
              onPress={() => setSpeedMode('slow')}>
              <Text
                style={[
                  styles.speedBtnLabel,
                  speedMode === 'slow' && styles.speedTxtSelected,
                ]}>
                Slow
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.speedBtn,
                speedMode === 'average' && styles.speedBtnSelected,
              ]}
              onPress={() => setSpeedMode('average')}>
              <Text
                style={[
                  styles.speedBtnLabel,
                  speedMode === 'average' && styles.speedTxtSelected,
                ]}>
                Average
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.speedBtn,
                styles.speedRightBtn,
                speedMode === 'fast' && styles.speedBtnSelected,
              ]}
              onPress={() => setSpeedMode('fast')}>
              <Text
                style={[
                  styles.speedBtnLabel,
                  speedMode === 'fast' && styles.speedTxtSelected,
                ]}>
                Fast
              </Text>
            </Pressable>
          </View>
          <Text style={styles.customFee}>Custom</Text>
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.actionBlock}>
        <View style={styles.row}>
          <LiqualityButton
            text={'Cancel'}
            textColor={'#9D4DFA'}
            backgroundColor={'#F8FAFF'}
            width={152}
            action={navigation.goBack}
          />
          <LiqualityButton
            text={'Review'}
            textColor={'#FFFFFF'}
            backgroundColor={'#9D4DFA'}
            width={152}
            action={handleReviewPress}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerBlock: {
    flex: 0.5,
  },
  sendWrapper: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sendLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
  amountInFiatBtn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  amountInFiat: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  sendInput: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'right',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '80%',
    lineHeight: 40,
    height: 40,
    color: '#EAB300',
  },
  asset: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  assetName: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  maxBtn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  maxLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  balanceTextWrapper: {
    flexDirection: 'row',
  },
  availableBalanceLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 15,
    color: '#646F85',
    marginRight: 5,
  },
  availableBalance: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
  },
  sendToWrapper: {
    marginTop: 40,
  },
  sendToInput: {
    marginTop: 5,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '90%',
  },
  contentBlock: {
    flex: 0.3,
  },
  speedLabel: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
  },
  speedValue: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  speedBtnsWrapper: {
    flexDirection: 'row',
  },
  speedBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  speedLeftBtn: {
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderRightWidth: 0,
  },
  speedRightBtn: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderLeftWidth: 0,
  },
  speedBtnLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 11,
    color: '#1D1E21',
  },
  speedBtnSelected: {
    backgroundColor: '#F0F7F9',
  },
  speedTxtSelected: {
    fontWeight: '600',
  },
  actionBlock: {
    flex: 0.2,
    justifyContent: 'flex-end',
  },
  speedAssetName: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 15,
    color: '#3D4767',
  },
  customFee: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    color: '#9D4DFA',
  },
  error: {
    fontFamily: 'Montserrat-Regular',
    color: '#F12274',
    fontSize: 12,
    backgroundColor: '#FFF',
    textAlignVertical: 'center',
    marginTop: 5,
    paddingVertical: 5,
    height: 25,
  },
})
export default SendScreen
