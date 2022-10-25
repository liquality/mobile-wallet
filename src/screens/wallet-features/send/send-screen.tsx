import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { ChainId, getAsset, getChain } from '@liquality/cryptoassets'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  ActionEnum,
  ErrorMessages,
  ErrorMsgAndType,
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
import {
  Box,
  TextInput,
  Text,
  Button,
  faceliftPalette,
  showSendToast,
} from '../../../theme'
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
import { palette } from '../../../theme'
import { AppIcons, Fonts } from '../../../assets'
import FeeEditorScreen from '../custom-fee/fee-editor-screen'
import { scale } from 'react-native-size-matters'
import FiatSwapSwitch from '../../../assets/icons/fiatCryptoSwitch.svg'
import ChevronRight from '../../../assets/icons/chevronRight.svg'
import ArrowUp from '../../../assets/icons/arrowUp.svg'

const { QRCode } = AppIcons

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = NativeStackScreenProps<MainStackParamList, 'SendScreen'>

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
  const [maxPressed, setMaxPressed] = useState(false)
  const [sendBlockFocused, setSendBlockFocused] = useState(false)

  const onGetPress = useCallback(() => {
    navigation.navigate('ReceiveScreen', {
      assetData,
      includeBackBtn: true,
      screenTitle: i18n.t('assetScreen.receiveCode', { code }),
    })
  }, [assetData, code, navigation])

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

  const handleSendPress = useCallback(() => {
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

      let nativeAmnt = 0
      let fiatAmnt = 0

      if (showAmountsInFiat) {
        nativeAmnt = new BigNumber(
          fiatToCrypto(new BigNumber(text || 0), fiatRates[code!]),
        ).toNumber()
        fiatAmnt = new BigNumber(text || 0).toNumber()
      } else {
        fiatAmnt = new BigNumber(
          cryptoToFiat(new BigNumber(text || 0).toNumber(), fiatRates[code]),
        ).toNumber()
        nativeAmnt = new BigNumber(text || 0).toNumber()
      }

      setAmountInNative(nativeAmnt)
      setAmountInFiat(fiatAmnt)
      const textInBN = new BigNumber(nativeAmnt)
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
      amountInput.onChangeText(text)
    },
    [fiatRates, availableAmount, showAmountsInFiat, amountInput, code],
  )

  const onMaxPress = useCallback(() => {
    handleOnChangeText(availableAmount.toString())
  }, [availableAmount, handleOnChangeText])

  const handleCustomPress = () => {
    setShowFeeEditorModal(true)
  }

  const handleQRCodeBtnPress = () => {
    setIsCameraVisible(!isCameraVisible)
  }

  const handleChevronRightPress = () => {
    navigation.navigate('AssetChooserScreen', {
      screenTitle: labelTranslateFn('summaryBlockComp.selectAssetSend') || '',
      action: ActionEnum.SEND,
    })
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

  const resetMsg = () => {
    setErrorMessage({ msg: '', type: null })
  }

  useEffect(() => {
    if (errorMessage.msg) {
      showSendToast('sendToast', {
        errorMessage: {
          msg: 'error',
          type: customFee
            ? ErrorMessages.NotEnoughCoverFees
            : ErrorMessages.NotEnoughGas,
        },
        onGetPress,
        onMaxPress,
        resetMsg,
        code,
        amount: amountInNative.toString(),
      })
    }
  }, [amountInNative, code, customFee, errorMessage, onGetPress, onMaxPress])

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
    route?.params?.customFee,
    route?.params?.speed,
    setNetworkSpeed,
  ])

  useEffect(() => {
    let feeInUnit
    customFee
      ? (feeInUnit = customFee)
      : (feeInUnit = networkFee?.current?.value)
    if (feeInUnit) {
      let total = new BigNumber(amountInNative)
        .plus(getSendFee(code, feeInUnit))
        .dp(9)
      const availAmtBN = new BigNumber(availableAmount)
      const amtInpBN = new BigNumber(amountInNative)
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
  }, [code, customFee, availableAmount, amountInNative])

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

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="l">
      <Box flex={1} paddingVertical="l">
        {isCameraVisible && chain && (
          <QrCodeScanner chain={chain} onClose={handleCameraModalClose} />
        )}
        <Box marginBottom={'m'}>
          <Box
            paddingVertical="xl"
            backgroundColor={
              sendBlockFocused
                ? 'selectedBackgroundColor'
                : 'blockBackgroundColor'
            }
            paddingHorizontal="l">
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              marginBottom="m">
              <Box flex={1}>
                <Box flexDirection="row" alignItems="flex-end" marginBottom="m">
                  <Text variant="secondaryInputLabel" tx="sendScreen.snd" />
                  <Text variant="secondaryInputLabel" marginLeft="s">
                    {code}
                  </Text>
                  <Text
                    variant="amountLabel"
                    marginLeft="s">{` ${availableAmount}`}</Text>
                  <Text
                    variant="amountLabel"
                    tx="sendScreen.balance"
                    marginLeft="s"
                  />
                </Box>
                <Box flexDirection="row" alignItems="center">
                  <TextInput
                    style={styles.sendInput}
                    keyboardType={'numeric'}
                    onChangeText={handleOnChangeText}
                    onFocus={() => {
                      setError('')
                      setSendBlockFocused(true)
                    }}
                    onBlur={() => {
                      setSendBlockFocused(false)
                    }}
                    value={amountInput.value}
                    autoCorrect={false}
                    returnKeyType="done"
                  />
                  <AssetIcon
                    size={scale(25)}
                    chain={getAsset(activeNetwork, code).chain}
                  />
                  <AssetIcon
                    size={scale(25)}
                    styles={{ right: scale(10), top: scale(5) }}
                    asset={code}
                  />
                  <Pressable onPress={handleChevronRightPress}>
                    <ChevronRight />
                  </Pressable>
                </Box>
                <Box flexDirection="row" alignItems="center">
                  <Pressable onPress={handleFiatBtnPress}>
                    <FiatSwapSwitch width={scale(20)} height={scale(15)} />
                  </Pressable>
                  <Text
                    variant={'mainButtonLabel'}
                    color={'darkGrey'}
                    marginLeft="m"
                    marginTop="s">
                    {showAmountsInFiat
                      ? `${amountInNative} ${code}`
                      : `$${amountInFiat}`}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Pressable
              onPress={() => {
                if (maxPressed) {
                  handleOnChangeText('0')
                } else {
                  let afterFeeDeduction = new BigNumber(availableAmount)
                  if (networkFee.current?.value) {
                    afterFeeDeduction = afterFeeDeduction
                      .minus(getSendFee(code, networkFee.current?.value))
                      .dp(9)
                  }
                  handleOnChangeText(afterFeeDeduction.toString())
                }

                setMaxPressed(!maxPressed)
              }}>
              <Text
                tx={'sendScreen.max'}
                color={maxPressed ? 'activeLink' : 'inactiveLink'}
              />
            </Pressable>
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
              alignItems="center"
              marginBottom="m">
              <TextInput
                style={styles.sendToInput}
                onChangeText={addressInput.onChangeText}
                onFocus={() => setError('')}
                value={addressInput.value}
                placeholderTx="sendScreen.address"
                placeholderTextColor={faceliftPalette.greyMeta}
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
            <FeeEditorScreen
              onClose={setShowFeeEditorModal}
              selectedAsset={code}
              amount={new BigNumber(amountInput.value)}
              applyFee={(fee) => {
                setCustomFee(fee.toNumber)
                setShowFeeEditorModal(false)
              }}
            />
          )}
        </Box>
        {!!error && <Text variant="error">{error}</Text>}
        <ButtonFooter>
          <Button
            type="primary"
            variant="l"
            label={{
              tx: errorMessage.msg
                ? 'sendScreen.insufficientFund'
                : 'common.send',
            }}
            onPress={handleSendPress}
            isBorderless={true}
            isActive={
              !errorMessage.msg &&
              new BigNumber(amountInput.value).gt(0) &&
              addressInput.value.length > 0
            }
            appendChildren={false}>
            <Box alignItems={'center'} justifyContent={'center'}>
              <ArrowUp
                width={scale(11)}
                height={scale(13)}
                stroke={faceliftPalette.white}
                style={styles.buttonIcon}
              />
            </Box>
          </Button>
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
    fontSize: scale(39),
    width: '80%',
  },
  sendToInput: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: scale(19),
  },
  textRegular: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 5,
  },
})

export default SendScreen
