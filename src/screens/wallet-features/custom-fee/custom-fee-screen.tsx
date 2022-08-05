import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
/* import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/utils/coinFormatter' */
//import { calculateGasFee } from '../../core/utils/fee-calculator'
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
  const customFeeInput = useInputState('0')

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
      <View>
        <View style={styles.block}>
          <View style={styles.row}>
            <AssetIcon asset={code} />
            <Text style={styles.asset}>ETH</Text>
          </View>
          <Text
            style={[styles.label, styles.headerLabel]}
            tx="customFeeScreen.presets"
          />
          <View style={styles.row}>
            {gasFees &&
              Object.keys(gasFees).map((speed, index) => {
                return (
                  <Pressable
                    style={[
                      styles.col,
                      index === 1 && styles.middleCol,
                      speed === speedMode && styles.selected,
                    ]}
                    key={speed}
                    onPress={() => {
                      setSpeedMode(speed as SpeedMode)
                      if (gasFees && code) {
                        customFeeInput.onChangeText(
                          gasFees[speed as SpeedMode].toString(),
                        )
                      }
                    }}>
                    <Text style={[styles.preset, styles.speed]}>{speed}</Text>
                    <Text style={[styles.preset, styles.amount]}>
                      {/*   {gasFees &&
                        code &&
                        `${calculateGasFee(
                          code,
                          gasFees[speed as keyof FeeDetails].toNumber(),
                        )} ${code}`} */}
                      NAN
                    </Text>
                    <Text style={[styles.preset, styles.fiat]}>
                      USD
                      {/*  {fiatRates &&
                        gasFees &&
                        code &&
                        `${formatFiat(
                          new BigNumber(
                            cryptoToFiat(
                              calculateGasFee(
                                code,
                                gasFees[speed as keyof FeeDetails].toNumber(),
                              ),
                              fiatRates[code],
                            ),
                          ),
                        )} USD`} */}
                    </Text>
                  </Pressable>
                )
              })}
          </View>
        </View>

        <View style={styles.block}>
          <Text
            style={[styles.label, styles.headerLabel]}
            tx="customFeeScreen.customSettings"
          />
          <View style={styles.row}>
            <Text style={styles.label} tx="customFeeScreen.gasPrice" />
            <Text style={styles.fiat}>
              {/*    {code &&
                fiatRates &&
                parseFloat(customFeeInput.value) > 0 &&
                `$${formatFiat(
                  new BigNumber(
                    cryptoToFiat(
                      calculateGasFee(code, parseFloat(customFeeInput.value)),
                      fiatRates[code],
                    ),
                  ),
                )}`} */}
              NAN
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.inputLabel}>GWEI</Text>
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
          <Text style={[styles.preset, styles.amount]}>
            {/*          {code &&
              parseFloat(customFeeInput.value) > 0 &&
              `${calculateGasFee(
                code,
                parseFloat(customFeeInput.value),
              )} ${code}`} */}
            NAN
          </Text>
          <Text style={[styles.preset, styles.fiat]}>
            {/*    {code &&
              fiatRates &&
              parseFloat(customFeeInput.value) > 0 &&
              `$${formatFiat(
                new BigNumber(
                  cryptoToFiat(
                    calculateGasFee(code, parseFloat(customFeeInput.value)),
                    fiatRates[code],
                  ),
                ),
              )}`} */}
            NAN
          </Text>
        </View>
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
    alignItems: 'center',
  },
  col: {
    paddingLeft: 5,
    borderColor: '#d9dfe5',
    borderWidth: 1,
    width: '25%',
  },
  middleCol: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '25%',
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
    marginRight: 5,
  },
  headerLabel: {
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
  selected: {
    backgroundColor: '#F0F7F9',
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
