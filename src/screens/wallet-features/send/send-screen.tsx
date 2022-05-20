import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'
import {
  assets as cryptoassets,
  ChainId,
  chains,
} from '@liquality/cryptoassets'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  NetworkFeeType,
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
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
import { chainDefaultColors } from '../../../core/config'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'
import SendFeeSelector from '../../../components/ui/send-fee-selector'
import { fetchFeesForAsset } from '../../../store/store'
import { FeeLabel } from '@liquality/wallet-core/dist/store/types'
import ButtonFooter from '../../../components/button-footer'
import { isNumber } from '../../../utils'

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type SendScreenProps = NativeStackScreenProps<RootStackParamList, 'SendScreen'>

const SendScreen: FC<SendScreenProps> = (props) => {
  const { navigation, route } = props
  //TODO is there a better way to deal with this?
  const {
    code = 'ETH',
    balance = 0,
    chain = ChainId.Ethereum,
  } = route.params.assetData || {}
  const [customFee, setCustomFee] = useState<number>(0)
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
      setError('Enter a valid amount')
      return false
    } else if (new BigNumber(amountInput.value).gt(new BigNumber(balance))) {
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
        calculateAvailableAmnt(code, route.params.customFee, balance),
      )
    }
  }, [balance, code, route.params.customFee])

  useEffect(() => {
    fetchFeesForAsset(code).then((gasFee) => {
      setFee(gasFee.average)
      setAvailableAmount(
        calculateAvailableAmnt(
          code,
          getSendFee(code, gasFee.average.toNumber()).toNumber(),
          balance,
        ),
      )
    })
  }, [code, fees, activeWalletId, activeNetwork, chain, balance])

  const handleReviewPress = useCallback(() => {
    if (validate() && networkFee?.current?.value) {
      navigation.navigate('SendReviewScreen', {
        screenTitle: `Send ${code} Review`,
        sendTransaction: {
          amount: new BigNumber(amountInput.value).toNumber(),
          gasFee: networkFee.current.value,
          speedLabel: networkFee.current?.speed,
          destinationAddress: addressInput.value,
          asset: code,
          memo: memoInput.value,
        },
      })
    }
  }, [
    addressInput.value,
    amountInput.value,
    code,
    memoInput.value,
    navigation,
    validate,
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
        setError('Invalid amount.')
        return
      }

      if (!fiatRates) {
        setError('Fiat rates missing!')
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
              <Text variant="amountLabel">Available</Text>
              <Text variant="amount">{` ${availableAmount} ${code}`}</Text>
            </Box>
            <Button
              label="Max"
              type="tertiary"
              variant="s"
              onPress={() =>
                amountInput.onChangeText(availableAmount.toString())
              }
            />
          </Box>
          <Box marginTop={'xl'}>
            <Text variant="secondaryInputLabel">SEND TO</Text>
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
                placeholder="Address"
                autoCorrect={false}
                returnKeyType="done"
              />
              <Pressable onPress={handleQRCodeBtnPress}>
                <FontAwesomeIcon icon={faQrcode} size={25} />
              </Pressable>
            </Box>
          </Box>
          <Box marginTop={'xl'}>
            <Text variant="secondaryInputLabel">MEMO (OPTIONAL)</Text>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end"
              marginBottom="m">
              <TextInput
                style={{
                  marginTop: 5,
                  borderColor: '#D9DFE5',
                  borderWidth: 1,
                  height: 150,
                  width: '100%',
                }}
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
            <FontAwesomeIcon
              icon={showFeeOptions ? faAngleDown : faAngleRight}
              size={15}
            />
            <Text variant="secondaryInputLabel">NETWORK SPEED/FEE</Text>
          </Pressable>
          {customFee ? (
            <Text style={styles.speedValue}>
              {`(Custom / ${dpUI(getSendFee(code, customFee), 9)} ${code})`}
            </Text>
          ) : (
            <Text style={styles.speedValue}>
              {`(${networkSpeed} / ${dpUI(
                getSendFee(code, networkFee.current?.value || fee.toNumber()),
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
})

export default SendScreen
