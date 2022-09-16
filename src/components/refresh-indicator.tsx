import React, { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { RefreshIndBox as RefInd } from '../theme'
import { AppIcons } from '../assets'
const { Loader } = AppIcons

type Props = React.ComponentProps<typeof RefInd>

const RefreshIndicator: React.FC<Props> = ({ variant, ...rest }: Props) => {
  const angle = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${angle.value}deg` }] }
  })

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: 700, easing: Easing.linear }),
      -1,
      false,
    )
  })

  return (
    <RefInd {...rest} variant={variant}>
      <Animated.View style={animatedStyle}>
        <Loader height={30} width={30} />
      </Animated.View>
    </RefInd>
  )
}

export default RefreshIndicator
