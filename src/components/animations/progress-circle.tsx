import React, { FC, useEffect } from 'react'
import Svg, { Circle, Text } from 'react-native-svg'
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withRepeat,
} from 'react-native-reanimated'
import { Fonts } from '../../assets'

type ProgressCircleProps = {
  radius: number
  current: number
  total: number
}

const ProgressCircle: FC<ProgressCircleProps> = (props) => {
  const { radius, current, total } = props
  const { PI } = Math
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)
  const circumference = 2 * PI * (radius - 2)
  const offset = useSharedValue(circumference)

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: offset.value,
    }
  })

  useEffect(() => {
    offset.value = withRepeat(withTiming(0), -1, false)
  }, [offset])

  return (
    <Animated.View>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="transparent"
          stroke="#2CD2CF"
          strokeWidth="1"
        />
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="transparent"
          strokeWidth="1"
          stroke="#D5D8DD"
          strokeDasharray={`${circumference}, ${circumference}`}
        />
        <Text
          x={radius}
          y={radius + 4}
          fontFamily={Fonts.Regular}
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
