import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { UseInputStateReturnType, LikelyWait, TotalFees } from '../../../types'
import {
  getSendFee,
  maxFeePerUnitEIP1559,
} from '@liquality/wallet-core/dist/src/utils/fees'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/src//utils/coinFormatter'
import { FeeDetails } from '@liquality/types/lib/fees'
import { FiatRates, Network } from '@liquality/wallet-core/dist/src/store/types'
import { FeeDetails as FDs } from '@chainify/types'
import { labelTranslateFn } from '../../../utils'

type SpeedMode = keyof FeeDetails

type FeesProp = {
  mainnet?: Record<string, Record<string, FDs>> | undefined
  testnet?: Record<string, Record<string, FDs>> | undefined
}

const Preset = ({
  EIP1559,
  customFeeInput,
  gasFees,
  code,
  fiatRates,
  speedMode,
  setSpeedMode,
  setFormattedRatesObj,
  likelyWait,
  totalFees,
  fee,
  setUserInputMaximumFee,
  setUserInputMinerTip,
}: {
  EIP1559: boolean
  customFeeInput: UseInputStateReturnType<string>
  gasFees: FDs
  code: string
  fiatRates: FiatRates
  speedMode: string
  setSpeedMode: React.Dispatch<React.SetStateAction<keyof FeeDetails>>
  fees?: FeesProp
  activeNetwork?: Network
  activeWalletId?: string
  accountAssetId: string | undefined
  amountInput?: string | undefined
  likelyWait?: LikelyWait | undefined
  totalFees: TotalFees | undefined
}) => {
  useEffect(() => {
    if (gasFees) {
      let formattedRates = renderSlowAverageFastPreset(speedMode)
      setFormattedRatesObj(formattedRates)
      setSpeedMode(speedMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedMode, setFormattedRatesObj, totalFees])
  const renderEstimationSpeed = (speed: string) => {
    if (speed === 'slow') {
      return '~' + likelyWait?.slow + ' sec'
    } else if (speed === 'average') {
      return '~' + likelyWait?.average + ' sec'
    } else return '~' + likelyWait?.fast + ' sec'
  }

  const renderSlowAverageFastPreset = (speed: string) => {
    //A bit ugly/messy, may refactor later
    let preset
    let totalFeesSpeed
    let feeInSatOrGwei
    if (speed === 'slow') {
      preset = gasFees?.slow || null
      totalFeesSpeed = totalFees?.slow || null
      feeInSatOrGwei = fee.slow || fee
    } else if (speed === 'average') {
      preset = gasFees?.average || null
      totalFeesSpeed = totalFees?.average || null
      feeInSatOrGwei = fee.average || fee
    } else {
      preset = gasFees?.fast || null
      totalFeesSpeed = totalFees?.fast || null
      feeInSatOrGwei = fee.fast || fee
    }

    if (EIP1559) {
      const gasFeeForSpeed = preset.fee
      const maxSendFee = getSendFee(code, maxFeePerUnitEIP1559(gasFeeForSpeed))

      let amountInNative = dpUI(
        getSendFee(code, feeInSatOrGwei.toNumber()),
        6,
      ).toString()
      let fiat = prettyFiatBalance(totalFeesSpeed, fiatRates[code])
      return {
        amount: amountInNative,
        fiat: fiat.toString(),
        maximum: prettyFiatBalance(maxSendFee, fiatRates[code]).toString(),
      }
    } else {
      let amountInNative = dpUI(
        getSendFee(code, feeInSatOrGwei.toNumber()),
        9,
      ).toString()

      let formattedRatesObj = {
        amount: amountInNative,
        fiat: prettyFiatBalance(
          Number(amountInNative),
          fiatRates[code],
        ).toString(),
        maximum: labelTranslateFn('customFeeScreen.maxHere'),
      }
      return formattedRatesObj
    }
  }

  const handleChangeSpeedPress = (speed: string) => {
    setSpeedMode(speed as SpeedMode)
    if (EIP1559) {
      setUserInputMaximumFee(
        gasFees[speed as SpeedMode].fee.maxFeePerGas.toString(),
      )
      setUserInputMinerTip(
        gasFees[speed as SpeedMode].fee.maxPriorityFeePerGas.toString(),
      )
    } else {
      if (gasFees && code) {
        customFeeInput.onChangeText(gasFees[speed as SpeedMode].fee.toString())
      }
    }
  }

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>PRESETS</Text>
      <View style={styles.row}>
        {gasFees &&
          Object.keys(gasFees).map((speed, index) => {
            var preset = renderSlowAverageFastPreset(speed)

            if (speed === 'custom') return null
            return (
              <Pressable
                style={[
                  styles.col,
                  index === 1 && styles.middleCol,
                  speed === speedMode && styles.selected,
                ]}
                key={speed}
                onPress={() => handleChangeSpeedPress(speed)}>
                <Text style={[styles.preset, styles.speed]}>{speed}</Text>
                {likelyWait && likelyWait.slow ? (
                  <Text
                    style={[
                      styles.preset,
                      styles.fiat,
                      speed === 'slow' ? styles.fiatSlow : styles.fiatFast,
                    ]}>
                    {renderEstimationSpeed(speed)}
                  </Text>
                ) : null}

                <Text style={[styles.preset, styles.amount]}>
                  {preset?.amount} in {code}
                </Text>
                <Text style={[styles.preset, styles.fiat]}>
                  {preset?.fiat} USD
                </Text>
                {EIP1559 ? (
                  <Text style={[styles.preset, styles.fiat]}>
                    Max {preset?.maximum} USD
                  </Text>
                ) : null}
              </Pressable>
            )
          })}
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

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
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
  fiatFast: {
    color: '#088513',
  },
  fiatSlow: {
    color: '#ff007a',
  },
  amount: {
    fontSize: 16,
  },
  selected: {
    backgroundColor: '#F0F7F9',
  },
})

export default Preset
