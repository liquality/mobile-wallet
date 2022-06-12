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

/* import BackgroundService from 'react-native-background-actions'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
 */
// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).

/* const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  setInterval(function () {
    console.log('This should fire every 5s even when app is closed')
    //PushNotificationIOS.addNotificationRequest(payload)
  }, 5000)
} */
/* 
const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
} */

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

  /*  BackgroundService.start(veryIntensiveTask, options)
    .then(() => {
      BackgroundService.updateNotification({
        taskDesc: 'New ExampleTask description',
      })
    })
    .then(() => {
      // Only Android, iOS will ignore this call
      // iOS will also run everything here in the background until .stop() is called
      BackgroundService.stop()
    }) */

  useEffect(() => {
    //PushNotificationIOS.addEventListener('localNotification', veryIntensiveTask)

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
