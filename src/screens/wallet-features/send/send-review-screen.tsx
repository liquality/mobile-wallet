import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'

import { useAppSelector } from '../../../hooks'
import { sendTransaction } from '../../../store/store'
import { assets as cryptoassets, currencyToUnit } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'

type SendReviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendReviewScreen'
>

const SendReviewScreen = ({ navigation, route }: SendReviewScreenProps) => {
  const { asset, destinationAddress, gasFee, amount, memo, speedLabel } =
    route.params.sendTransaction!
  const [rate, setRate] = useState<number>(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { fiatRates, activeNetwork } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
    activeNetwork: state.activeNetwork,
  }))

  const handleSendPress = async () => {
    setIsLoading(true)
    if (!asset || !destinationAddress || !amount || !gasFee || !activeNetwork) {
      setError('Input data invalid')
      return
    }

    try {
      const transaction = await sendTransaction({
        asset,
        activeNetwork,
        to: destinationAddress,
        value: new BigNumber(
          currencyToUnit(cryptoassets[asset], amount).toNumber(),
        ),
        fee: gasFee,
        feeLabel: speedLabel,
        memo: memo || '',
      })

      navigation.navigate('SendConfirmationScreen', {
        screenTitle: `SEND ${asset} Transaction Details`,
        sendTransactionConfirmation: transaction,
      })
    } catch (_error) {
      setIsLoading(false)
      setError('Failed to send transaction: ' + _error)
    }
  }

  const handleEditPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    if (!fiatRates || !asset || !fiatRates[asset]) {
      setError('Rates not available')
    } else {
      setRate(fiatRates[asset])
    }
  }, [fiatRates, asset])

  return (
    <View style={styles.container}>
      <Text variant="secondaryInputLabel">SEND</Text>
      <View style={styles.row}>
        <Text style={styles.amountInNative}>
          {amount && `${new BigNumber(amount).dp(6)} ${asset}`}
        </Text>
        <Text style={styles.amountInFiat}>
          {amount && `$${prettyFiatBalance(amount, rate)}`}
        </Text>
      </View>
      <Text variant="secondaryInputLabel">NETWORK FEE</Text>
      <View style={styles.row}>
        <Text style={styles.feeAmountInNative}>
          {asset && gasFee && dpUI(getSendFee(asset, gasFee), 9).toString()}
        </Text>
        <Text style={styles.feeAmountInFiat}>
          {gasFee &&
            asset &&
            `$${prettyFiatBalance(getSendFee(asset, gasFee).toNumber(), rate)}`}
        </Text>
      </View>

      <Text variant="secondaryInputLabel">AMOUNT + FEES</Text>
      <View style={styles.row}>
        <Text style={styles.totalAmount}>
          {amount &&
            gasFee &&
            asset &&
            `${new BigNumber(amount)
              .plus(getSendFee(asset, gasFee))
              .dp(9)} ${asset}`}
        </Text>
        <Text style={styles.totalAmount}>
          {amount &&
            gasFee &&
            asset &&
            `$${prettyFiatBalance(
              new BigNumber(amount).plus(getSendFee(asset, gasFee)).toNumber(),
              rate,
            )}`}
        </Text>
      </View>

      <Text variant="secondaryInputLabel">SEND TO</Text>
      <Text style={styles.address}>{destinationAddress}</Text>

      <Text variant="secondaryInputLabel">MEMO (OPTIONAL)</Text>
      <Text style={styles.address}>{memo}</Text>

      {!!error && <Text variant="error">{error}</Text>}
      <View>
        <View style={styles.row}>
          <Button
            type="secondary"
            variant="m"
            label="Edit"
            onPress={handleEditPress}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label={`Send ${asset}`}
            onPress={handleSendPress}
            isLoading={isLoading}
            isBorderless={false}
            isActive={true}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  amountInNative: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 28,
    lineHeight: 42,
    color: '#EAB300',
  },
  amountInFiat: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#646F85',
  },
  feeAmountInNative: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#000D35',
  },
  feeAmountInFiat: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 14,
    color: '#000D35',
  },
  totalAmount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#1D1E21',
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#000D35',
  },
})

export default SendReviewScreen
