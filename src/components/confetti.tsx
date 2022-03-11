import React, { FC, useEffect } from 'react'
import Animated, {
  FadeOut,
  withDelay,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from 'react-native-reanimated'
import { Dimensions, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
const diamand = require('../assets/confetti/diamand.png')
const emaralCircle = require('../assets/confetti/emrald-circle.png')
const grenBar = require('../assets/confetti/green-bar.png')
const greenTriangle = require('../assets/confetti/green-triangle.png')
const pinkCircle = require('../assets/confetti/pink-circle.png')
const purpleTriangle = require('../assets/confetti/purple-triangle.png')

const NUM_CONFETTI = 100
const COLORS = ['#00e4b2', '#09aec5', '#AC39FD', '#F41973', '#107ed5']
const CONFETTI_SIZE = 16
const shapes = [
  diamand,
  emaralCircle,
  greenTriangle,
  grenBar,
  pinkCircle,
  purpleTriangle,
]

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const styles = StyleSheet.create({
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  confetti: {
    width: CONFETTI_SIZE,
    height: CONFETTI_SIZE,
  },
})

type ConfettoProps = {
  id: number
  x: number
  y: number
  xVel: number
  angle: number
  delay: number
  yVel: number
  angleVel: number
  color: string
  elasticity: number
  imageSource: any
}

const Confetto: FC<ConfettoProps> = (props) => {
  const {
    x,
    y,
    xVel,
    angle,
    delay,
    yVel,
    angleVel,
    color,
    elasticity,
    imageSource,
  } = props
  const clock = useSharedValue(0)
  const duration = useSharedValue(getDuration())
  const localX = useSharedValue(x)
  const localY = useSharedValue(y)
  const localXVel = useSharedValue(xVel)
  const localAngle = useSharedValue(angle)
  const timeDiff = useSharedValue(0)
  const dt = useSharedValue(0)
  const dy = useSharedValue(0)
  const dx = useSharedValue(0)
  const dAngle = useSharedValue(0)

  function getDuration() {
    // Adding an extra 100 to the screen's height to ensure it goes off the screen.
    // Then using time = distance / speed for the time calc.
    let a = screenHeight + 100
    return (a / yVel) * 1000
  }

  useEffect(() => {
    // delay is multiplied by 1000 to convert into milliseconds
    clock.value = withDelay(
      delay * 1000,
      withTiming(1, { duration: duration.value }),
    )
    return () => {
      cancelAnimation(clock)
    }
  })

  const uas = useAnimatedStyle(() => {
    // Because our clock.value is going from 0 to 1, it's value will let us
    // get the actual number of milliseconds by taking it multiplied by the
    // total duration of the animation.
    timeDiff.value = clock.value * duration.value
    dt.value = timeDiff.value / 1000

    dy.value = dt.value * yVel
    dx.value = dt.value * localXVel.value
    dAngle.value = dt.value * angleVel
    localY.value = y + dy.value
    localX.value = x + dx.value
    localAngle.value += dAngle.value

    if (localX.value > screenWidth - CONFETTI_SIZE) {
      localX.value = screenWidth - CONFETTI_SIZE
      localXVel.value = localXVel.value * -1 * elasticity
    }

    if (localX.value < 0) {
      localX.value = 0
      localXVel.value = xVel * -1 * elasticity
    }

    return {
      transform: [
        { translateX: localX.value },
        { translateY: localY.value },
        { rotate: localAngle.value + 'deg' },
        { rotateX: localAngle.value + 'deg' },
        { rotateY: localAngle.value + 'deg' },
      ],
    }
  })

  return (
    <Animated.View style={[styles.confettiContainer, uas]}>
      <FastImage
        source={imageSource}
        tintColor={color}
        style={styles.confetti}
      />
    </Animated.View>
  )
}

const Confetti = () => {
  const confetti = [...new Array(NUM_CONFETTI)].map((_, index) => {
    // For 'x', spawn confetti from two different sources, a quarter
    // from the left and a quarter from the right edge of the screen.
    return {
      key: index,
      x: screenWidth * (index % 2 ? 0.25 : 0.75) - CONFETTI_SIZE / 2,
      y: -60,
      angle: 0,
      xVel: Math.random() * 400 - 200,
      yVel: Math.random() * 165 + 165,
      angleVel: (Math.random() * 3 - 1.5) * Math.PI,
      delay: Math.floor(index / 10) * 0.5,
      elasticity: Math.random() * 0.3 + 0.1,
      color: COLORS[index % COLORS.length],
      imageSource: shapes[Math.floor(Math.random() * 5)],
    }
  })

  return (
    <Animated.View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      exiting={FadeOut.duration(250)}>
      {confetti.map((e) => {
        return <Confetto {...e} />
      })}
    </Animated.View>
  )
}

export default Confetti
