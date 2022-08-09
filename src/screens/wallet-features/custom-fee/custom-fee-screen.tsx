import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, Text } from 'react-native'
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
//import { getSendAmountFee } from '@liquality/wallet-core/dist/utils/fees'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/walletOptions/defaultOptions'
//import { BigNumber } from '@liquality/types'

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

  /*  let totalFees = getSendAmountFee(
    accountForAsset?.id,
    code,
    route.params.amountInput,
  )
  console.log(totalFees, 'Total FEEs for bTC')

  console.log(
    accountForAsset?.id,
    code,
    route.params.amountInput,
    'what I send to GETAMOUNTSENDFEE()',
  ) */
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
    <View style={styles.container}>
      <View style={styles.block}>
        <View style={styles.rowEnd}>
          <AssetIcon asset={code} />
          <Text style={[styles.headerText, styles.headerTextFocused]}>
            {code}
          </Text>
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
          />
        </View>
      </View>
      <View style={styles.rest}>
        <View style={styles.row}>
          <Text style={[styles.label, styles.headerLabel]}>
            CUSTOMIZED SETTING
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.headerLabel]}>
            Gas Price{' '}
            <Text style={[styles.labelNormal, styles.headerLabel]}>
              $XX USD
            </Text>
          </Text>
        </View>
        <View style={styles.block}>
          <Text
            style={[styles.label, styles.headerLabel]}
            tx="customFeeScreen.customSettings"
          />
          <View style={styles.row}>
            <Text style={styles.label} tx="customFeeScreen.gasPrice" />
          </View>
          <View style={styles.row}>
            <Text style={styles.inputLabel}>SAT/B</Text>
            <TextInput
              style={styles.gasInput}
              onChangeText={customFeeInput.onChangeText}
              value={customFeeInput.value}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType="done"
            />
          </View>
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

        <View style={[styles.block, styles.row, styles.actions]}>
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
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  labelNormal: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
  },

  rest: {
    marginHorizontal: 20,
  },

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    marginRight: 5,
  },
  headerLabel: {
    marginVertical: 5,
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
    marginRight: 5,
  },
  gasInput: {
    marginTop: 5,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '90%',
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
