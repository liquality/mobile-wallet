import { GasSpeedType } from '../../core/types'
import React, { FC, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const gasSpeeds: GasSpeedType[] = ['slow', 'average', 'fast']
type GasControllerProps = {
  assetSymbol: string
  handleCustomPress: (...args: unknown[]) => void
}

const GasController: FC<GasControllerProps> = (props) => {
  const { assetSymbol, handleCustomPress } = props
  const [customFee, setCustomFee] = useState()
  const [speedMode, setSpeedMode] = useState<GasSpeedType>('average')

  return (
    <View style={[styles.container, styles.row, styles.speedOptions]}>
      <Text style={styles.speedAssetName}>{assetSymbol}</Text>
      <View style={styles.speedBtnsWrapper}>
        {gasSpeeds.map((speed, idx) => (
          <Pressable
            key={`speed-${idx}`}
            style={[
              styles.speedBtn,
              idx === 0 && styles.speedLeftBtn,
              idx === 2 && styles.speedRightBtn,
              speedMode === speed && !customFee && styles.speedBtnSelected,
            ]}
            onPress={() => {
              setCustomFee(undefined)
              setSpeedMode(speed)
            }}>
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
      </View>
      <Pressable onPress={handleCustomPress}>
        <Text style={styles.customFee}>Custom</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  speedOptions: {
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
  },
  speedLabel: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },
  speedValue: {
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
  },
  speedBtnsWrapper: {
    flexDirection: 'row',
  },
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

export default GasController
