import React from 'react'
import { scale, ScaledSheet } from 'react-native-size-matters'
import Toast, { ToastConfig } from 'react-native-toast-message'
import { AppIcons, Fonts } from '../assets'
import { Box, palette, Text } from '.'

const { CopySuccessTick } = AppIcons
export const toastConfig: ToastConfig = {
  copyToast: ({ text1 }) => (
    <Box
      height={scale(54)}
      width={'90%'}
      borderRadius={scale(10)}
      justifyContent="center"
      style={styles.copyToastBoxStyle}>
      <Box flexDirection={'row'} height={scale(54)} alignItems="center">
        <CopySuccessTick />
        <Text style={styles.copyToastTextStyle}>{text1}</Text>
      </Box>
    </Box>
  ),
}

/**
 * for toastConfig we cannot pass color or padding directly to the Box component,
 * we should use style prop for styling
 */
const styles = ScaledSheet.create({
  copyToastBoxStyle: {
    backgroundColor: palette.sectionTitleColor,
    padding: '20@s',
  },
  copyToastTextStyle: {
    marginLeft: '8@s',
    marginTop: '3@s',
    color: palette.white,
    fontFamily: Fonts.Regular,
    fontSize: '14@s',
    fontWeight: '400',
  },
})

type ToastType = 'copyToast'

export const showCopyToast = (toastType: ToastType, toastMsg: string) => {
  Toast.show({
    type: toastType,
    text1: toastMsg,
  })
}
