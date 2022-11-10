import React, { FC, memo, useCallback, useRef } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Animated, Dimensions } from 'react-native'
import AnimatedBox from './animated-box'
import { NavigationProp, useNavigation } from '@react-navigation/core'
import { Easing } from 'react-native-reanimated'
import { AccountType, MainStackParamList } from '../types'
import { labelTranslateFn } from '../utils'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { accountForAssetState, swapPairState } from '../atoms'

type renderActionsType = (
  progressAnimatedValue: Animated.AnimatedInterpolation,
  dragAnimatedValue: Animated.AnimatedInterpolation,
) => React.ReactNode

type AssetListSwipeableRowProps = {
  children: React.ReactElement
  assetSymbol: string
  assetData: AccountType
  isNested: boolean
  onOpen: () => void
  onClose: () => void
}

const AssetListSwipeableRow: FC<AssetListSwipeableRowProps> = (props) => {
  const width = Dimensions.get('screen').width
  const { children, assetData, assetSymbol, onClose, onOpen, isNested } = props
  const ref = useRef<Swipeable>()
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const ethAccount = useRecoilValue(accountForAssetState('ETH'))
  const btcAccount = useRecoilValue(accountForAssetState('BTC'))
  const setSwapPair = useSetRecoilState(swapPairState)

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
      screenTitle: `${labelTranslateFn('common.receive')} ${assetSymbol}`,
    })
  }, [assetData, assetSymbol, navigation])

  const handleSwapBtnPress = useCallback(() => {
    setSwapPair({
      fromAsset: assetData,
      toAsset: assetData.code === 'ETH' ? btcAccount : ethAccount,
    })
    navigation.navigate('SwapScreen', {
      screenTitle: 'Swap',
    })
  }, [assetData, btcAccount, ethAccount, navigation, setSwapPair])

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
      enabled={!isNested}
      renderLeftActions={undefined}
      renderRightActions={renderRightActions}
      ref={ref}
      onSwipeableWillOpen={onOpen}
      onSwipeableWillClose={onClose}
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
