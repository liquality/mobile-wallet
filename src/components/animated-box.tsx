import React, { FC } from 'react'
import { useTheme } from '@shopify/restyle'
import { ThemeType as Theme, Box, faceliftPalette } from '../theme'
import { Animated, Pressable, StyleSheet } from 'react-native'
import { AppIcons } from '../assets'
import { scale } from 'react-native-size-matters'

type AnimatedBoxProps = {
  translateX: any
  close: () => void
  handleSendBtnPress: () => void
  handleSwapBtnPress: () => void
  handleReceiveBtnPress: () => void
}

const { SwapIconGrey, SendIcon, ReceiveIcon, DollarSign } = AppIcons
const AnimatedBox: FC<AnimatedBoxProps> = (props) => {
  const {
    close,
    handleReceiveBtnPress,
    handleSendBtnPress,
    handleSwapBtnPress,
    translateX,
  } = props
  const theme = useTheme<Theme>()

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      onTouchStart={close}
      style={[
        styles.box,
        {
          borderColor: theme.colors.mainBorderColor,
        },
      ]}>
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [{ translateX }],
          },
        ]}>
        <Pressable onPress={handleSendBtnPress} style={styles.button}>
          <SendIcon
            width={scale(12)}
            height={scale(23)}
            strokeWidth={0.7}
            stroke={faceliftPalette.active}
            fill={faceliftPalette.active}
          />
        </Pressable>
        <Pressable onPress={handleSwapBtnPress} style={styles.button}>
          <SwapIconGrey
            width={scale(14)}
            height={scale(16)}
            strokeWidth={0.7}
            stroke={faceliftPalette.active}
            fill={faceliftPalette.active}
          />
        </Pressable>
        <Pressable onPress={handleReceiveBtnPress} style={styles.button}>
          <ReceiveIcon
            width={scale(12)}
            height={scale(23)}
            strokeWidth={0.7}
            stroke={faceliftPalette.active}
            fill={faceliftPalette.active}
          />
        </Pressable>
        <Pressable onPress={handleReceiveBtnPress} style={styles.button}>
          <DollarSign fill={faceliftPalette.active} />
        </Pressable>
      </Animated.View>
    </Box>
  )
}

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: faceliftPalette.selectedBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  box: {
    backgroundColor: faceliftPalette.selectedBackground,
    flex: 0.6,
    height: '100%',
  },
  button: {
    marginLeft: scale(30),
  },
})

export default AnimatedBox
