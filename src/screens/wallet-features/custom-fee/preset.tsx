import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { UseInputStateReturnType, GasFees, LikelyWait } from '../../../types'
import { getSendFee } from '@liquality/wallet-core/dist/utils/fees'
import { prettyFiatBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'
import { BigNumber } from '@liquality/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { FiatRates, Network } from '@liquality/wallet-core/dist/store/types'
import { FeeDetails as FD } from '@chainify/types'

type SpeedMode = keyof FeeDetails

type FeesProp = {
  mainnet?: Record<string, Record<string, FD>> | undefined
  testnet?: Record<string, Record<string, FD>> | undefined
}

const Preset = ({
  EIP1559,
  customFeeInput,
  gasFees,
  code,
  fiatRates,
  speedMode,
  setSpeedMode,

  likelyWait,
  totalFees,
}: {
  EIP1559: boolean
  customFeeInput: UseInputStateReturnType<string>
  gasFees: GasFees
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
  totalFees: Object
}) => {
  /*   console.log(
    EIP1559,
    customFeeInput,
    gasFees,
    code,
    fiatRates,
    speedMode,
    setSpeedMode,
    accountAssetId,
    amountInput,
    'Preset PROPS in EIP1559 T/F?',
    EIP1559,
  ) */
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
      const defaultFee =
        preset.fee?.suggestedBaseFeePerGas + preset.fee?.maxPriorityFeePerGas ||
        0

      const maximumFee =
        preset.fee?.suggestedBaseFeePerGas + preset.fee?.maxFeePerGas || 0

      const sendFee = getSendFee(code, defaultFee)

      return {
        amount: new BigNumber(sendFee).dp(6).toString(),

        fiat: prettyFiatBalance(totalFees._W.preset, fiatRates[code]),
        maximum: prettyFiatBalance(
          getSendFee(code, maximumFee),
          fiatRates[code],
        ).toString(),
      }
    } else {
      return {
        amount: new BigNumber(totalFees[speed]).dp(6).toString(),
        fiat: prettyFiatBalance(totalFees[speed], fiatRates[code]).toString(),
        maximum: 'max here',
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
                onPress={() => {
                  setSpeedMode(speed as SpeedMode)
                  if (gasFees && code) {
                    customFeeInput.onChangeText(
                      gasFees[speed as SpeedMode].toString(),
                    )
                  }
                }}>
                <Text style={[styles.preset, styles.speed]}>{speed}</Text>
                {likelyWait.slow ? (
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
