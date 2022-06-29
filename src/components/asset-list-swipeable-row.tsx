import React, { FC, memo, useCallback, useRef } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Animated, Dimensions } from 'react-native'
import AnimatedBox from './animated-box'
import { useNavigation } from '@react-navigation/core'
import { Easing } from 'react-native-reanimated'
import { AccountType } from '../types'

type renderActionsType = (
  progressAnimatedValue: Animated.AnimatedInterpolation,
  dragAnimatedValue: Animated.AnimatedInterpolation,
) => React.ReactNode

type AssetListSwipeableRowProps = {
  children: React.ReactElement
  assetSymbol: string
  assetData: AccountType
}

const AssetListSwipeableRow: FC<AssetListSwipeableRowProps> = (props) => {
  const width = Dimensions.get('screen').width
  const { children, assetData, assetSymbol } = props
  const ref = useRef<Swipeable>()
  const navigation = useNavigation()

  const close = () => {
    ref.current?.close()
  }

  const handleSendBtnPress = useCallback(() => {
    navigation.navigate('SendScreen', {
      assetData,
      screenTitle: `Send ${assetSymbol}`,
    })
  }, [assetData, assetSymbol, navigation])

  const handleReceiveBtnPress = useCallback(() => {
    navigation.navigate('ReceiveScreen', {
      assetData,
      screenTitle: `Receive ${assetSymbol}`,
    })
  }, [assetData, assetSymbol, navigation])

  const handleSwapBtnPress = useCallback(() => {
    navigation.navigate('SwapScreen', {
      assetData,
      screenTitle: 'Swap',
    })
  }, [assetData, navigation])

  const renderLeftActions: renderActionsType = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-width, 0],
      extrapolate: 'clamp',
    })

    return (
      <AnimatedBox
        translateX={trans}
        close={close}
        handleSendBtnPress={handleSendBtnPress}
        handleSwapBtnPress={handleSwapBtnPress}
        handleReceiveBtnPress={handleReceiveBtnPress}
      />
    )
  }

  const renderRightActions: renderActionsType = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, width],
      extrapolate: 'clamp',
    })

    return (
      <AnimatedBox
        translateX={trans}
        close={close}
        handleSendBtnPress={handleSendBtnPress}
        handleSwapBtnPress={handleSwapBtnPress}
        handleReceiveBtnPress={handleReceiveBtnPress}
      />
    )
  }

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      ref={ref}
      friction={2}
      leftThreshold={50}
      rightThreshold={50}
      animationOptions={{ duration: 500, easing: Easing.out(Easing.exp) }}
      useNativeAnimations
      enableTrackpadTwoFingerGesture>
      {children}
    </Swipeable>
  )
}

export default memo(AssetListSwipeableRow)
