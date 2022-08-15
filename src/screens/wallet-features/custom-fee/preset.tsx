import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { UseInputStateReturnType, LikelyWait, TotalFees } from '../../../types'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'
import {
  dpUI,
  prettyFiatBalance,
} from '@liquality/wallet-core/dist/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { FiatRates, Network } from '@liquality/wallet-core/dist/store/types'
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
    let preset
    if (speed === 'slow') {
      preset = gasFees?.slow || null
    } else if (speed === 'average') {
      preset = gasFees?.average || null
    } else {
      preset = gasFees?.fast || null
    }
    if (EIP1559) {
      let slowAvgOrMaxFees = preset.fee
      let maxFeePerGas = 0
      if (typeof slowAvgOrMaxFees !== 'number') {
        maxFeePerGas =
          slowAvgOrMaxFees.suggestedBaseFeePerGas ||
          0 + slowAvgOrMaxFees.maxPriorityFeePerGas
      }

      //HÄÄÄÄÄR i amount fel

      let formattedRatesForEIP1559Obj = {
        amount: dpUI(
          getSendFee(code, gasFees[speed].fee.maxFeePerGas || fee.toNumber()),
          9,
        ).toString(),
        fiat: prettyFiatBalance(
          totalFees ? totalFees[speed as keyof TotalFees] : new BigNumber(0),
          fiatRates[code],
        ).toString(),
        maximum: prettyFiatBalance(
          getSendFee(code, maxFeePerGas),
          fiatRates[code],
        ).toString(),
      }
      return formattedRatesForEIP1559Obj
    } else {
      let amountInUnit = dpUI(getSendFee(code, fee.toNumber()), 9).toString()

      let formattedRatesObj = {
        amount: amountInUnit,
        fiat: prettyFiatBalance(amountInUnit, fiatRates[code]).toString(),
        maximum: labelTranslateFn('customFeeScreen.maxHere'),
      }
      return formattedRatesObj
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
                onPress={() => {
                  setSpeedMode(speed as SpeedMode)
                  if (gasFees && code) {
                    customFeeInput.onChangeText(
                      gasFees[speed as SpeedMode].fee.toString(),
                    )
                  }
                }}>
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