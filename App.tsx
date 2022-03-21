import React, { FC, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { Provider } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createSwitchNavigator } from '@react-navigation/compat'
import { ThemeProvider } from '@shopify/restyle'
import { store, isNewInstallation } from './src/store/store'
import theme from './src/theme'
import {
  WalletCreationNavigator,
  WalletImportNavigator,
  MainNavigator,
} from './src/components/navigators'
import LoginScreen from './src/screens/wallet-creation/loginScreen'

const AppNavigator = ({ initialRouteName }: { initialRouteName: string }) => {
  const Navigator = createSwitchNavigator(
    {
      WalletCreationNavigator,
      WalletImportNavigator,
      MainNavigator,
      LoginScreen,
    },
    {
      initialRouteName,
    },
  )

  return <Navigator />
}

const App: FC = () => {
  const [initialRouteName, setInitialRouteName] = useState(
    'WalletCreationNavigator',
  )
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    isNewInstallation().then((isNew) => {
      if (isNew) {
        setInitialRouteName('WalletCreationNavigator')
      } else {
        setInitialRouteName('LoginScreen')
      }
      SplashScreen.hide()
    })
  }, [])

  if (!initialRouteName) {
    return <View />
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <View style={backgroundStyle} testID={'app-test'}>
          <StatusBar barStyle={'dark-content'} />
          <NavigationContainer>
            <AppNavigator initialRouteName={initialRouteName} />
          </NavigationContainer>
        </View>
      </ThemeProvider>
    </Provider>
  )
}

export default App
