import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, faceliftPalette, Text } from '../theme'
import { AppIcons, Fonts } from '../assets'
import { scale } from 'react-native-size-matters'
const { GreenCheckMark } = AppIcons

const CopyPopup = ({
  setShowPopup,
}: {
  showPopup: boolean
  setShowPopup: (show: boolean) => void
}) => {
  setTimeout(() => {
    setShowPopup(false)
  }, 3000)

  return (
    <Box paddingVertical={'l'} alignItems="center" justifyContent={'center'}>
      <Box style={styles.boxContainer}>
        <Text style={styles.whiteText}>
          <GreenCheckMark /> Address copied
        </Text>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: 'row',
    borderRadius: 11,
    backgroundColor: faceliftPalette.darkGrey,
    width: scale(335),
    height: scale(65),
  },
  whiteText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: faceliftPalette.whiteGrey,
    margin: scale(24),
  },
})

export default CopyPopup
