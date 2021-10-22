import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import LiqualityButton from '../../components/button'
import { NetworkEnum } from '../../core/config'
import { useAppSelector } from '../../hooks'
import { DataElementType } from '../../components/asset-flat-list'
import { FeeDetails } from '@liquality/types/lib/fees'
import { cryptoToFiat, formatFiat } from '../../core/utils/coin-formatter'
import { calculateGasFee } from '../../core/utils/fee-calculator'
import AssetIcon from '../../components/asset-icon'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { ChainId } from '@liquality/cryptoassets'

type CustomFeeScreenProps = StackScreenProps<RootStackParamList, 'SendScreen'>

const CustomFeeScreen = ({ navigation, route }: CustomFeeScreenProps) => {
  const [customFee, setCustomFee] = useState<number>(123)
  const [gasFees, setGasFees] = useState<FeeDetails>()
  const [error, setError] = useState('')
  const { code, chain = ChainId.Ethereum }: DataElementType =
    route.params.assetData!
  const {
    activeWalletId = '',
    activeNetwork = NetworkEnum.Testnet,
    fees,
    fiatRates,
  } = useAppSelector((state) => ({
    activeWalletId: state.activeWalletId,
    activeNetwork: state.activeNetwork,
    fees: state.fees,
    fiatRates: state.fiatRates,
  }))

  const handleApplyPress = () => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      customFee,
    })
  }

  useEffect(() => {
    const _feeDetails = fees?.[activeNetwork]?.[activeWalletId]?.[chain]
    if (!_feeDetails) {
      setError('Gas fees missing')
      return
    }

    setGasFees(_feeDetails)
  }, [fees, activeWalletId, activeNetwork, chain])

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.block}>
          <View style={styles.row}>
            <AssetIcon asset={code} />
            <Text style={styles.asset}>ETH</Text>
          </View>
          <Text style={styles.label}>PRESETS</Text>
          <View style={styles.row}>
            {['slow', 'average', 'fast'].map((speed, index) => {
              return (
                <View
                  style={[styles.col, index === 1 && styles.middleCol]}
                  key={speed}>
                  <Text style={[styles.preset, styles.speed]}>{speed}</Text>
                  <Text style={[styles.preset, styles.amount]}>
                    {gasFees &&
                      `${calculateGasFee(
                        code,
                        gasFees[speed as keyof FeeDetails].fee,
                      )} ${code}`}
                  </Text>
                  <Text style={[styles.preset, styles.fiat]}>
                    {fiatRates &&
                      gasFees &&
                      `${formatFiat(
                        cryptoToFiat(
                          calculateGasFee(
                            code,
                            gasFees[speed as keyof FeeDetails].fee,
                          ),
                          fiatRates[code],
                        ).toNumber(),
                      )} USD`}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>CUSTOMIZED SETTINGS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Gas Price</Text>
            <Text style={styles.fiat}> 0.12 USD</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.inputLabel}>GWEI</Text>
            <View style={styles.gasInput}>
              <Text style={styles.gasInput} onPress={() => setCustomFee(123)}>
                123
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.block, styles.summary]}>
          <Text style={[styles.preset, styles.speed]}>New Speed/Fee</Text>
          <Text style={[styles.preset, styles.amount]}>0.0000032 {code}</Text>
          <Text style={[styles.preset, styles.fiat]}>0.12 USD</Text>
        </View>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <View style={[styles.block, styles.row, styles.actions]}>
        <LiqualityButton
          text={'Cancel'}
          textColor={'#9D4DFA'}
          backgroundColor={'#F8FAFF'}
          width={152}
          action={navigation.goBack}
        />
        <LiqualityButton
          text={'Apply'}
          textColor={'#FFFFFF'}
          backgroundColor={'#9D4DFA'}
          width={152}
          action={handleApplyPress}
        />
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
    alignItems: 'center',
  },
  col: {
    paddingLeft: 5,
    borderColor: '#d9dfe5',
    borderWidth: 1,
  },
  middleCol: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  highlighted: {
    backgroundColor: '#F0F7F9',
  },
  asset: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 24,
    marginLeft: 5,
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    marginVertical: 10,
  },
  preset: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 26,
  },
  speed: {
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: 16,
  },
  fiat: {
    fontSize: 12,
  },
  block: {
    marginVertical: 15,
  },
  summary: {
    backgroundColor: '#F0F7F9',
    borderColor: '#d9dfe5',
    borderWidth: 1,
    paddingVertical: 15,
    paddingLeft: 10,
  },
  inputLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 26,
    marginRight: 5,
  },
  gasInput: {
    width: '80%',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  actions: {
    justifyContent: 'space-around',
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

export default CustomFeeScreen
