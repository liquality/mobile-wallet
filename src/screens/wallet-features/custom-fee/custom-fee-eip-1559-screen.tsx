import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
/* import {
  cryptoToFiat,
  formatFiat,
} from '@liquality/wallet-core/dist/utils/coinFormatter' */
import { NativeStackScreenProps } from '@react-navigation/native-stack'

/* import { calculateGasFee } from '../../../core/utils/fee-calculator'
 */ import AssetIcon from '../../../components/asset-icon'
import {
  AssetDataElementType,
  GasFees,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../../types'
import Button from '../../../theme/button'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/walletOptions/defaultOptions' // Default options

type CustomFeeEIP1559ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CustomFeeEIP1559Screen'
>
type SpeedMode = keyof FeeDetails
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)

  return { value, onChangeText: setValue }
}

const CustomFeeEIP1559Screen = ({
  navigation,
  route,
}: CustomFeeEIP1559ScreenProps) => {
  const [speedMode, setSpeedMode] = useState<SpeedMode>('average')
  const [gasFees, setGasFees] = useState<GasFees>()
  const [setError] = useState('')
  const [showBasic, setShowBasic] = useState<boolean>(true)

  const { code }: AssetDataElementType = route.params.assetData!

  const wallet = setupWallet({
    ...defaultOptions,
  })

  const activeNetwork = useRecoilValue(networkState)
  //There should be walletid & fees in wallet state?
  /*   accounts: state.accounts,
  walletId: state.activeWalletId,
  activeNetwork: state.activeNetwork,
  fiatRates: state.fiatRates,
  fees: state.fees,
  history: state.history, */
  const { activeWalletId, fees } = wallet.state
  //const fiatRates = useRecoilValue(fiatRatesState)

  /*   console.log('Active network:', activeNetwork)
  console.log('Wallet state ID:', activeWalletId, 'and fees:', fees)
  console.log('Fiat rates:', fiatRates) */

  const customFeeInput = useInputState(
    `${fees?.[activeNetwork]?.[activeWalletId]?.[code].average.fee || '0'}`,
  )

  const handleApplyPress = () => {
    navigation.navigate('SendScreen', {
      ...route.params,
      customFee: parseFloat(customFeeInput.value),
    })
  }

  useEffect(() => {
    const _feeDetails = fees?.[activeNetwork]?.[activeWalletId]?.[code]
    if (!_feeDetails) {
      setError('Gas fees missing')
      return
    }
    //console.log(_feeDetails, 'wats feedetails?')
    setGasFees(_feeDetails)
  }, [setError, fees, activeWalletId, activeNetwork, code])

  if (!gasFees) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const renderShowBasic = () => {
    return (
      <View style={[styles.container, styles.fragmentContainer]}>
        <Text style={[styles.label, styles.headerLabel]}>PRESETS</Text>
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
    )
  }

  const renderShowCustomized = () => {
    return (
      <View style={[styles.container, styles.fragmentContainer]}>
        <View style={styles.block}>
          <Text style={[styles.label, styles.headerLabel]}>
            CURRENT BASE FEE
            <Text style={[styles.labelNormal, styles.headerLabel]}>
              {' '}
              PER GAS
            </Text>
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, styles.headerLabel]}>
              MINER TIP
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                TO SPEED UP
              </Text>
            </Text>
            <Text style={[styles.label, styles.headerLabel]}>
              MAX FEE
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                PER GAS
              </Text>
            </Text>
          </View>
          <View style={styles.rowEndFiat}>
            <Text style={[styles.fiat, styles.fiatFirst]}>
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
              $9.11
            </Text>
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
              $9.11
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
          <View style={styles.rowEndBtn}>
            <Button
              label="Low"
              type="tertiary"
              variant="s"
              onPress={handleApplyPress}
            />
            <Button
              label="Med"
              type="tertiary"
              variant="s"
              onPress={handleApplyPress}
            />
            <Button
              label="High"
              type="tertiary"
              variant="s"
              onPress={handleApplyPress}
            />
          </View>
        </View>
        <Text style={[styles.label, styles.headerLabel]}>GAS LIMIT</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.gasInput}
            onChangeText={customFeeInput.onChangeText}
            value={customFeeInput.value}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType="done"
          />
        </View>

        <View style={[styles.block, styles.summary]}>
          <Text style={[styles.preset, styles.speed]}>New Speed/Fee</Text>
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
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <View style={styles.tabsBlock}>
          <Pressable
            style={[styles.tabHeader, showBasic && styles.headerFocused]}
            onPress={() => setShowBasic(!showBasic)}>
            <Text
              style={[
                styles.headerText,
                showBasic && styles.headerTextFocused,
              ]}>
              BASIC
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabHeader, !showBasic && styles.headerFocused]}
            onPress={() => setShowBasic(!showBasic)}>
            <Text
              style={[
                styles.headerText,
                !showBasic && styles.headerTextFocused,
              ]}>
              CUSTOMIZE
            </Text>
          </Pressable>
        </View>
        <View style={styles.rowEnd}>
          <AssetIcon asset={code} />
          <Text style={[styles.headerText, styles.headerTextFocused]}>
            {code}
          </Text>
        </View>
        <View style={styles.row}>
          {showBasic ? renderShowBasic() : renderShowCustomized()}
        </View>
        <View style={[styles.block, styles.row, styles.actions]}>
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
            label="Apply"
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
  rowEndBtn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },

  rowEndFiat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    paddingLeft: 5,
    borderColor: '#d9dfe5',
    borderWidth: 1,
    width: '33%',
  },
  middleCol: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '33%',
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
  },
  labelNormal: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
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
    marginTop: 5,
  },
  fiatFirst: {
    marginLeft: '37%',
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
    width: '30%',
  },
  actions: {
    justifyContent: 'space-around',
  },
  selected: {
    backgroundColor: '#F0F7F9',
  },

  tabsBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D9DFE5',
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#D9DFE5',
  },
  headerTextFocused: {
    color: '#000',
  },
})

export default CustomFeeEIP1559Screen
