import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AssetIcon from '../../../components/asset-icon'
import {
  AssetDataElementType,
  GasFees,
  RootStackParamList,
  UseInputStateReturnType,
} from '../../../types'
import Button from '../../../theme/button'
import { useRecoilValue } from 'recoil'
import { fiatRatesState, networkState } from '../../../atoms'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/walletOptions/defaultOptions' // Default options

import Preset from './preset'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'
import { BigNumber } from '@liquality/types'

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
  if (gasFees) {
    var minerTip = gasFees[speedMode].fee.maxPriorityFeePerGas
    var maximumFee = gasFees[speedMode].fee.maxFeePerGas
    var formattedMinerTip = new BigNumber(minerTip).toString()
    var formattedMaximumFee = new BigNumber(maximumFee).toString()
    /*     var [userInputMinerTip, setUserInputMinerTip] =
      useState<string>(formattedMinerTip)

    var [userInputMaximumFee, setUserInputMaximumFee] =
      useState<string>(formattedMaximumFee) */
  }

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
  const fiatRates = useRecoilValue(fiatRatesState)

  /*   console.log('Active network:', activeNetwork)
  console.log('Wallet state ID:', activeWalletId, 'and fees:', fees)
  console.log('Fiat rates:', fiatRates)
  console.log(code, 'what is code? (from assetData)')
  console.log(wallet.state, 'WALLET STATE') */

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
    setGasFees(_feeDetails)
  }, [setError, fees, activeWalletId, activeNetwork, code])

  if (!gasFees) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const getMinerTip = () => {
    const fiat = prettyFiatBalance(getSendFee(code, minerTip), fiatRates[code])
    return isNaN(fiat) ? 0 : fiat
  }

  const maxFiat = () => {
    const fiat = prettyFiatBalance(
      getSendFee(code, maximumFee),
      fiatRates[code],
    )
    return isNaN(fiat) ? 0 : fiat
  }

  const renderSummaryMaxOrMinAmountAndFiat = (type: string) => {
    //TODO totalfees needs to be fetched from wallet-core
    let minOrMaxFee
    let totalMinOrMaxFee
    if (type === 'max') {
      minOrMaxFee = maximumFee
      //totalMinOrMaxFee = getSendFee(code, minOrMaxFee.plus(totalFees.fast))
    } else {
      minOrMaxFee = minerTip + gasFees[speedMode].fee.suggestedBaseFeePerGas
      //totalMinOrMaxFee = getSendFee(code, minOrMaxFee.plus(totalFees.fast))
    }
    return {
      // amount: new BigNumber(totalMinOrMaxFee).dp(6),
      // fiat: prettyFiatBalance(totalFees.slow, fiatRates[code])
    }
  }

  let likelyIn30 = '~likely in < 30 sec'
  let likelyIn15 = '~likely in < 15 sec'

  const renderShowCustomized = () => {
    return (
      <View style={[styles.container, styles.fragmentContainer]}>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={[styles.label, styles.headerLabel]}>
              CURRENT BASE FEE
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                PER GAS
              </Text>
            </Text>

            <Text style={[styles.labelNormal, styles.headerLabel]}>
              {' '}
              GWEI {gasFees[speedMode].fee.suggestedBaseFeePerGas}
            </Text>
          </View>
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
              ${getMinerTip()}
            </Text>
            <Text style={styles.fiat}>${maxFiat()}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.inputLabel}>GWEI</Text>
            <TextInput
              style={styles.gasInput}
              onChangeText={customFeeInput.onChangeText}
              value={'hej'}
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

        <View style={[styles.block, styles.summary]}>
          <Text style={[styles.preset, styles.speed, styles.labelBold]}>
            New Fee Total
          </Text>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat]}>minimum</Text>
            <Text style={[styles.preset, styles.fiat]}>maximum</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat, styles.fiatFast]}>
              {likelyIn30}
            </Text>
            <Text style={[styles.preset, styles.fiat, styles.fiatFast]}>
              {likelyIn15}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat]}>minimum</Text>
            <Text style={[styles.preset, styles.fiat]}>maximum</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat]}>minimum</Text>
            <Text style={[styles.preset, styles.fiat]}>maximum</Text>
          </View>
        </View>

        {/*        <div class="custom-fee-result" id="custom_speed_fee_results">
          <div class="custom-fee-result-title">New Fee Total</div>
          <div class="custom-fee-estimation">
            <div>
              <span>minimum</span>
              <span>~Likely in &lt; 30 sec</span>
              <div class="custom-fee-result-amount">~{{ minimum.amount }}</div>
              <div class="custom-fee-result-fiat" v-if="minimum.fiat">~{{ minimum.fiat }} USD</div>
            </div>
            <div>
              <span>maximum</span>
              <span>~Likely in &lt; 15 sec</span>
              <div class="custom-fee-result-amount">~{{ maximum.amount }}</div>
              <div class="custom-fee-result-fiat" v-if="maximum.fiat">~{{ maximum.fiat }} USD</div>
            </div>
          </div>
        </div> */}
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
          {showBasic ? (
            <Preset
              customFeeInput={customFeeInput}
              gasFees={gasFees}
              code={code}
              fiatRates={fiatRates}
              speedMode={speedMode}
              setSpeedMode={setSpeedMode}
              fees={fees}
              activeNetwork={activeNetwork}
              activeWalletId={activeWalletId}
            />
          ) : (
            renderShowCustomized()
          )}
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
  labelBold: {
    fontWeight: '700',
  },
  headerLabel: {
    marginVertical: 10,
  },
  preset: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 18,
  },
  speed: {
    textTransform: 'capitalize',
  },
  fiat: {
    fontSize: 12,
    marginTop: 5,
  },

  amount: {
    fontSize: 16,
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
    width: '30%',
  },
  actions: {
    justifyContent: 'space-around',
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
  fiatFast: {
    color: '#088513',
  },
})

export default CustomFeeEIP1559Screen
