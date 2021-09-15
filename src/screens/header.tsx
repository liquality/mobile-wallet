import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Logo from '../assets/icons/logo.svg'

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
      {showText && <Text style={styles.headerText}>Wallet</Text>}
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
  logoText: {
    color: '#fff',
    fontSize: 18,
  },
  headerText: {
    fontFamily: 'MontserratAlternates-Light',
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 27,
  },
})
export default Header