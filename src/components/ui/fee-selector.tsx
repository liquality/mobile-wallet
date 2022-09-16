import React, { FC, MutableRefObject, useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { FeeDetails } from '@liquality/types'
import { Text, Box, Card } from '../../theme'
import { GasFees, NetworkFeeType } from '../../types'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
import { FADE_IN_OUT_DURATION, labelTranslateFn } from '../../utils'
import I18n from 'i18n-js'
import { getChain, getAsset } from '@liquality/cryptoassets'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  networkState,
  swapScreenDoubleLongEvent as SSDLE,
  SwapScreenPopUpTypes,
} from '../../atoms'
import GestureDetector from '../gesture-detector/gesture-detector'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const gasSpeeds: Array<FeeLabel> = [
  FeeLabel.Slow,
  FeeLabel.Average,
  FeeLabel.Fast,
]

const dp = 2

export type LikelyWaitProps = {
  slow: number
  average: number
  fast: number
}

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
  likelyWait?: LikelyWaitProps
}

type NetworkPopUpCardProps = {
  speed: string
  fee: string
}

const NetworkPopUpCard = ({ speed, fee }: NetworkPopUpCardProps) => {
  return (
    <Animated.View
      key={'networkSpeedFeePopUp'}
      entering={FadeIn.duration(FADE_IN_OUT_DURATION)}
      exiting={FadeOut.duration(FADE_IN_OUT_DURATION)}>
      <Card
        justifyContent={'center'}
        variant={'swapPopup'}
        flex={1}
        paddingHorizontal="s"
        alignItems={'center'}
        height={60}>
        <Text color="tertiaryForeground">{speed}</Text>
        <Text color="tertiaryForeground">{fee}</Text>
      </Card>
    </Animated.View>
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
    likelyWait,
  } = props
  const [customFee, setCustomFee] = useState()
  const [speedMode, setSpeedMode] = useState<keyof FeeDetails>('average')
  const activeNetwork = useRecoilValue(networkState)
  const setSwapScreenPopTypes = useSetRecoilState(SSDLE)

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

  const onDoubleTapOrLongPress = React.useCallback(
    (feeLabel: FeeLabel) => {
      switch (true) {
        case assetSymbol === fromAsset && feeLabel === FeeLabel.Slow:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.FromSlow)
          break
        case assetSymbol === fromAsset && feeLabel === FeeLabel.Average:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.FromAverage)
          break
        case assetSymbol === fromAsset && feeLabel === FeeLabel.Fast:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.FromFast)
          break
        case assetSymbol === toAsset && feeLabel === FeeLabel.Slow:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.ToSlow)
          break
        case assetSymbol === toAsset && feeLabel === FeeLabel.Average:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.ToAverage)
          break
        case assetSymbol === toAsset && feeLabel === FeeLabel.Fast:
          setSwapScreenPopTypes(SwapScreenPopUpTypes.ToFast)
          break
      }
      setTimeout(() => {
        setSwapScreenPopTypes(SwapScreenPopUpTypes.Null)
      }, 3000)
    },
    [assetSymbol, fromAsset, toAsset, setSwapScreenPopTypes],
  )

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
    const ethereumFastSpeed = labelTranslateFn('likelyLess15')!
    const ethereumAverageSpeed = labelTranslateFn('likelyLess30')!
    const ethereumSlowSpeed = labelTranslateFn('maybeIn30')!
    const notEthFastSpeed = I18n.t('sec', { sec: likelyWait?.fast })
    const notEthAverageSpeed = I18n.t('sec', { sec: likelyWait?.average })
    const notEthSlowSpeed = I18n.t('sec', { sec: likelyWait?.slow })

    switch (true) {
      //ToAsset conditions start from here
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToFast: {
        let speed = toAsset === 'ETH' ? ethereumFastSpeed : notEthFastSpeed
        const unitForToAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, toAsset)?.chain,
        ).fees.unit
        let fee = gasFees.fast.toNumber().toFixed(dp) + ` ${unitForToAsset}`
        return (
          <Box position={'absolute'} right={40} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToAverage: {
        let speed =
          toAsset === 'ETH' ? ethereumAverageSpeed : notEthAverageSpeed
        const unitForToAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, toAsset)?.chain,
        ).fees.unit
        let fee = gasFees.average.toNumber().toFixed(dp) + ` ${unitForToAsset}`
        return (
          <Box position={'absolute'} left={60} right={60} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
      case assetSymbol === toAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.ToSlow: {
        let speed = toAsset === 'ETH' ? ethereumSlowSpeed : notEthSlowSpeed
        const unitForToAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, toAsset)?.chain,
        ).fees.unit
        let fee = gasFees.slow.toNumber().toFixed(dp) + ` ${unitForToAsset}`
        return (
          <Box position={'absolute'} left={20} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
      //FromAsset conditions start from here
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromFast: {
        let speed = fromAsset === 'ETH' ? ethereumFastSpeed : notEthFastSpeed
        const unitForFromAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, fromAsset)?.chain,
        ).fees.unit
        let fee = gasFees.fast.toNumber().toFixed(dp) + ` ${unitForFromAsset}`
        return (
          <Box position={'absolute'} right={40} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromAverage: {
        let speed =
          fromAsset === 'ETH' ? ethereumAverageSpeed : notEthAverageSpeed
        const unitForFromAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, fromAsset)?.chain,
        ).fees.unit
        let fee =
          gasFees.average.toNumber().toFixed(dp) + ` ${unitForFromAsset}`
        return (
          <Box position={'absolute'} left={60} right={60} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
      case assetSymbol === fromAsset &&
        doubleLongTapFeelabel === SwapScreenPopUpTypes.FromSlow: {
        let speed = fromAsset === 'ETH' ? ethereumSlowSpeed : notEthSlowSpeed
        const unitForFromAsset = getChain(
          activeNetwork,
          getAsset(activeNetwork, fromAsset)?.chain,
        ).fees.unit
        let fee = gasFees.slow.toNumber().toFixed(dp) + ` ${unitForFromAsset}`
        return (
          <Box position={'absolute'} left={20} top={-65} zIndex={1}>
            <NetworkPopUpCard speed={speed} fee={fee} />
          </Box>
        )
      }
    }
  }, [
    likelyWait?.fast,
    likelyWait?.average,
    likelyWait?.slow,
    activeNetwork,
    toAsset,
    fromAsset,
    assetSymbol,
    doubleLongTapFeelabel,
    gasFees.fast,
    gasFees.average,
    gasFees.slow,
  ])

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
          <GestureDetector
            key={`speed-${idx}`}
            onSingleTap={() => handleGasTogglePress(speed)}
            doubleOrLongPress={() => onDoubleTapOrLongPress(speed)}>
            <Box
              style={[
                styles.speedBtn,
                idx === 0 && styles.speedLeftBtn,
                idx === 2 && styles.speedRightBtn,
                speedMode === speed && !customFee && styles.speedBtnSelected,
              ]}>
              <Text
                style={[
                  styles.speedBtnLabel,
                  speedMode === speed && !customFee && styles.speedTxtSelected,
                  styles.speedLeftBtn,
                ]}>
                {speed}
              </Text>
            </Box>
          </GestureDetector>
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
