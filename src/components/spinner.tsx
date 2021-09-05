import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Loader from '../assets/icons/spinner.svg'

const Spinner = ({
  loadingText,
  visible,
}: {
  loadingText: string
  visible: boolean
}) => {
  const rotation = useSharedValue(0)
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  }, [])

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      -1,
      false,
    )
  })

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.container}>
        <Animated.View style={animationStyle}>
          <Loader />
        </Animated.View>
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </View>
    </Modal>
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
    backgroundColor: '#fff',
    opacity: 0.5,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
})

export default Spinner
