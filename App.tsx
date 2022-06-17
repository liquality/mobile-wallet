import React, { FC, useEffect, useRef, useState } from 'react'
import { AppState, StatusBar, View } from 'react-native'
import { Provider } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer, useNavigation } from '@react-navigation/native'

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
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Log } from './src/utils'

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
  const appState = useRef(AppState.currentState)
  const [, setAppStateVisible] = useState(appState.current)
  // const navigation = useNavigation()
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    isNewInstallation()
      .then((isNew) => {
        if (isNew) {
          setInitialRouteName('WalletCreationNavigator')
        } else {
          setInitialRouteName('LoginScreen')
        }
      })
      .catch((e) => Log(`Failed to start the app: ${e}`, 'error'))
    SplashScreen.hide()

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //setInitialRouteName('LoginScreen')
        //console.log('App has come to the foreground!')
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      //console.log('AppState CURRENT:', appState.current)
      if (
        appState.current === 'background' ||
        appState.current === 'inactive'
      ) {
        //setInitialRouteName('LoginScreen')
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  if (!initialRouteName) {
    return <View />
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <View style={backgroundStyle} testID={'app-test'}>
          <StatusBar barStyle={'dark-content'} />
          <GestureHandlerRootView style={backgroundStyle}>
            <NavigationContainer>
              <AppNavigator initialRouteName={initialRouteName} />
            </NavigationContainer>
          </GestureHandlerRootView>
        </View>
      </ThemeProvider>
    </Provider>
  )
}

export default App
