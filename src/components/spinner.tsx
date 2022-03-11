import { Modal, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import Loader from '../assets/icons/loader.svg'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import Text from '../theme/text'
import { Theme } from '../theme'
import { useTheme } from '@shopify/restyle'

const Spinner = ({ visible }: { visible: boolean }) => {
  const angle = useSharedValue(0)
  const theme = useTheme<Theme>()
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
    <Modal transparent={true} visible={visible} animationType={'fade'}>
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <Loader />
        </Animated.View>
        <View style={styles.loadingView}>
          <Text
            variant="description"
            style={{ color: theme.colors.secondaryForeground }}>
            Loading...
          </Text>
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
    opacity: 0.9,
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
})

export default Spinner
