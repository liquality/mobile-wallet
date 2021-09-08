import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Logo from '../assets/icons/logo.svg'

const ScreenHeader = () => {
  return (
    <View style={styles.header}>
      <Logo width={84} height={30} style={styles.headerLogo} />
      <Text style={styles.logoText}>liquality</Text>
      <Text style={styles.headerText}>Wallet</Text>
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
export default ScreenHeader
