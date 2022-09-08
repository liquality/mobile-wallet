import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { FeeDetails } from '@liquality/types'
import Box from '../../theme/box'
import Card from '../../theme/card'
import Text from '../../theme/text'
import { GasFees, NetworkFeeType } from '../../types'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import { SwapScreenPopUpTypes } from '../../atoms'

const gasSpeeds: Array<FeeLabel> = [
  FeeLabel.Slow,
  FeeLabel.Average,
  FeeLabel.Fast,
]
type FeeSelectorProps = {
  assetSymbol: string
  handleCustomPress: (...args: unknown[]) => void
  networkFee: MutableRefObject<NetworkFeeType | undefined>
  changeNetworkSpeed?: (speed: FeeLabel) => void
  gasFees: GasFees
  customFeeProps: number | undefined
  customFeeAsset: string
  toAsset?: string // to render double tap or long press popup accordingly
  fromAsset?: string // to render double tap or long press popup accordingly
  doubleLongTapFeelabel?: SwapScreenPopUpTypes
}

type NetworkPopUpCardProps = {
  speed: string
  fee: string
}

const NetworkPopUpCard = ({ speed, fee }: NetworkPopUpCardProps) => {
  return (
    <Card
      justifyContent={'center'}
      variant={'swapPopup'}
      width={100}
      alignItems={'center'}
      height={60}>
      <Text color="tertiaryForeground">{speed}</Text>
      <Text color="tertiaryForeground">{fee}</Text>
    </Card>
  )
}

const FeeSelector: FC<FeeSelectorProps> = (props) => {
  const {
    assetSymbol,
    handleCustomPress,
    networkFee,
    gasFees,
    changeNetworkSpeed,
    customFeeProps,
    customFeeAsset,
    toAsset = '',
    fromAsset = '',
    doubleLongTapFeelabel,
  } = props
  const [customFee, setCustomFee] = useState()
  const [speedMode, setSpeedMode] = useState<keyof FeeDetails>('average')

  const handleGasTogglePress = (speed: FeeLabel) => {
    if (gasFees) {
      if (changeNetworkSpeed) changeNetworkSpeed(speed)
      setCustomFee(undefined)
      setSpeedMode(speed)
      customFeeProps
        ? (networkFee.current = { speed, value: customFeeProps })
        : (networkFee.current = { speed, value: gasFees[speed].toNumber() })
    } else {
      Alert.alert('Invalid gas fees')
    }
  }

  useEffect(() => {
    networkFee.current = {
      speed: FeeLabel.Average,
      value: gasFees.average.toNumber(),
    }
    //TODO: Handle multiple custom fees if different chains?
    customFeeProps && assetSymbol === customFeeAsset
      ? (networkFee.current = { speed: 'custom', value: customFeeProps })
      : (networkFee.current = {
          speed: FeeLabel.Average,
          value: gasFees[speedMode].toNumber(),
        })
  }, [
    assetSymbol,
    customFeeAsset,
    customFeeProps,
    gasFees,
    gasFees.average,
    networkFee,
    speedMode,
  ])

  const getCompatibleNetworkCardPopupPosition = React.useCallback(() => {
    switch (true) {
      //ToAsset conditions start from here
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToFast:
        return (
          <Box position={'absolute'} right={40} top={-65} zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee={'7 sat/b'} />
          </Box>
        )
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToAverage:
        return (
          <Box
            position={'absolute'}
            left={'30%'}
            right={'70%'}
            top={-65}
            zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee="7 sat/b" />
          </Box>
        )
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToSlow:
        return (
          <Box position={'absolute'} left={20} top={-65} zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee="7 sat/b" />
          </Box>
        )

      //FromAsset conditions start from here
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromFast:
        return (
          <Box position={'absolute'} right={40} top={-65} zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee={'7 sat/b'} />
          </Box>
        )
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromAverage:
        return (
          <Box
            position={'absolute'}
            left={'30%'}
            right={'70%'}
            top={-65}
            zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee="7 sat/b" />
          </Box>
        )
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromSlow:
        return (
          <Box position={'absolute'} left={20} top={-65} zIndex={1}>
            <NetworkPopUpCard speed="600sec" fee="7 sat/b" />
          </Box>
        )
    }
  }, [assetSymbol, doubleLongTapFeelabel, toAsset, fromAsset])

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
        <Text style={styles.customFee} tx="common.custom" />
      </Pressable>
      {getCompatibleNetworkCardPopupPosition()}
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
