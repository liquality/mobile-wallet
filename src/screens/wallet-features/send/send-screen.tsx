import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { ChainId, getAsset, getChain } from '@liquality/cryptoassets'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  GasFees,
  MainStackParamList,
  NetworkFeeType,
  UseInputStateReturnType,
} from '../../../types'
import { BigNumber } from '@liquality/types'
import { calculateAvailableAmnt } from '../../../core/utils/fee-calculator'
import {
  cryptoToFiat,
  fiatToCrypto,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
import { chainDefaultColors } from '../../../core/config'
import { Box, TextInput, Text, Button } from '../../../theme'
import { getSendFee } from '@liquality/wallet-core/dist/src/utils/fees'
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
import { palette } from '../../../theme'
import { AppIcons, Fonts } from '../../../assets'
import FeeEditorScreen from '../custom-fee/fee-editor-screen'

const { QRCode } = AppIcons

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = NativeStackScreenProps<MainStackParamList, 'SendScreen'>

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
  const [, setFee] = useState<GasFees | null>(null)
  const [availableAmount, setAvailableAmount] = useState<string>('')
  const [amountInFiat, setAmountInFiat] = useState<number>(0)
  const [amountInNative, setAmountInNative] = useState<number>(0)
  const [showAmountsInFiat, setShowAmountsInFiat] = useState<boolean>(false)
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [, setNetworkSpeed] = useState<FeeLabel>(FeeLabel.Average)
  const [error, setError] = useState('')
  const [errorMessage, setErrorMessage] = useState<ErrorMsgAndType>({
    msg: '',
    type: null,
  })
  const amountInput = useInputState('0')
  const addressInput = useInputState('')
  const networkFee = useRef<NetworkFeeType>()
  const activeNetwork = useRecoilValue(networkState)
  const [showFeeEditorModal, setShowFeeEditorModal] = useState<boolean>(false)

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
    let feeInUnit
    customFee
      ? (feeInUnit = customFee)
      : (feeInUnit = networkFee?.current?.value)
    if (feeInUnit) {
      let total = new BigNumber(amountInput.value)
        .plus(getSendFee(code, feeInUnit))
        .dp(9)
      const availAmtBN = new BigNumber(availableAmount)
      const amtInpBN = new BigNumber(amountInput.value)
      if (
        !availAmtBN.eq(0) &&
        availAmtBN.eq(amtInpBN) &&
        availAmtBN.lt(total)
      ) {
        setErrorMessage({
          msg: 'error',
          type: customFee
            ? ErrorMessages.NotEnoughCoverFees
            : ErrorMessages.NotEnoughGas,
        })
      }
    }
  }, [amountInput.value, code, customFee, setErrorMessage, availableAmount])

  useEffect(() => {
    fetchFeesForAsset(code).then((gasFee) => {
      setFee(gasFee)
      const calculatedAmt = calculateAvailableAmnt(
        activeNetwork,
        code,
        getSendFee(code, gasFee.average.toNumber()).toNumber(),
        balance,
      )
      if (balance === 0) {
        setErrorMessage({ msg: 'error', type: ErrorMessages.NotEnoughToken })
      }
      setAvailableAmount(calculatedAmt)
    })
  }, [code, chain, balance, activeNetwork])

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
          gasFee: feeInUnit || 0,
          speedLabel: networkFee.current?.speed,
          destinationAddress: addressInput.value,
          asset: code,
          memo: '',
          color: color || palette.darkYellow,
        },
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
      // avoid more than one decimal points and only number are allowed
      const validated = text.match(/^(\d*\.{0,1}\d{0,20}$)/)
      if (!validated) {
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
            fiatToCrypto(new BigNumber(text || 0), fiatRates[code!]),
          ).toNumber(),
        )
        setAmountInFiat(new BigNumber(text || 0).toNumber())
      } else {
        setAmountInFiat(
          new BigNumber(
            cryptoToFiat(new BigNumber(text || 0).toNumber(), fiatRates[code]),
          ).toNumber(),
        )
        setAmountInNative(new BigNumber(text || 0).toNumber())
      }
      amountInput.onChangeText(text)
    },
    [amountInput, code, fiatRates, showAmountsInFiat, availableAmount],
  )

  const handleCustomPress = () => {
    setShowFeeEditorModal(true)
    // navigation.navigate(
    //   isEIP1559() ? 'CustomFeeEIP1559Screen' : 'CustomFeeScreen',
    //   {
    //     assetData: route.params.assetData,
    //     code,
    //     screenTitle: labelTranslateFn('sendScreen.networkSpeed')!,
    //     amountInput: amountInput.value,
    //     fee: fee,
    //     speedMode: networkSpeed,
    //   },
    // )
  }

  // const isEIP1559 = () => {
  //   return isEIP1559Fees(chain)
  // }

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
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            marginBottom="m">
            <Box
              flex={1}
              backgroundColor="blockBackgroundColor"
              paddingVertical="xl"
              paddingHorizontal="l">
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-end"
                marginBottom="m">
                <Text
                  variant="secondaryInputLabel"
                  tx="sendScreen.snd"
                  fontFamily="Anek Kannada"
                />
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
            <Box flexDirection="row" alignItems={'baseline'}>
              <Text variant="amountLabel" tx="sendScreen.available" />
              <Text variant="amount">{` ${availableAmount} ${code}`}</Text>
            </Box>
            <Button
              label={{ tx: 'sendScreen.max' }}
              type="tertiary"
              variant="s"
              onPress={() => {
                let afterFeeDeduction = new BigNumber(availableAmount)
                if (networkFee.current?.value) {
                  afterFeeDeduction = afterFeeDeduction
                    .minus(getSendFee(code, networkFee.current?.value))
                    .dp(9)
                }
                handleOnChangeText(afterFeeDeduction.toString())
              }}
            />
          </Box>
          <Box
            marginTop={'xl'}
            paddingVertical="xl"
            paddingHorizontal="l"
            backgroundColor="blockBackgroundColor">
            <Text variant="secondaryInputLabel" tx="sendScreen.sndTo" />
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              marginBottom="m">
              <TextInput
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
        <Box
          flexDirection={'row'}
          paddingVertical="l"
          paddingHorizontal="l"
          justifyContent="space-between">
          <Pressable>
            <Text
              color={'textButtonFontColor'}
              fontSize={16}
              style={styles.textRegular}>
              Transfer Within Accounts
            </Text>
          </Pressable>
          <Text color="darkGrey" fontSize={16} style={styles.textRegular}>
            {' | '}
          </Text>
          <Pressable onPress={handleCustomPress}>
            <Text
              color={'textButtonFontColor'}
              fontSize={16}
              style={styles.textRegular}>
              Network Speed
            </Text>
          </Pressable>
          {showFeeEditorModal && (
            <FeeEditorScreen onClose={setShowFeeEditorModal} />
          )}
          {!!error && <Text variant="error">{error}</Text>}
        </Box>
        <ButtonFooter>
          <Button
            type="primary"
            variant="l"
            label={{
              tx: errorMessage.msg
                ? 'sendScreen.insufficientFund'
                : 'common.review',
            }}
            onPress={handleReviewPress}
            isBorderless={true}
            isActive={!errorMessage.msg}
          />
          <Button
            type="secondary"
            variant="l"
            label={{ tx: 'common.cancel' }}
            onPress={navigation.goBack}
            isBorderless={true}
            isActive={true}
          />
        </ButtonFooter>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  sendInput: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'right',
    lineHeight: 40,
    height: 40,
    width: '100%',
    color: palette.darkYellow,
  },
  sendInputCurrency: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 28,
    textAlign: 'right',
    color: palette.darkYellow,
    lineHeight: 50,
    height: 40,
    paddingRight: 5,
  },
  assetName: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 24,
    lineHeight: 30,
  },
  textRegular: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
})

export default SendScreen
