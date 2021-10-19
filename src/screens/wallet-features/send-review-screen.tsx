import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import LiqualityButton from '../../components/button'
import { prettyFiatBalance } from '../../core/utils/coinFormatter'
import { useAppSelector } from '../../hooks'

type SendReviewScreenProps = StackScreenProps<
  RootStackParamList,
  'SendReviewScreen'
>

const SendReviewScreen = ({ navigation, route }: SendReviewScreenProps) => {
  const { asset, destinationAddress, gasFee, amount } =
    route.params.sendTransaction
  const [rate, setRate] = useState<number>(0)
  const [error, setError] = useState('')
  const { fiatRates } = useAppSelector((state) => ({
    fiatRates: state.fiatRates,
  }))

  const handleSendPress = () => {}

  const handleEditPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    if (!fiatRates || !fiatRates[asset]) {
      setError('Rates not available')
    } else {
      setRate(fiatRates[asset])
    }
  }, [fiatRates, asset])

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.sendLabel}>SEND</Text>
        <View style={styles.row}>
          <Text style={styles.amountInNative}>
            {`${amount.dp(6)} ${asset}`}
          </Text>
          <Text style={styles.amountInFiat}>{`$${prettyFiatBalance(
            amount.toNumber(),
            rate,
          )}`}</Text>
        </View>
        <Text style={styles.feeLabel}>NETWORK FEE</Text>
        <View style={styles.row}>
          <Text style={styles.feeAmountInNative}>{`${gasFee.dp(
            6,
          )} ${asset}`}</Text>
          <Text style={styles.feeAmountInFiat}>{`$${prettyFiatBalance(
            gasFee.toNumber(),
            rate,
          )}`}</Text>
        </View>

        <Text style={styles.totalLabel}>AMOUNT + FEES</Text>
        <View style={styles.row}>
          <Text style={styles.totalAmount}>{`${amount
            .plus(gasFee)
            .dp(6)} ${asset}`}</Text>
          <Text style={styles.totalAmount}>{`$${prettyFiatBalance(
            amount.plus(gasFee).toNumber(),
            rate,
          )}`}</Text>
        </View>

        <Text style={[styles.sendLabel, styles.sendToLabel]}>SEND TO</Text>
        <Text style={styles.address}>{destinationAddress}</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View>
        <View style={styles.row}>
          <LiqualityButton
            text={'Edit'}
            textColor={'#9D4DFA'}
            backgroundColor={'#F8FAFF'}
            width={152}
            action={handleEditPress}
          />
          <LiqualityButton
            text={`Send ${asset}`}
            textColor={'#FFFFFF'}
            backgroundColor={'#9D4DFA'}
            width={152}
            action={handleSendPress}
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
  sendLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#3D4767',
    marginTop: 15,
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
  feeLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#9A99A2',
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
  totalLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#9A99A2',
    marginTop: 25,
  },
  totalAmount: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 18,
    color: '#1D1E21',
  },
  sendToLabel: {
    marginTop: 40,
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#000D35',
  },
  error: {
    fontFamily: 'Montserrat-Light',
    color: '#F12274',
    fontSize: 12,
    backgroundColor: '#FFF',
    textAlignVertical: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingVertical: 5,
    height: 25,
  },
})

export default SendReviewScreen
