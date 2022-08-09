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
import {
  AccountType,
  GasFees,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../../types'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import Box from '../../../theme/box'
/* import { useRecoilValue } from 'recoil'
import { fiatRatesState } from '../../atoms' */
import { fetchFeesForAsset } from '../../../store/store'
import Preset from './preset'
import { useRecoilValue } from 'recoil'
import {
  accountForAssetState,
  fiatRatesState,
  networkState,
} from '../../../atoms'
import { getSendAmountFee } from '@liquality/wallet-core/dist/utils/fees'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/walletOptions/defaultOptions'
//import { BigNumber } from '@liquality/types'

const scrollViewStyle: ViewStyle = {
  flex: 1,
}

type CustomFeeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SendScreen'
>
type SpeedMode = keyof FeeDetails
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const CustomFeeScreen = ({ navigation, route }: CustomFeeScreenProps) => {
  const [speedMode, setSpeedMode] = useState<SpeedMode>('average')
  const [gasFees, setGasFees] = useState<GasFees>()
  const [totalFees, setTotalFees] = useState({})

  const { code }: AccountType = route.params.assetData!
  //const fiatRates = useRecoilValue(fiatRatesState)
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
      var totalFeesData = await getSendAmountFee(
        accountForAsset?.id,
        code,
        route.params.amountInput,
      )
      setTotalFees(totalFeesData)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*   console.log(
    fees[activeNetwork]?.[activeWalletId]?.[code],
    'FEES fetched from wallet core for this asset',
  ) */
  const handleApplyPress = () => {
    navigation.navigate('SendScreen', {
      ...route.params,
      customFee: parseFloat(customFeeInput.value),
    })
  }

  useEffect(() => {
    fetchFeesForAsset(code).then(setGasFees)
  }, [code])

  if (!gasFees) {
    return (
      <View style={styles.container}>
        <Text tx="common.load" />
      </View>
    )
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
              fees={fees}
              activeNetwork={activeNetwork}
              activeWalletId={activeWalletId}
              accountAssetId={accountForAsset?.id}
              amountInput={route.params.amountInput}
              likelyWait={likelyWaitObj}
              totalFees={totalFees}
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
                $XX USD
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center">
              <Text style={styles.inputLabel}>SAT/B</Text>
              <TextInput
                style={styles.gasInput}
                onChangeText={customFeeInput.onChangeText}
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
            <Text style={[styles.preset, styles.amount]}>New Speed/Fee</Text>
            <Text style={[styles.preset, styles.fiat]}>BTC amount here</Text>
            <Text style={[styles.preset, styles.fiat]}>fiat amount here</Text>
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

  // eslint-disable-next-line react-native/no-unused-styles
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
