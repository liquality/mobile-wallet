import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import { chains } from '@liquality/cryptoassets'
import { StackScreenProps } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  AssetDataElementType,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../../types'
import {
  faAngleDown,
  faAngleRight,
  faQrcode,
} from '@fortawesome/pro-light-svg-icons'
import { useAppSelector } from '../../../hooks'
import { BigNumber } from '@liquality/types'
import { calculateAvailableAmnt } from '../../../core/utils/fee-calculator'
import {
  cryptoToFiat,
  dpUI,
  fiatToCrypto,
  gasUnitToCurrency,
} from '../../../core/utils/coin-formatter'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
import { assets as cryptoassets } from '@liquality/cryptoassets'
import { chainDefaultColors } from '../../../core/config'
import Button from '../../../theme/button'
import Text from '../../../theme/text'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = StackScreenProps<RootStackParamList, 'SendScreen'>

const SendScreen = ({ navigation, route }: SendScreenProps) => {
  const { code, balance, chain }: AssetDataElementType = route.params.assetData!
  const [customFee, setCustomFee] = useState<number>(0)
  const gasSpeeds: any[] = ['slow', 'average', 'fast']
  const {
    activeWalletId,
    activeNetwork = 'testnet',
    fees,
    fiatRates,
  } = useAppSelector((state) => ({
    activeWalletId: state.activeWalletId,
    activeNetwork: state.activeNetwork,
    fees: state.fees,
    fiatRates: state.fiatRates,
  }))
  const [showFeeOptions, setShowFeeOptions] = useState(false)
  const [speedMode, setSpeedMode] = useState<any>('average')
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0))
  const [availableAmount, setAvailableAmount] = useState<string>('')
  const [amountInFiat, setAmountInFiat] = useState<number>(0)
  const [amountInNative, setAmountInNative] = useState<number>(0)
  const [showAmountsInFiat, setShowAmountsInFiat] = useState<boolean>(false)
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [error, setError] = useState('')
  const amountInput = useInputState('')
  const addressInput = useInputState('')

  const isNumber = (value: string): boolean => {
    return /^\d+(.\d*)?$/.test(value)
  }

  const validate = useCallback((): boolean => {
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
  }, [addressInput.value, amountInput.value, balance, chain])

  useEffect(() => {
    if (route.params.customFee && balance) {
      setFee(new BigNumber(route.params.customFee))
      setCustomFee(route.params.customFee)
      setAvailableAmount(
        calculateAvailableAmnt(
          code,
          route.params.customFee,
          balance.toNumber(),
        ),
      )
    }
  }, [balance, code, route.params.customFee])

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

    gasFee = fees[activeNetwork]?.[activeWalletId]?.[chain]?.[speedMode]?.fee

    if (!gasFee) {
      setError('Please refresh your wallet')
      return
    }
    setFee(new BigNumber(gasFee))
    setAvailableAmount(
      calculateAvailableAmnt(
        code,
        gasUnitToCurrency(code, gasFee).toNumber(),
        balance.toNumber(),
      ),
    )
  }, [code, speedMode, fees, activeWalletId, activeNetwork, chain, balance])

  const handleReviewPress = useCallback(() => {
    if (validate()) {
      navigation.navigate('SendReviewScreen', {
        screenTitle: `Send ${code} Review`,
        sendTransaction: {
          amount: new BigNumber(amountInput.value),
          gasFee: fee,
          destinationAddress: addressInput.value,
          asset: code,
        },
      })
    }
  }, [addressInput.value, amountInput.value, code, fee, navigation, validate])

  const handleFiatBtnPress = useCallback(() => {
    if (showAmountsInFiat) {
      amountInput.onChangeText(`${amountInNative}`)
    } else {
      amountInput.onChangeText(`${amountInFiat}`)
    }
    setShowAmountsInFiat(!showAmountsInFiat)
  }, [amountInFiat, amountInNative, amountInput, showAmountsInFiat])

  const handleOnChangeText = useCallback(
    (text: string): void => {
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
            fiatRates[code],
          ).toNumber(),
        )
        setAmountInNative(new BigNumber(text).toNumber())
      }
      amountInput.onChangeText(text)
    },
    [amountInput, code, fiatRates, showAmountsInFiat],
  )

  const handleFeeOptionsPress = () => {
    setShowFeeOptions(!showFeeOptions)
  }

  const handleCustomPress = () => {
    navigation.navigate('CustomFeeScreen', {
      assetData: route.params.assetData,
      screenTitle: 'NETWORK SPEED/FEE',
    })
  }

  const handleQRCodeBtnPress = () => {
    setIsCameraVisible(!isCameraVisible)
  }

  const handleCameraModalClose = useCallback(
    (address: string) => {
      setIsCameraVisible(!isCameraVisible)
      if (address) {
        addressInput.onChangeText(address.replace('ethereum:', ''))
      }
    },
    [addressInput, isCameraVisible],
  )

  return (
    <View style={styles.container}>
      {isCameraVisible && chain && (
        <QrCodeScanner chain={chain} onClose={handleCameraModalClose} />
      )}
      <View style={styles.headerBlock}>
        <View style={styles.sendWrapper}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text variant="secondaryInputLabel">SEND</Text>
                <Button
                  label={
                    showAmountsInFiat
                      ? `${amountInNative} ${code}`
                      : `$${amountInFiat}`
                  }
                  type="tertiary"
                  variant="s"
                  onPress={handleFiatBtnPress}
                />
              </View>
              <TextInput
                style={[
                  styles.sendInputCurrency,
                  styles.sendInput,
                  { color: chainDefaultColors[chain] },
                ]}
                keyboardType={'numeric'}
                onChangeText={handleOnChangeText}
                onFocus={() => setError('')}
                value={amountInput.value}
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
            <View style={styles.asset}>
              <AssetIcon asset={code} chain={cryptoassets[code].chain} />
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
            <Button
              label="Max"
              type="tertiary"
              variant="s"
              onPress={() =>
                amountInput.onChangeText(availableAmount.toString())
              }
            />
          </View>
          <View style={styles.sendToWrapper}>
            <Text variant="secondaryInputLabel">SEND TO</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.sendToInput}
                onChangeText={addressInput.onChangeText}
                onFocus={() => setError('')}
                value={addressInput.value}
                autoCorrect={false}
                returnKeyType="done"
              />
              <Pressable onPress={handleQRCodeBtnPress}>
                <FontAwesomeIcon icon={faQrcode} size={25} />
              </Pressable>
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
            <Text variant="secondaryInputLabel">NETWORK SPEED/FEE</Text>
          </Pressable>
          {customFee ? (
            <Text style={styles.speedValue}>
              {`(Custom / ${dpUI(
                gasUnitToCurrency(code, new BigNumber(customFee)),
                9,
              )} ${code})`}
            </Text>
          ) : (
            <Text style={styles.speedValue}>
              {`(${speedMode} / ${dpUI(
                gasUnitToCurrency(code, new BigNumber(fee)),
                9,
              )} ${code})`}
            </Text>
          )}
        </View>
        {showFeeOptions && (
          <View style={[styles.row, styles.speedOptions]}>
            <Text style={styles.speedAssetName}>{code}</Text>
            <View style={styles.speedBtnsWrapper}>
              {gasSpeeds.map((speed, idx) => (
                <Pressable
                  key={speed}
                  style={[
                    styles.speedBtn,
                    idx === 0 && styles.speedLeftBtn,
                    idx === 2 && styles.speedRightBtn,
                    speedMode === speed &&
                      !customFee &&
                      styles.speedBtnSelected,
                  ]}
                  onPress={() => {
                    setCustomFee(0)
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
        {!!error && <Text variant="error">{error}</Text>}
      </View>
      <View style={styles.actionBlock}>
        <Button
          type="secondary"
          variant="m"
          label="Cancel"
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label="Review"
          onPress={handleReviewPress}
          isBorderless={false}
          isActive={true}
        />
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
  sendInput: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'right',
    lineHeight: 40,
    height: 40,
    width: '100%',
    color: '#EAB300',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  sendInputCurrency: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'right',
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
    borderColor: '#D9DFE5',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 0.2,
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
})
export default SendScreen
