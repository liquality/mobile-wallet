import React, { FC, MutableRefObject, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text } from 'react-native'
import { FeeDetails } from '@liquality/types'
import Box from '../../theme/box'
import { GasFees, NetworkFeeType } from '../../types'

const gasSpeeds: Array<keyof FeeDetails> = ['slow', 'average', 'fast']
type FeeSelectorProps = {
  assetSymbol: string
  handleCustomPress: (...args: unknown[]) => void
  networkFee: MutableRefObject<NetworkFeeType>
  gasFees: GasFees
}

const FeeSelector: FC<FeeSelectorProps> = (props) => {
  const { assetSymbol, handleCustomPress, networkFee, gasFees } = props
  const [customFee, setCustomFee] = useState()
  const [speedMode, setSpeedMode] = useState<keyof FeeDetails>('average')

  const handleGasTogglePress = (speed: keyof FeeDetails) => {
    if (gasFees) {
      setCustomFee(undefined)
      setSpeedMode(speed)
      networkFee.current = { speed, value: gasFees[speed].toNumber() }
    } else {
      Alert.alert('Invalid gas fees')
    }
  }

  return (
    <Box
      flexDirection="row"
      justifyContent="space-around"
      alignItems="center"
      marginVertical="m"
      alignSelf="center"
      width="70%">
      <Text style={styles.speedAssetName}>{assetSymbol}</Text>
      <Box flexDirection="row">
        {gasSpeeds.map((speed, idx) => (
          <Pressable
            key={`speed-${idx}`}
            style={[
              styles.speedBtn,
              idx === 0 && styles.speedLeftBtn,
              idx === 2 && styles.speedRightBtn,
              speedMode === speed && !customFee && styles.speedBtnSelected,
            ]}
            onPress={() => handleGasTogglePress(speed)}>
            <Text
              style={[
                styles.speedBtnLabel,
                speedMode === speed && !customFee && styles.speedTxtSelected,
                styles.speedLeftBtn,
              ]}>
              {speed}
            </Text>
          </Pressable>
        ))}
      </Box>
      <Pressable onPress={handleCustomPress}>
        <Text style={styles.customFee}>Custom</Text>
      </Pressable>
    </Box>
  )
}

const styles = StyleSheet.create({
  speedBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 26,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#D9DFE5',
  },
  speedLeftBtn: {
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderRightWidth: 0,
  },
  speedRightBtn: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    borderLeftWidth: 0,
  },
  speedBtnLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 11,
    textTransform: 'capitalize',
    color: '#1D1E21',
  },
  speedBtnSelected: {
    backgroundColor: '#F0F7F9',
  },
  speedTxtSelected: {
    fontWeight: '600',
  },
  speedAssetName: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 15,
    color: '#3D4767',
  },
  customFee: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    color: '#9D4DFA',
  },
})

export default FeeSelector
