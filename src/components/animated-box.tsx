import React, { FC } from 'react'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme'
import Box from '../theme/box'
import { Animated, StyleSheet } from 'react-native'
import RoundButton from '../theme/round-button'

type AnimatedBoxProps = {
  translateX: any
  close: () => void
  handleSendBtnPress: () => void
  handleSwapBtnPress: () => void
  handleReceiveBtnPress: () => void
}

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
      borderBottomWidth={1}
      onPress={close}
      style={[
        styles.box,
        {
          borderBottomColor: theme.colors.mainBorderColor,
        },
      ]}>
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [{ translateX }],
          },
        ]}>
        <RoundButton
          onPress={handleSendBtnPress}
          type="SEND"
          variant="secondary"
        />
        <RoundButton
          onPress={handleSwapBtnPress}
          type="SWAP"
          variant="secondary"
        />
        <RoundButton
          onPress={handleReceiveBtnPress}
          type="RECEIVE"
          variant="secondary"
        />
      </Animated.View>
    </Box>
  )
}

const styles = StyleSheet.create({
  animatedView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  box: {
    flex: 0.5,
    height: '100%',
  },
})

export default AnimatedBox
