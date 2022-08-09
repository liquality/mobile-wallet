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
import {
  accountForAssetState,
  fiatRatesState,
  networkState,
} from '../../../atoms'
import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/walletOptions/defaultOptions' // Default options

import Preset from './preset'
import {
  getSendAmountFee,
  getSendFee,
} from '@liquality/wallet-core/dist/utils/fees'
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
  const [totalFees, setTotalFees] = useState({})

  const [setError] = useState('')
  const [showBasic, setShowBasic] = useState<boolean>(true)
  var formattedMinerTip = ''
  var formattedMaximumFee = ''
  const likelyWaitObj = {
    slow: 'maybe in 30',
    average: 'likely in < 30',
    fast: 'likely in < 15',
  }

  var [userInputMinerTip, setUserInputMinerTip] =
    useState<string>(formattedMinerTip)
  var [userInputMaximumFee, setUserInputMaximumFee] =
    useState<string>(formattedMaximumFee)
  const [minerTip, setMinerTip] = useState()

  if (gasFees && minerTip) {
    var minerTipVar = gasFees[speedMode].fee.maxPriorityFeePerGas
    var maximumFee = gasFees[speedMode].fee.maxFeePerGas
    formattedMinerTip = new BigNumber(minerTip).toString()
    formattedMaximumFee = new BigNumber(maximumFee).toString()
  }

  useEffect(() => {
    if (userInputMaximumFee === '' || (userInputMaximumFee === '' && gasFees)) {
      setUserInputMaximumFee(formattedMaximumFee)
      setUserInputMinerTip(formattedMinerTip)
      setMinerTip(minerTipVar)
    }
  }, [
    userInputMaximumFee,
    userInputMinerTip,
    formattedMaximumFee,
    formattedMinerTip,
    minerTip,
    gasFees,
    speedMode,
    minerTipVar,
  ])

  const { code }: AssetDataElementType = route.params.assetData!
  const wallet = setupWallet({
    ...defaultOptions,
  })
  const activeNetwork = useRecoilValue(networkState)
  const accountForAsset = useRecoilValue(accountForAssetState(code))

  const { activeWalletId, fees } = wallet.state
  const fiatRates = useRecoilValue(fiatRatesState)
  const customFeeInput = useInputState(
    `${fees?.[activeNetwork]?.[activeWalletId]?.[code].average.fee || '0'}`,
  )

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
  }, [])

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
    let minOrMaxFee
    let totalMinOrMaxFee
    if (type === 'max') {
      minOrMaxFee = maximumFee
      totalMinOrMaxFee = getSendFee(
        code,
        new BigNumber(minOrMaxFee).plus(totalFees._W.fast),
      )
    } else {
      minOrMaxFee = minerTip + gasFees[speedMode].fee.suggestedBaseFeePerGas

      totalMinOrMaxFee = getSendFee(
        code,
        new BigNumber(minOrMaxFee).plus(totalFees._W.slow),
      )
    }
    return {
      amount: new BigNumber(totalMinOrMaxFee).dp(6),
      fiat: prettyFiatBalance(totalFees._W.slow, fiatRates[code]),
    }
  }

  let likelyIn30 = '~likely in < 30 sec'
  let likelyIn15 = '~likely in < 15 sec'
  let summaryMinimum = renderSummaryMaxOrMinAmountAndFiat('min')
  let summaryMaximum = renderSummaryMaxOrMinAmountAndFiat('max')
  let tilda = '~'

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
              onChangeText={setUserInputMinerTip}
              value={userInputMinerTip}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType="done"
            />
            <Text style={styles.inputLabel}>GWEI</Text>
            <TextInput
              style={styles.gasInput}
              onChangeText={setUserInputMaximumFee}
              value={userInputMaximumFee}
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
            <Text style={[styles.preset, styles.fiat, styles.maximum]}>
              maximum
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat, styles.fiatFast]}>
              {likelyIn30}
            </Text>
            <Text
              style={[
                styles.preset,
                styles.fiat,
                styles.fiatFast,
                styles.maximum,
              ]}>
              {likelyIn15}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat]}>
              {tilda + summaryMinimum.amount.toString()}
            </Text>
            <Text style={[styles.preset, styles.fiat, styles.maximum]}>
              {tilda + summaryMaximum.amount.toString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.preset, styles.fiat]}>
              {tilda + summaryMinimum.fiat.toString()} USD
            </Text>
            <Text style={[styles.preset, styles.fiat, styles.maximum]}>
              {tilda + summaryMaximum.fiat.toString()} USD
            </Text>
          </View>
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
          {showBasic ? (
            <Preset
              EIP1559={true}
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
  maximum: {
    marginRight: '2%',
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
