// Retrieved from this gist with minor modifications https://gist.github.com/ShopifyEng/96b5f2f55b274dab3a957bb12c3f2c4d
import React, { useMemo } from 'react'
import Animated from 'react-native-reanimated'
import { View, Dimensions, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

const diamand = require('../assets/confetti/diamand.png')
const emaralCircle = require('../assets/confetti/emrald-circle.png')
const grenBar = require('../assets/confetti/green-bar.png')
const greenTriangle = require('../assets/confetti/green-triangle.png')
const pinkCircle = require('../assets/confetti/pink-circle.png')
const purpleTriangle = require('../assets/confetti/purple-triangle.png')

const NUM_CONFETTI = 100
const COLORS = ['#00e4b2', '#09aec5', '#AC39FD', '#F41973', '#107ed5']
const CONFETTI_SIZE = 24

const shapes = [
  diamand,
  emaralCircle,
  greenTriangle,
  grenBar,
  pinkCircle,
  purpleTriangle,
]

const createConfetti = () => {
  const { width: screenWidth } = Dimensions.get('screen')

  return [...new Array(NUM_CONFETTI)].map((_, i) => {
    const clock = new Animated.Clock()

    return {
      key: i,
      // Spawn confetti from two different sources, a quarter
      // from the left and a quarter from the right edge of the screen.
      x: new Animated.Value(
        screenWidth * (i % 2 ? 0.25 : 0.75) - CONFETTI_SIZE / 2,
      ),
      y: new Animated.Value(-60),
      angle: new Animated.Value(0),
      xVel: new Animated.Value(Math.random() * 400 - 200),
      yVel: new Animated.Value(Math.random() * 150 + 150),
      angleVel: new Animated.Value((Math.random() * 3 - 1.5) * Math.PI),
      delay: new Animated.Value(Math.floor(i / 10) * 0.3),
      elasticity: Math.random() * 0.3 + 0.1,
      color: COLORS[i % COLORS.length],
      clock,
      imageSource: shapes[Math.floor(Math.random() * 5)],
    }
  })
}

const Confetti = () => {
  const confetti = useMemo(createConfetti, [])

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {confetti.map(
        ({
          key,
          x,
          y,
          color,
          angle,
          xVel,
          yVel,
          angleVel,
          elasticity,
          delay,
          clock,
          imageSource,
        }) => {
          return (
            <React.Fragment key={key}>
              <Animated.Code>
                {() => {
                  const {
                    startClock,
                    set,
                    add,
                    sub,
                    divide,
                    diff,
                    multiply,
                    cond,
                    clockRunning,
                    greaterThan,
                    lessThan,
                  } = Animated
                  const { width: screenWidth } = Dimensions.get('window')

                  const timeDiff = diff(clock)
                  const dt = divide(timeDiff, 1000)
                  const dy = multiply(dt, yVel)
                  const dx = multiply(dt, xVel)
                  const dAngle = multiply(dt, angleVel)

                  return cond(
                    clockRunning(clock),
                    [
                      cond(
                        greaterThan(delay, 0),
                        [set(delay, sub(delay, dt))],
                        [
                          set(y, add(y, dy)),
                          set(x, add(x, dx)),
                          set(angle, add(angle, dAngle)),
                        ],
                      ),
                      cond(greaterThan(x, screenWidth - CONFETTI_SIZE), [
                        set(x, screenWidth - CONFETTI_SIZE),
                        set(xVel, multiply(xVel, -elasticity)),
                      ]),
                      cond(lessThan(x, 0), [
                        set(x, 0),
                        set(xVel, multiply(xVel, -elasticity)),
                      ]),
                    ],
                    [startClock(clock), timeDiff],
                  )
                }}
              </Animated.Code>
              <Animated.View
                style={[
                  styles.confettiContainer,
                  {
                    transform: [
                      { translateX: x },
                      { translateY: y },
                      { rotate: angle },
                      { rotateX: angle },
                      { rotateY: angle },
                    ],
                  },
                ]}>
                <FastImage
                  tintColor={color}
                  source={imageSource}
                  style={styles.confetti}
                />
              </Animated.View>
            </React.Fragment>
          )
        },
      )}
    </View>
  )
}

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

export default Confetti
