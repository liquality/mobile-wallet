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
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Log } from './src/utils'
import { RecoilRoot } from 'recoil'
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced'
import i18n from 'i18n-js'
import { langSelected as LS } from './src/atoms'
import { useRecoilValue } from 'recoil'

const AppNavigator = ({ initialRouteName }: { initialRouteName: string }) => {
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected

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
    isNewInstallation()
      .then((isNew) => {
        if (!isNew) {
          setInitialRouteName('LoginScreen')
        }
      })
      .catch((e) => Log(`Failed to start the app: ${e}`, 'error'))
    SplashScreen.hide()
  }, [])

  if (!initialRouteName) {
    return <View />
  }

  return (
    <Provider store={store}>
      {__DEV__ && !process.env.JEST_WORKER_ID ? <FlipperAsyncStorage /> : null}
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <View style={backgroundStyle} testID={'app-test'}>
            <StatusBar barStyle={'dark-content'} backgroundColor="white" />
            <GestureHandlerRootView style={backgroundStyle}>
              <React.Suspense fallback={<View />}>
                <NavigationContainer>
                  <AppNavigator initialRouteName={initialRouteName} />
                </NavigationContainer>
              </React.Suspense>
            </GestureHandlerRootView>
          </View>
        </ThemeProvider>
      </RecoilRoot>
    </Provider>
  )
}

export default App
