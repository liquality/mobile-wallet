import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  ViewStyle,
} from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
import AssetIcon from '../../../components/asset-icon'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, TotalFees } from '../../../types'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
import Preset from './preset'
import { useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  fiatRatesState,
  networkState,
} from '../../../atoms'
import {
  getSendTxFees,
  getSendFee,
} from '@liquality/wallet-core/dist/src/utils/fees'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BigNumber } from '@liquality/types'
import { FeeDetails as FDs } from '@chainify/types'
import { useInputState } from '../../../hooks'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src/utils/coinFormatter'

const scrollViewStyle: ViewStyle = {
  flex: 1,
}

type CustomFeeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendScreen'
>
type SpeedMode = keyof FeeDetails

const CustomFeeScreen = ({ navigation, route }: CustomFeeScreenProps) => {
  const [speedMode, setSpeedMode] = useState<SpeedMode>('average')
  const [gasFees, setGasFees] = useState<FDs>()
  const [totalFees, setTotalFees] = useState<TotalFees>()
  const [, setError] = useState('')
  const [, setFormattedRatesObj] = useState()

  const code = route.params.code!
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const customFeeInput = useInputState('0')

  const activeNetwork = useRecoilValue(networkState)
  const fiatRates = useRecoilValue(fiatRatesState)
  const accountForAsset = useRecoilValue(accountForAssetState(code))
  const { activeWalletId, fees } = wallet.state
  const feesForThisAsset = fees[activeNetwork]?.[activeWalletId]?.[code]
  const likelyWaitObj = {
    slow: feesForThisAsset?.slow.wait,
    average: feesForThisAsset?.average.wait,
    fast: feesForThisAsset?.fast.wait,
  }

  useEffect(() => {
    async function fetchData() {
      const amtInpBg = new BigNumber(Number(route.params.amountInput))
      const totalFeesData = await getSendTxFees(
        accountForAsset?.id!,
        code,
        amtInpBg,
      )
      setTotalFees(totalFeesData)
    }
    setSpeedMode(route.params.speedMode)

    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFormattedRatesObj, customFeeInput.value])

  const handleApplyPress = () => {
    if (route.params.speedUp) {
      navigation.goBack()
    } else {
      navigation.navigate('SendScreen', {
        assetData: route.params.assetData,
        ...route.params,
        customFee: parseFloat(customFeeInput.value),
        speed: speedMode,
      })
    }
  }

  useEffect(() => {
    const _feeDetails = fees?.[activeNetwork]?.[activeWalletId]?.[code]
    if (!_feeDetails) {
      setError('Gas fees missing')
      return
    }
    setGasFees(_feeDetails)
    if (gasFees) {
      customFeeInput.onChangeText(gasFees[speedMode].fee.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setError, fees, activeWalletId, activeNetwork, code, gasFees, speedMode])

  if (!gasFees) {
    return (
      <View style={styles.container}>
        <Text tx="common.load" />
      </View>
    )
  }
  const handleTextChange = (text: string) => {
    customFeeInput.onChangeText(text)
  }

  const getSummaryAmountAndFiat = () => {
    let amountInUnit = dpUI(
      getSendFee(code, Number(customFeeInput.value)),
      9,
    ).toString()

    return {
      amount: amountInUnit.toString(),
      fiat: prettyFiatBalance(Number(amountInUnit), fiatRates[code]).toString(),
    }
  }

  return (
    <Box flex={1} paddingVertical="l" backgroundColor="mainBackground">
      <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
        <View style={styles.block}>
          <View style={styles.rowEnd}>
            <AssetIcon asset={code} />
            <Text>{code}</Text>
          </View>
          <View style={styles.row}>
            <Preset
              EIP1559={false}
              customFeeInput={customFeeInput}
              gasFees={gasFees}
              code={code}
              fiatRates={fiatRates}
              speedMode={speedMode}
              setSpeedMode={setSpeedMode}
              setFormattedRatesObj={setFormattedRatesObj}
              fees={fees}
              activeNetwork={activeNetwork}
              activeWalletId={activeWalletId}
              accountAssetId={accountForAsset?.id}
              amountInput={route.params.amountInput}
              likelyWait={likelyWaitObj}
              totalFees={totalFees}
              fee={route.params.fee}
            />
          </View>
        </View>
        <View style={styles.rest}>
          <View style={styles.block}>
            <Text
              style={[styles.label, styles.headerLabel]}
              tx="customFeeScreen.customSettings"
            />
            <Box flexDirection="row" alignItems="flex-end">
              <Text style={styles.label} tx="customFeeScreen.gasPrice" />
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                $ {getSummaryAmountAndFiat().fiat} USD
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center">
              <Text style={styles.inputLabel}>
                {code === 'BTC' ? 'SAT/B' : 'GWEI'}
              </Text>
              <TextInput
                style={styles.gasInput}
                keyboardType={'numeric'}
                onChangeText={handleTextChange}
                value={customFeeInput.value}
                autoCorrect={false}
                autoCapitalize={'none'}
                returnKeyType="done"
              />
            </Box>
          </View>
          <View style={[styles.block, styles.summary]}>
            <Text
              style={[styles.preset, styles.speed]}
              tx="common.networkSpeed"
            />
            <Text
              style={[styles.preset, styles.amount]}
              tx="customFeeScreen.newSpeedFee"
            />
            <Text style={[styles.preset, styles.fiat]}>
              {getSummaryAmountAndFiat().amount} {code}
            </Text>
            <Text style={[styles.preset, styles.fiat]}>
              {getSummaryAmountAndFiat().fiat} USD
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.row, styles.actions]}>
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
          label={{ tx: 'common.apply' }}
          onPress={handleApplyPress}
          isBorderless={false}
          isActive={true}
        />
      </View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  labelNormal: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
  },

  rest: {
    paddingHorizontal: 20,
  },

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    marginRight: 5,
  },
  headerLabel: {
    marginTop: 5,
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
    marginVertical: 10,
  },
  summary: {
    backgroundColor: '#F0F7F9',
    borderColor: '#d9dfe5',
    borderWidth: 1,
    paddingVertical: 15,
    paddingLeft: 10,
    flexDirection: 'column',
  },
  inputLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  gasInput: {
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    textAlign: 'right',
    width: '85%',
    color: '#000D35',
    paddingBottom: 0,
    height: 35,
  },
  actions: {
    justifyContent: 'space-around',
  },
})

export default CustomFeeScreen
