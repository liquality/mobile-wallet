import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import { FeeDetails } from '@liquality/types/lib/fees'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AssetIcon from '../../../components/asset-icon'
import {
  TotalFees,
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
import { FeeDetails as FDs } from '@chainify/types'
import Box from '../../../theme/box'
import Text from '../../../theme/text'
import { labelTranslateFn } from '../../../utils'

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
  const [gasFees, setGasFees] = useState<FDs>()
  const [totalFees, setTotalFees] = useState<TotalFees>()
  const [, setFormattedRatesObj] = useState()
  const [speedMode, setSpeedMode] = useState<SpeedMode>('average')

  const [, setError] = useState('')
  const [showBasic, setShowBasic] = useState<boolean>(true)
  var [userInputMinerTip, setUserInputMinerTip] = useState<string>('0')
  var [userInputMaximumFee, setUserInputMaximumFee] = useState<string>('0')

  const likelyWaitObj = {
    slow: labelTranslateFn('customFeeScreen.maybeIn30'),
    average: labelTranslateFn('customFeeScreen.likelyLess30'),
    fast: labelTranslateFn('customFeeScreen.likelyLess15'),
  }

  useEffect(() => {
    const _feeDetails = fees?.[activeNetwork]?.[activeWalletId]?.[code]
    if (!_feeDetails) {
      setError(labelTranslateFn('customFeeScreen.gasFeeMissing')!)
      return
    }
    setGasFees(_feeDetails)
    setUserInputMinerTip(
      _feeDetails[speedMode].fee.maxPriorityFeePerGas.toString(),
    )
    setSpeedMode(route.params.speedMode)
    setUserInputMaximumFee(_feeDetails[speedMode].fee.maxFeePerGas.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setError, fees, activeNetwork, activeWalletId, code])

  const code = route.params.code!
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
      const amtInpBg = new BigNumber(Number(route.params.amountInput))
      const totalFeesData = await getSendAmountFee(
        accountForAsset?.id!,
        code,
        amtInpBg,
      )
      setTotalFees(totalFeesData)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePressLowMedHigh = useCallback(
    (speed) => {
      setSpeedMode(speed)
    },
    [setSpeedMode],
  )

  const handleApplyPress = () => {
    navigation.navigate('SendScreen', {
      assetData: route.params.assetData,
      ...route.params,
      customFee: Number(userInputMinerTip) + Number(userInputMaximumFee),
      speed: speedMode,
    })
  }

  if (!gasFees) {
    return (
      <View style={styles.container}>
        <Text tx="common.load" />
      </View>
    )
  }

  const getMinerTipFiat = () => {
    const fiat = prettyFiatBalance(
      getSendFee(code, Number(userInputMinerTip) || 0),
      fiatRates[code],
    )
    return isNaN(Number(fiat)) ? 0 : fiat
  }

  const getMaxFiat = () => {
    const fiat = prettyFiatBalance(
      getSendFee(code, Number(userInputMaximumFee)),
      fiatRates[code],
    )
    return isNaN(Number(fiat)) ? 0 : fiat
  }

  const getSummaryMinimum = () => {
    if (totalFees) {
      const minimumFee =
        Number(userInputMinerTip) +
        Number(gasFees[speedMode].fee.suggestedBaseFeePerGas)
      const totalMinFee = getSendFee(code, Number(minimumFee)).plus(
        totalFees.slow,
      )
      return {
        amount: new BigNumber(totalMinFee).dp(6),
        fiat: prettyFiatBalance(totalFees.slow, fiatRates[code]),
      }
    }
  }
  const getSummaryMaximum = () => {
    if (totalFees) {
      const maximumFee = userInputMaximumFee

      const totalMaxFee = getSendFee(code, Number(maximumFee)).plus(
        totalFees.fast,
      )
      return {
        amount: new BigNumber(totalMaxFee).dp(6),
        fiat: prettyFiatBalance(totalFees.fast, fiatRates[code]),
      }
    }
  }

  let likelyIn30 = `~${labelTranslateFn('customFeeScreen.likelyLess30')}`
  let likelyIn15 = `~${labelTranslateFn('customFeeScreen.likelyLess15')}`
  let tilda = '~'

  const renderShowCustomized = () => {
    let tempFee = gasFees[speedMode].fee
    let suggestedBaseFeePerGas
    if (typeof tempFee !== 'number') {
      suggestedBaseFeePerGas = tempFee.suggestedBaseFeePerGas
    } else {
      suggestedBaseFeePerGas = tempFee
    }

    return (
      <View style={[styles.container, styles.fragmentContainer]}>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={[styles.label, styles.headerLabel]}>
              {`${labelTranslateFn('customFeeScreen.currentBaseFee')}`}
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                {`${labelTranslateFn('customFeeScreen.gasPrice')}`}
              </Text>
            </Text>

            <Text style={[styles.labelNormal, styles.headerLabel]}>
              {' '}
              GWEI {suggestedBaseFeePerGas}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, styles.headerLabel]}>
              {`${labelTranslateFn('customFeeScreen.minerTip')}`}
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                {`${labelTranslateFn('customFeeScreen.toSpeedUp')}`}
              </Text>
            </Text>
            <Text style={[styles.label, styles.headerLabel]}>
              {`${labelTranslateFn('customFeeScreen.maxFee')}`}
              <Text style={[styles.labelNormal, styles.headerLabel]}>
                {' '}
                {`${labelTranslateFn('customFeeScreen.maxFee')}`}
              </Text>
            </Text>
          </View>
          <View style={styles.rowEndFiat}>
            <Text style={[styles.fiat, styles.fiatFirst]}>
              ${getMinerTipFiat()}
            </Text>
            <Text style={styles.fiat}>${getMaxFiat()}</Text>
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
          <Box style={styles.rowEndBtn}>
            <Button
              label="Low"
              type={speedMode === 'slow' ? 'primary' : 'tertiary'}
              variant="s"
              isBorderless={false}
              isActive={true}
              onPress={() => handlePressLowMedHigh('slow')}
            />
            <Button
              label="Med"
              type={speedMode === 'average' ? 'primary' : 'tertiary'}
              variant="s"
              onPress={() => handlePressLowMedHigh('average')}
            />
            <Button
              label="High"
              type={speedMode === 'fast' ? 'primary' : 'tertiary'}
              variant="s"
              onPress={() => handlePressLowMedHigh('fast')}
            />
          </Box>
        </View>
        <Box marginTop={'xl'} style={[styles.block, styles.summary]}>
          <Text
            style={[styles.preset, styles.speed, styles.labelBold]}
            tx="customFeeScreen.newFeeTotal"
          />
          <Box flexDirection={'row'} marginTop="m">
            <Box flex={0.55}>
              <Text
                style={[styles.preset, styles.fiat]}
                tx="customFeeScreen.minimum"
              />
              <Text style={[styles.preset, styles.fiat, styles.fiatFast]}>
                {likelyIn30}
              </Text>

              <Text style={[styles.preset, styles.fiat]}>
                {tilda + getSummaryMinimum()?.amount}
              </Text>

              <Text style={[styles.preset, styles.fiat]}>
                {tilda + getSummaryMinimum()?.fiat + ' '}
                USD
              </Text>
            </Box>
            <Box flex={0.45}>
              <Text
                style={[styles.preset, styles.fiat, styles.maximum]}
                tx="customFeeScreen.maximum"
              />
              <Text
                style={[
                  styles.preset,
                  styles.fiat,
                  styles.fiatFast,
                  styles.maximum,
                ]}>
                {likelyIn15}
              </Text>
              <Text style={[styles.preset, styles.fiat, styles.maximum]}>
                {tilda + getSummaryMaximum()?.amount}
              </Text>
              <Text style={[styles.preset, styles.fiat, styles.maximum]}>
                {tilda + getSummaryMaximum()?.fiat + ' '}
                USD
              </Text>
            </Box>
          </Box>
        </Box>
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
          ) : (
            renderShowCustomized()
          )}
        </View>
      </View>
      <View style={[styles.row, styles.actions]}>
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
    alignItems: 'center',
    padding: 15,
  },
  rowEndBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
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
  },
  fiatFirst: {
    marginLeft: '37%',
  },
  maximum: {
    marginRight: '2%',
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
    alignSelf: 'flex-end',
  },
  gasInput: {
    marginTop: 5,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    width: '30%',
    textAlign: 'right',
    paddingBottom: 0,
    color: '#000D35',
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
