import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Loader from '../assets/icons/loader.svg'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const RefreshIndicator = () => {
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
        <Loader height={30} width={30} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.9,
    height: 100,
    width: '100%',
  },
})

export default RefreshIndicator
