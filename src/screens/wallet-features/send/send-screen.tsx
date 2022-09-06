import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { ChainId, getAsset, getChain } from '@liquality/cryptoassets'
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
import {
  balanceStateFamily,
  fiatRatesState,
  networkState,
} from '../../../atoms'
import i18n from 'i18n-js'
import ErrMsgBanner, { ErrorBtn } from '../../../components/ui/err-msg-banner'
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = NativeStackScreenProps<RootStackParamList, 'SendScreen'>

enum ErrorMessages {
  NotEnoughToken,
  NotEnoughTokenSelectMax,
  NotEnoughCoverFees,
  NotEnoughGas,
  AdjustSending,
}

interface ErrorMsgAndType {
  msg: string
  type: ErrorMessages | null
}

const SendScreen: FC<SendScreenProps> = (props) => {
  const { navigation, route } = props
  //TODO is there a better way to deal with this?
  const { assetData } = route.params
  const {
    code = 'ETH',
    chain = ChainId.Ethereum,
    color,
    id = '',
  } = assetData || {}
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
  const [errorMessage, setErrorMessage] = useState<ErrorMsgAndType>({
    msg: '',
    type: null,
  })
  const amountInput = useInputState('0')
  const addressInput = useInputState(
    'tb1qv87lrj2lprekaylh0drj3cyyvluapa7e2rjc9r',
  )
  const networkFee = useRef<NetworkFeeType>()
  const activeNetwork = useRecoilValue(networkState)

  const validate = useCallback((): boolean => {
    if (amountInput.value.length === 0 || !isNumber(amountInput.value)) {
      setError(labelTranslateFn('sendScreen.enterValidAmt')!)
      return false
    } else if (new BigNumber(amountInput.value).gt(new BigNumber(balance))) {
      setError(labelTranslateFn('sendScreen.lowerAmt')!)
      return false
    } else if (
      !chain ||
      !getChain(activeNetwork, chain).isValidAddress(addressInput.value)
    ) {
      setError(labelTranslateFn('sendScreen.wrongFmt')!)
      return false
    }

    return true
  }, [activeNetwork, addressInput.value, amountInput.value, balance, chain])

  useEffect(() => {
    if (route.params.customFee && balance) {
      setFee(new BigNumber(route.params.customFee))
      setCustomFee(route.params.customFee)

      const calculatedAmt = calculateAvailableAmnt(
        activeNetwork,
        code,
        route.params.customFee,
        balance,
      )
      setAvailableAmount(calculatedAmt)
      if (route.params.speed) {
        setNetworkSpeed(route.params.speed)
      }
    }
  }, [
    activeNetwork,
    balance,
    code,
    route.params.customFee,
    route.params.speed,
    setNetworkSpeed,
  ])

  useEffect(() => {
    let feeInUnit = customFee
    if (feeInUnit) {
      let total = new BigNumber(amountInput.value)
        .plus(getSendFee(code, feeInUnit))
        .dp(9)
      const availAmtBN = new BigNumber(availableAmount)
      const amtInpBN = new BigNumber(amountInput.value)
      if (availAmtBN.eq(amtInpBN) && availAmtBN.lt(total)) {
        setErrorMessage({
          msg: 'error',
          type: ErrorMessages.NotEnoughCoverFees,
        })
      }
    }
  }, [amountInput.value, code, customFee, setErrorMessage, availableAmount])

  useEffect(() => {
    fetchFeesForAsset(code).then((gasFee) => {
      setFee(gasFee)
      const calculatedAmt = calculateAvailableAmnt(
        code,
        getSendFee(code, gasFee.average.toNumber()).toNumber(),
        balance,
      )
      const calAmtInBn = new BigNumber(calculatedAmt)
      if (calAmtInBn.lte(0)) {
        setErrorMessage({ msg: 'error', type: ErrorMessages.NotEnoughToken })
      }
      setAvailableAmount(calculatedAmt)
    })
  }, [code, chain, balance])

  const handleReviewPress = useCallback(() => {
    let feeInUnit
    customFee
      ? (feeInUnit = customFee)
      : (feeInUnit = networkFee?.current?.value)

    if (validate() && networkFee?.current?.value) {
      navigation.navigate('SendReviewScreen', {
        assetData: route.params.assetData,
        screenTitle: i18n.t('sendScreen.sendReview', { code }),
        sendTransaction: {
          amount: new BigNumber(amountInput.value).toNumber(),
          gasFee: feeInUnit,
          speedLabel: networkFee.current?.speed,
          destinationAddress: addressInput.value,
          asset: code,
          memo: '',
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

      const textInBN = new BigNumber(text)
      if (textInBN.gt(availableAmount)) {
        setErrorMessage({
          msg: 'error',
          type: ErrorMessages.NotEnoughTokenSelectMax,
        })
      } else {
        setErrorMessage({
          msg: '',
          type: null,
        })
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
    [amountInput, code, fiatRates, showAmountsInFiat, availableAmount],
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

  const getCompatibleErrorMsg = React.useCallback(() => {
    const { msg, type } = errorMessage
    if (!msg) {
      return null
    }

    const onGetPress = () => {
      navigation.navigate('ReceiveScreen', {
        assetData,
        includeBackBtn: true,
        screenTitle: i18n.t('assetScreen.receiveCode', { code }),
      })
    }
    const onMaxPress = () => {
      handleOnChangeText(availableAmount.toString())
    }

    switch (type) {
      case ErrorMessages.NotEnoughToken:
        return (
          <ErrMsgBanner>
            <Text>{`${i18n.t('sendScreen.notEnoughTkn', {
              token: code,
            })}`}</Text>
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
          </ErrMsgBanner>
        )
      case ErrorMessages.NotEnoughTokenSelectMax:
        return (
          <ErrMsgBanner>
            <Text padding={'vs'}>{`${i18n.t('sendScreen.notEnoughTkn', {
              token: code,
            })}`}</Text>
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
            <Text padding={'vs'} tx={'sendScreen.orSelect'} />
            <ErrorBtn
              label={`${labelTranslateFn('sendScreen.max')}`}
              onPress={onMaxPress}
            />
          </ErrMsgBanner>
        )
      case ErrorMessages.NotEnoughCoverFees:
        return (
          <ErrMsgBanner>
            <Text padding={'vs'}>{`${i18n.t('sendScreen.notEnoughTknForFees', {
              token: code,
            })}`}</Text>
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
            <Text padding={'vs'} tx={'sendScreen.orSelect'} />
            <ErrorBtn
              label={`${labelTranslateFn('sendScreen.max')}`}
              onPress={onMaxPress}
            />
          </ErrMsgBanner>
        )
      case ErrorMessages.NotEnoughGas:
        return (
          <ErrMsgBanner>
            <Text padding={'vs'}>
              {`${i18n.t('sendScreen.notEnoughGas', {
                n: amountInput.value,
                token: code,
              })}`}
            </Text>
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
          </ErrMsgBanner>
        )
      case ErrorMessages.AdjustSending:
        return (
          <ErrMsgBanner>
            <Text padding={'vs'} tx="sendScreen.adjustSending" />
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
            <Text padding={'vs'} tx={'sendScreen.and'} />
            <ErrorBtn
              label={`${i18n.t('sendScreen.getTkn', {
                token: code,
              })}`}
              onPress={onGetPress}
            />
          </ErrMsgBanner>
        )
      default:
        return (
          <ErrMsgBanner>
            <Text>{msg}</Text>
          </ErrMsgBanner>
        )
    }
  }, [
    errorMessage,
    code,
    amountInput,
    assetData,
    navigation,
    handleOnChangeText,
    availableAmount,
  ])

  return (
    <Box flex={1} backgroundColor="mainBackground">
      {getCompatibleErrorMsg()}
      <Box flex={1} paddingVertical="l" paddingHorizontal="xl">
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
                <AssetIcon
                  asset={code}
                  chain={getAsset(activeNetwork, code).chain}
                />
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
                onPress={() => {
                  handleOnChangeText(availableAmount.toString())
                }}
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

              <Text
                variant="secondaryInputLabel"
                tx="sendScreen.networkSpeed"
              />
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
            variant="l"
            label={{
              tx: errorMessage.msg
                ? 'sendScreen.insufficientFund'
                : 'common.review',
            }}
            onPress={handleReviewPress}
            isBorderless={false}
            isActive={!errorMessage.msg}
          />
        </ButtonFooter>
      </Box>
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
