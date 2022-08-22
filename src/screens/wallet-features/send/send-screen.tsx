import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import {
  assets as cryptoassets,
  ChainId,
  chains,
} from '@liquality/cryptoassets'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  NetworkFeeType,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../../types'
import AngleDown from '../../../assets/icons/angle-down.svg'
import AngleRight from '../../../assets/icons/angle-right.svg'
import QRCode from '../../../assets/icons/qr-code.svg'
import { BigNumber } from '@liquality/types'
import { calculateAvailableAmnt } from '../../../core/utils/fee-calculator'
import {
  cryptoToFiat,
  dpUI,
  fiatToCrypto,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
import { chainDefaultColors } from '../../../core/config'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import TextInput from '../../../theme/textInput'
import Box from '../../../theme/box'
import {
  getSendFee,
  isEIP1559Fees,
} from '@liquality/wallet-core/dist/src/utils/fees'
import SendFeeSelector from '../../../components/ui/send-fee-selector'
import { fetchFeesForAsset } from '../../../store/store'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import ButtonFooter from '../../../components/button-footer'
import { isNumber, labelTranslateFn } from '../../../utils'
import { useRecoilValue } from 'recoil'
import { balanceStateFamily, fiatRatesState } from '../../../atoms'
import i18n from 'i18n-js'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = NativeStackScreenProps<RootStackParamList, 'SendScreen'>

const memoInputStyle: ViewStyle = {
  marginTop: 5,
  borderColor: '#D9DFE5',
  borderWidth: 1,
  height: 150,
  width: '100%',
}

const SendScreen: FC<SendScreenProps> = (props) => {
  const { navigation, route } = props
  //TODO is there a better way to deal with this?
  const {
    code = 'ETH',
    chain = ChainId.Ethereum,
    color,
    id = '',
  } = route.params.assetData || {}
  const [customFee, setCustomFee] = useState<number>(0)
  const fiatRates = useRecoilValue(fiatRatesState)
  const balance = useRecoilValue(
    balanceStateFamily({ asset: code, assetId: id }),
  )
  const [showFeeOptions, setShowFeeOptions] = useState(true)
  const [fee, setFee] = useState<BigNumber>(new BigNumber(0))
  const [availableAmount, setAvailableAmount] = useState<string>('')
  const [amountInFiat, setAmountInFiat] = useState<number>(0)
  const [amountInNative, setAmountInNative] = useState<number>(0)
  const [showAmountsInFiat, setShowAmountsInFiat] = useState<boolean>(false)
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [networkSpeed, setNetworkSpeed] = useState<FeeLabel>(FeeLabel.Average)
  const [error, setError] = useState('')
  const amountInput = useInputState('0')
  const addressInput = useInputState('')
  const memoInput = useInputState('')
  const networkFee = useRef<NetworkFeeType>()

  const validate = useCallback((): boolean => {
    if (amountInput.value.length === 0 || !isNumber(amountInput.value)) {
      setError(labelTranslateFn('sendScreen.enterValidAmt')!)
      return false
    } else if (new BigNumber(amountInput.value).gt(new BigNumber(balance))) {
      setError(labelTranslateFn('sendScreen.lowerAmt')!)
      return false
    } else if (!chain || !chains[chain].isValidAddress(addressInput.value)) {
      setError(labelTranslateFn('sendScreen.wrongFmt')!)
      return false
    }

    return true
  }, [addressInput.value, amountInput.value, balance, chain])

  useEffect(() => {
    if (route.params.customFee && balance) {
      setFee(new BigNumber(route.params.customFee))
      setCustomFee(route.params.customFee)
      setAvailableAmount(
        calculateAvailableAmnt(code, route.params.customFee, balance),
      )
      if (route.params.speed) {
        setNetworkSpeed(route.params.speed)
      }
    }
  }, [
    balance,
    code,
    route.params.customFee,
    route.params.speed,
    setNetworkSpeed,
  ])

  useEffect(() => {
    fetchFeesForAsset(code).then((gasFee) => {
      setFee(gasFee)
      setAvailableAmount(
        calculateAvailableAmnt(
          code,
          getSendFee(code, gasFee.average.toNumber()).toNumber(),
          balance,
        ),
      )
    })
  }, [code, chain, balance])

  const handleReviewPress = useCallback(() => {
    let feeInUnit
    customFee
      ? (feeInUnit = customFee)
      : (feeInUnit = networkFee?.current?.value)

    if (validate() && networkFee?.current?.value) {
      navigation.navigate('SendReviewScreen', {
        // screenTitle: `Send ${code} Review`,
        assetData: route.params.assetData,
        screenTitle: i18n.t('sendScreen.sendReview', { code }),
        sendTransaction: {
          amount: new BigNumber(amountInput.value).toNumber(),
          gasFee: feeInUnit,
          speedLabel: networkFee.current?.speed,
          destinationAddress: addressInput.value,
          asset: code,
          memo: memoInput.value,
          color: color || '#EAB300',
        },
        fee: fee,
        customFee: customFee,
      })
    }
  }, [
    customFee,
    validate,
    navigation,
    route.params.assetData,
    code,
    amountInput.value,
    addressInput.value,
    memoInput.value,
    color,
    fee,
  ])

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
        setError(labelTranslateFn('sendScreen.invalidAmt')!)
        return
      }

      if (!fiatRates) {
        setError(labelTranslateFn('sendScreen.fiatRate')!)
        return
      }

      if (showAmountsInFiat) {
        setAmountInNative(
          new BigNumber(
            fiatToCrypto(new BigNumber(text), fiatRates[code!]),
          ).toNumber(),
        )
        setAmountInFiat(new BigNumber(text).toNumber())
      } else {
        setAmountInFiat(
          new BigNumber(
            cryptoToFiat(new BigNumber(text).toNumber(), fiatRates[code]),
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
    navigation.navigate(
      isEIP1559() ? 'CustomFeeEIP1559Screen' : 'CustomFeeScreen',
      {
        assetData: route.params.assetData,
        code,
        screenTitle: labelTranslateFn('sendScreen.networkSpeed')!,
        amountInput: amountInput.value,
        fee: fee,
        speedMode: networkSpeed,
      },
    )
  }

  const isEIP1559 = () => {
    return isEIP1559Fees(chain)
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
    <Box
      flex={1}
      paddingVertical="l"
      paddingHorizontal="xl"
      backgroundColor="mainBackground">
      {isCameraVisible && chain && (
        <QrCodeScanner chain={chain} onClose={handleCameraModalClose} />
      )}
      <Box>
        <Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            marginBottom="m">
            <Box flex={1}>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-end"
                marginBottom="m">
                <Text variant="secondaryInputLabel" tx="sendScreen.snd" />
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
              </Box>
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
            </Box>
            <Box flexDirection="row" alignItems="flex-end">
              <AssetIcon asset={code} chain={cryptoassets[code].chain} />
              <Text style={styles.assetName}>{code}</Text>
            </Box>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            marginBottom="m">
            <Box flexDirection="row">
              <Text variant="amountLabel" tx="sendScreen.available" />
              <Text variant="amount">{` ${availableAmount} ${code}`}</Text>
            </Box>
            <Button
              label={{ tx: 'sendScreen.max' }}
              type="tertiary"
              variant="s"
              onPress={() =>
                amountInput.onChangeText(availableAmount.toString())
              }
            />
          </Box>
          <Box marginTop={'xl'}>
            <Text variant="secondaryInputLabel" tx="sendScreen.sndTo" />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              marginBottom="m">
              <TextInput
                style={styles.sendToInput}
                onChangeText={addressInput.onChangeText}
                onFocus={() => setError('')}
                value={addressInput.value}
                placeholderTx="sendScreen.address"
                autoCorrect={false}
                returnKeyType="done"
              />
              <Pressable onPress={handleQRCodeBtnPress}>
                <QRCode />
              </Pressable>
            </Box>
          </Box>
          <Box marginTop={'xl'}>
            <Text variant="secondaryInputLabel" tx="sendScreen.memoOpt" />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              marginBottom="m">
              <TextInput
                style={memoInputStyle}
                onChangeText={memoInput.onChangeText}
                onFocus={() => setError('')}
                value={memoInput.value}
                multiline
                numberOfLines={15}
                autoCorrect={false}
                returnKeyType="done"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box flex={0.3}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          marginBottom="m">
          <Pressable
            onPress={handleFeeOptionsPress}
            style={styles.feeOptionsButton}>
            {showFeeOptions ? (
              <AngleDown style={styles.dropdown} />
            ) : (
              <AngleRight style={styles.dropdown} />
            )}

            <Text variant="secondaryInputLabel" tx="sendScreen.networkSpeed" />
          </Pressable>
          {customFee ? (
            <Text style={styles.speedValue}>
              {`(Custom / ${dpUI(getSendFee(code, customFee), 9)} ${code})`}
            </Text>
          ) : (
            <Text style={styles.speedValue}>
              {`(${networkSpeed} / ${dpUI(
                getSendFee(code, networkFee.current?.value || Number(fee)),
                9,
              )} ${code})`}
            </Text>
          )}
        </Box>
        {showFeeOptions && (
          <SendFeeSelector
            asset={code}
            handleCustomPress={handleCustomPress}
            networkFee={networkFee}
            changeNetworkSpeed={setNetworkSpeed}
          />
        )}
        {!!error && <Text variant="error">{error}</Text>}
      </Box>
      <ButtonFooter>
        <Button
          type="secondary"
          variant="m"
          label={{ tx: 'common.cancel' }}
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label={{ tx: 'common.review' }}
          onPress={handleReviewPress}
          isBorderless={false}
          isActive={true}
        />
      </ButtonFooter>
    </Box>
  )
}

const styles = StyleSheet.create({
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
  assetName: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  sendToInput: {
    marginTop: 5,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '90%',
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
  dropdown: {
    marginRight: 5,
    marginBottom: 5,
  },
})

export default SendScreen
