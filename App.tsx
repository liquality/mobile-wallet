import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createSwitchNavigator } from '@react-navigation/compat'
import { Provider } from 'react-redux'
import { store, hydrateStore } from './src/store'
import { LiqualityThemeProvider } from './src/theme'
import {
  OnboardingNavigator,
  WalletImportNavigator,
  MainNavigator,
} from './src/components/navigators'

const AppNavigator = ({ initialRouteName }: { initialRouteName: string }) => {
  const Navigator = createSwitchNavigator(
    {
      OnboardingNavigator,
      WalletImportNavigator,
      MainNavigator,
    },
    {
      initialRouteName,
    },
  )

  return <Navigator />
}

const App = () => {
  const [initialRouteName, setInitialRouteName] = useState(
    'OnboardingNavigator',
  )
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    hydrateStore().then((state) => {
      if (!state) {
        setInitialRouteName('OnboardingNavigator')
      } else {
        setInitialRouteName('MainNavigator')
      }
      SplashScreen.hide()
    })
  })

  return (
    <Provider store={store}>
      <LiqualityThemeProvider>
        <View style={backgroundStyle} testID={'app-test'}>
          <StatusBar barStyle={'light-content'} />
          <NavigationContainer>
            <AppNavigator initialRouteName={initialRouteName} />
          </NavigationContainer>
        </View>
      </LiqualityThemeProvider>
    </Provider>
  )
}

export default App
