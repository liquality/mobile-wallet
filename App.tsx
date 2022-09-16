import React, { FC, useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'

import { createSwitchNavigator } from '@react-navigation/compat'
import { ThemeProvider } from '@shopify/restyle'
import { isNewInstallation } from './src/store/store'
import {
  WalletCreationNavigator,
  WalletImportNavigator,
  MainNavigator,
} from './src/components/navigators'
import LoginScreen from './src/screens/wallet-creation/loginScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RecoilRoot } from 'recoil'
import { Box, theme } from './src/theme'

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
    const isNew = isNewInstallation()
    if (!isNew) {
      setInitialRouteName('LoginScreen')
    } else {
      setInitialRouteName('EntryScreen')
    }
    SplashScreen.hide()
  }, [])

  if (!initialRouteName) {
    return <Box />
  }

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Box style={backgroundStyle} testID={'app-test'}>
          <StatusBar barStyle={'dark-content'} backgroundColor="white" />
          <GestureHandlerRootView style={backgroundStyle}>
            <NavigationContainer>
              <AppNavigator initialRouteName={initialRouteName} />
            </NavigationContainer>
          </GestureHandlerRootView>
        </Box>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
