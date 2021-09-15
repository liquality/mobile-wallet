import React, { useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createSwitchNavigator } from '@react-navigation/compat'
import { LiqualityThemeProvider } from './src/theme'
import {
  HomeNavigator,
  OnboardingNavigator,
  WalletImportNavigator,
  MainNavigator,
} from './src/components/navigators'

const AppNavigator = createSwitchNavigator(
  {
    OnboardingNavigator,
    WalletImportNavigator,
    MainNavigator,
    HomeNavigator,
  },
  {
    initialRouteName: 'MainNavigator',
  },
)

const App = () => {
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    SplashScreen.hide()
  })

  return (
    <LiqualityThemeProvider>
      <View style={backgroundStyle} testID={'app-test'}>
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </LiqualityThemeProvider>
  )
}

export default App
