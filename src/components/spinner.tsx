import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { palette } from '../theme'
import { AppIcons } from '../assets'

const { Loader } = AppIcons

const Spinner = () => {
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
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Loader />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.white,
    opacity: 0.9,
  },
})

export default Spinner
