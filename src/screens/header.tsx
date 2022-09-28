import { StyleSheet, View } from 'react-native'
import React from 'react'
import { palette, Text } from '../theme'
import { AppIcons, Fonts } from '../assets'

const { Logo } = AppIcons

const Header = ({
  width,
  height,
  style,
  showText,
}: {
  width?: number
  height?: number
  style?: any
  showText?: boolean
}) => {
  return (
    <View style={[styles.header, style && style]}>
      <Logo
        width={width || 84}
        height={height || 54}
        style={styles.headerLogo}
      />
      {showText && <Text style={styles.headerText} tx="header.wallet" />}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    marginBottom: 8,
  },
  headerText: {
    fontFamily: Fonts.Thin,
    color: palette.white,
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 27,
  },
})
export default Header
