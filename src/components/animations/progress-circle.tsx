import React, { FC, useEffect } from 'react'
import Svg, { Circle, Text } from 'react-native-svg'
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
  withRepeat,
} from 'react-native-reanimated'

type ProgressCircleProps = {
  radius: number
  current: number
  total: number
}

const ProgressCircle: FC<ProgressCircleProps> = (props) => {
  const { radius, current, total } = props
  const { PI } = Math
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)
  const offset = useSharedValue(0)
  const circumference = 2 * PI * (radius - 2)

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: offset.value,
    }
  })

  useEffect(() => {
    const progress = (2 * PI * (radius - 2) * (total - current)) / total
    offset.value = withRepeat(
      withTiming(progress, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      -1,
      false,
    )
  }, [PI, current, offset, radius, total])

  return (
    <Animated.View>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="transparent"
          stroke="#D5D8DD"
          strokeWidth="1"
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="transparent"
          strokeWidth="1"
          stroke="#2CD2CF"
          strokeDasharray={`${circumference}, ${circumference}`}
        />
        <Text
          x={radius}
          y={radius + 4}
          fontFamily="Montserrat-Regular"
          fontWeight="200"
          fontSize={10}
          textAnchor="middle"
          verticalAlign="center"
          stroke="#000D35">{`${current}/${total}`}</Text>
      </Svg>
    </Animated.View>
  )
}

export default ProgressCircle
