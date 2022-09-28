import React, { FC, useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context'

import { createSwitchNavigator } from '@react-navigation/compat'
import { ThemeProvider as TP } from '@shopify/restyle'
import { isNewInstallation } from './src/store/store'
import {
  WalletCreationNavigator,
  WalletImportNavigator,
  MainNavigator,
} from './src/components/navigators'
import LoginScreen from './src/screens/wallet-creation/loginScreen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { Box, theme, darkTheme } from './src/theme'
import { StatusBar, useColorScheme } from 'react-native'
import { themeMode } from './src/atoms'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const selectedTheme = useRecoilValue(themeMode)
  let colorScheme = useColorScheme() as string
  if (selectedTheme) {
    colorScheme = selectedTheme
  }

  const statusBar = colorScheme === 'dark' ? 'light-content' : 'dark-content'

  const currentTheme = colorScheme === 'dark' ? darkTheme : theme

  return (
    <TP theme={currentTheme}>
      <StatusBar barStyle={statusBar} />
      {children}
    </TP>
  )
}

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

  const isNew = isNewInstallation()
  useEffect(() => {
    if (!isNew) {
      setInitialRouteName('LoginScreen')
    } else {
      setInitialRouteName('EntryScreen')
    }
    SplashScreen.hide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!initialRouteName) {
    return <Box />
  }

  return (
    <RecoilRoot>
      <SafeAreaProvider
        initialMetrics={initialWindowMetrics}
        testID={'app-test'}>
        <ThemeProvider>
          <GestureHandlerRootView style={backgroundStyle}>
            <NavigationContainer>
              <AppNavigator initialRouteName={initialRouteName} />
            </NavigationContainer>
          </GestureHandlerRootView>
        </ThemeProvider>
      </SafeAreaProvider>
    </RecoilRoot>
  )
}

export default App
