import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import SplashScreen from 'react-native-splash-screen'
import Header from './src/components/header'
import Wallet from './src/components/wallet'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : 'white',
  }

  useEffect(() => {
    SplashScreen.hide()
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header />
      <Wallet />
    </SafeAreaView>
  )
}

export default App
