import React, { FC, useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context'

import { ThemeProvider as TP } from '@shopify/restyle'
import { isNewInstallation } from './src/store/store'
import {
  WalletCreationNavigator,
  StackMainNavigator,
} from './src/components/navigators'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { Box, theme, darkTheme, toastConfig } from './src/theme'
import { StatusBar, useColorScheme } from 'react-native'
import { themeMode } from './src/atoms'
import { createSwitchNavigator } from '@react-navigation/compat'
import Toast from 'react-native-toast-message'

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
      StackMainNavigator,
      WalletCreationNavigator,
    },
    {
      initialRouteName,
    },
  )
  return <Navigator />
}

const App: FC = () => {
  const [initialRouteName, setInitialRouteName] = useState('')
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    const isNew = isNewInstallation()
    if (!isNew) {
      setInitialRouteName('StackMainNavigator')
    } else {
      setInitialRouteName('WalletCreationNavigator')
    }
    SplashScreen.hide()
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
      <Toast config={toastConfig} />
    </RecoilRoot>
  )
}

export default App
