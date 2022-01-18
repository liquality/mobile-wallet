import React, { FC, useEffect } from 'react'
import Svg, { Line } from 'react-native-svg'
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type ProgressBarProps = {
  width: number
  total: number
  current: number
}

const ProgressBar: FC<ProgressBarProps> = (props) => {
  const { width, total, current } = props
  const AnimatedLine = Animated.createAnimatedComponent(Line)
  const progress = useSharedValue(0)

  const animatedProps = useAnimatedProps(() => {
    return {
      x2: progress.value,
    }
  })

  useEffect(() => {
    progress.value = withTiming((current * width) / total)
  }, [current, progress, total, width])

  return (
    <Animated.View>
      <Svg height="10" width={width}>
        <Line
          x1="0"
          y1="5"
          x2={width}
          y2="5"
          stroke="#D5D8DD"
          strokeWidth="3"
        />
        <AnimatedLine
          animatedProps={animatedProps}
          x1="0"
          y1="5"
          y2="5"
          stroke="#2CD2CF"
          strokeWidth="3"
        />
      </Svg>
    </Animated.View>
  )
}

export default ProgressBar
