import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'
import { chains } from '@liquality/cryptoassets'
import { StackScreenProps } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { RootStackParamList, UseInputStateReturnType } from '../../types'
import {
  faAngleDown,
  faAngleRight,
  faQrcode,
} from '@fortawesome/pro-light-svg-icons'
import LiqualityButton from '../../components/button'
import { DataElementType } from '../../components/asset-flat-list'
import { useAppSelector } from '../../hooks'
import { GasSpeedType, NetworkEnum } from '../../core/types'
import BigNumber from 'bignumber.js'
import {
  calculateAvailableAmnt,
  calculateGasFee,
} from '../../core/utils/fee-calculator'
import { cryptoToFiat, fiatToCrypto } from '../../core/utils/coin-formatter'
import AssetIcon from '../../components/asset-icon'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = StackScreenProps<RootStackParamList, 'SendScreen'>

const SendScreen = ({ navigation, route }: SendScreenProps) => {
  const { code, balance, chain }: DataElementType = route.params.assetData!
  const [customFee, setCustomFee] = useState(route.params.customFee)
  const gasSpeeds: GasSpeedType[] = ['slow', 'average', 'fast']
  const {
    activeWalletId,
    activeNetwork = NetworkEnum.Testnet,
    fees,
    fiatRates,
  } = useAppSelector((state) => ({
    activeWalletId: state.activeWalletId,
    activeNetwork: state.activeNetwork,
    fees: state.fees,
    fiatRates: state.fiatRates,
  }))
  const [showFeeOptions, setShowFeeOptions] = useState(false)
  const [speedMode, setSpeedMode] = useState<GasSpeedType>('average')
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0))
  const [availableAmount, setAvailableAmount] = useState<string>('')
  const [amountInFiat, setAmountInFiat] = useState<number>(0)
  const [amountInNative, setAmountInNative] = useState<number>(0)
  const [showAmountsInFiat, setShowAmountsInFiat] = useState<boolean>(false)
  const [error, setError] = useState('')
  const amountInput = useInputState('')
  const addressInput = useInputState('')

  const isNumber = (value: string): boolean => {
    return /^\d+(.\d+)?$/.test(value)
  }

  const validate = (): boolean => {
    if (amountInput.value.length === 0 || !isNumber(amountInput.value)) {
      setError('Enter a valid amount')
      return false
    } else if (new BigNumber(amountInput.value).gt(balance!)) {
      setError('Lower amount. This exceeds available balance.')
      return false
    } else if (!chain || !chains[chain].isValidAddress(addressInput.value)) {
      setError('Wrong format. Please check the address.')
      return false
    }

    return true
  }

  useEffect(() => {
    let gasFee
    if (
      !fees ||
      !activeNetwork ||
      !activeWalletId ||
      !chain ||
      !code ||
      !balance
    ) {
      setError('Please refresh your wallet')
      return
    }

    if (customFee) {
      setFee(new BigNumber(customFee!))
      setAvailableAmount(
        calculateAvailableAmnt(code, customFee!, balance.toNumber()),
      )
    } else {
      gasFee = calculateGasFee(
        code,
        fees[activeNetwork]?.[activeWalletId]?.[chain]?.[speedMode]?.fee!,
      )

      if (!gasFee) {
        setError('Please refresh your wallet')
        return
      }
      setFee(new BigNumber(gasFee))
      setAvailableAmount(
        calculateAvailableAmnt(code, gasFee, balance.toNumber()),
      )
    }
  }, [
    code,
    speedMode,
    fees,
    activeWalletId,
    activeNetwork,
    chain,
    balance,
    customFee,
  ])

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

  const handleFiatBtnPress = () => {
    if (showAmountsInFiat) {
      amountInput.onChangeText(`${amountInNative}`)
    } else {
      amountInput.onChangeText(`${amountInFiat}`)
    }
    setShowAmountsInFiat(!showAmountsInFiat)
  }

  const handleOnChangeText = (text: string): void => {
    if (!isNumber(text)) {
      setError('Invalid amount.')
      return
    }

    if (!fiatRates) {
      setError('Fiat rates missing!')
      return
    }

    if (showAmountsInFiat) {
      setAmountInNative(
        fiatToCrypto(new BigNumber(text), fiatRates[code!]).toNumber(),
      )
      setAmountInFiat(new BigNumber(text).toNumber())
    } else {
      setAmountInFiat(
        cryptoToFiat(
          new BigNumber(text).toNumber(),
          fiatRates[code!],
        ).toNumber(),
      )
      setAmountInNative(new BigNumber(text).toNumber())
    }
    amountInput.onChangeText(text)
  }

  const handleFeeOptionsPress = () => {
    setShowFeeOptions(!showFeeOptions)
  }

  const handleCustomPress = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <View style={styles.sendWrapper}>
          <View style={styles.row}>
            <Text>SEND</Text>
            <Pressable
              style={[
                styles.amountInFiatBtn,
                showAmountsInFiat && styles.nativeStyle,
              ]}
              onPress={handleFiatBtnPress}>
              <Text style={styles.amount}>
                {showAmountsInFiat
                  ? `${amountInNative} ${code}`
                  : `$${amountInFiat}`}
              </Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <View style={styles.sendInputCurrencyWrapper}>
              <Text style={styles.sendInputCurrency}>
                {showAmountsInFiat ? '$' : code}
              </Text>
              <TextInput
                style={[styles.sendInputCurrency, styles.sendInput]}
                keyboardType={'numeric'}
                onChangeText={handleOnChangeText}
                onFocus={() => setError('')}
                value={amountInput.value}
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
            <View style={styles.asset}>
              <AssetIcon asset={code} />
              <Text style={styles.assetName}>{code}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.balanceTextWrapper}>
              <Text style={styles.availableBalanceLabel}>Available</Text>
              <Text style={styles.amount}>
                {availableAmount} {code}
              </Text>
            </View>
            <Pressable
              style={styles.maxBtn}
              onPress={() =>
                amountInput.onChangeText(availableAmount.toString())
              }>
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
          <Pressable
            onPress={handleFeeOptionsPress}
            style={styles.feeOptionsButton}>
            <FontAwesomeIcon
              icon={showFeeOptions ? faAngleDown : faAngleRight}
              size={15}
            />
            <Text style={styles.speedLabel}>NETWORK SPEED/FEE</Text>
          </Pressable>
          {customFee ? (
            <Text style={styles.speedValue}>
              {`(Custom / ${calculateGasFee(code!, customFee)} ${code})`}
            </Text>
          ) : (
            <Text style={styles.speedValue}>
              {`(${speedMode} / ${fee} ${code})`}
            </Text>
          )}
        </View>
        {showFeeOptions && (
          <View style={[styles.row, styles.speedOptions]}>
            <Text style={styles.speedAssetName}>{code}</Text>
            <View style={styles.speedBtnsWrapper}>
              {gasSpeeds.map((speed, idx) => (
                <Pressable
                  style={[
                    styles.speedBtn,
                    idx === 0 && styles.speedLeftBtn,
                    idx === 2 && styles.speedRightBtn,
                    speedMode === speed &&
                      !customFee &&
                      styles.speedBtnSelected,
                  ]}
                  onPress={() => {
                    setCustomFee(undefined)
                    setSpeedMode(speed)
                  }}>
                  <Text
                    style={[
                      styles.speedBtnLabel,
                      speedMode === speed &&
                        !customFee &&
                        styles.speedTxtSelected,
                      styles.speedLeftBtn,
                    ]}>
                    {speed}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={handleCustomPress}>
              <Text style={styles.customFee}>Custom</Text>
            </Pressable>
          </View>
        )}
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
  amount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  nativeStyle: {
    borderColor: '#38FFFB',
  },
  sendInputCurrencyWrapper: {
    flexDirection: 'row',
    width: '80%',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  sendInput: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'left',
    lineHeight: 40,
    height: 40,
    width: '100%',
    color: '#EAB300',
  },
  sendInputCurrency: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'left',
    color: '#EAB300',
    lineHeight: 50,
    height: 40,
    paddingRight: 5,
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
  speedOptions: {
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
  },
  speedLabel: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },
  speedValue: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
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
    textTransform: 'capitalize',
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
  feeOptionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
