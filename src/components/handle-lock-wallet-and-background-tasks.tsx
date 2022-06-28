import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { updateBalanceRatesMarketLoop } from '../store/store'
import { Log } from '../utils'
import { useInterval } from '../hooks'
import BackgroundService from 'react-native-background-actions'
import { checkPendingActionsInBackground } from '../store/store'

//BackgroundService.start() expect these options
const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title', //Android Required
  taskDesc: 'ExampleTask description', //Android Required
  // Android Required
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  parameters: {
    delay: 1000,
  },
}
const HandleLockWalletAndBackgroundTasks = ({}) => {
  const navigation = useNavigation()
  const appState = useRef(AppState.currentState)
  const [, setAppStateVisible] = useState(appState.current)
  const [isRunning] = useState(true)

  const handleLockPress = useCallback(() => {
    //For some reason there is unexpected behaviour when navigating to loginscreen directly
    //Therefore first navigating to settings and handling case in settings-screen solved this issue
    //perhaps not best/cleanest solution but works as expected
    navigation.navigate('SettingsScreen', {
      shouldLogOut: true,
    })
  }, [navigation])

  //Update balances, rates and market data every 2 minutes
  const interval = 120000
  useInterval(
    () => {
      try {
        updateBalanceRatesMarketLoop()
      } catch (err: unknown) {
        Log(`Could not update balances in loop: ${err}`, 'error')
      }
    },
    isRunning ? interval : null,
  )

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          //App has come to the foreground again
          BackgroundService.stop()

          var end = new Date().getTime()
          const started = await AsyncStorage.getItem('inactiveUserTime')

          var time = end - Number(started)
          if (time > 30000) {
            handleLockPress()
          }
        }

        //To fetch current appstate use appState.current
        appState.current = nextAppState
        setAppStateVisible(appState.current)
        if (
          appState.current === 'background' ||
          appState.current === 'inactive'
        ) {
          //Now we are in the background/inactive state
          var start = new Date().getTime().toString()
          await AsyncStorage.setItem('inactiveUserTime', start)
          BackgroundService.start(performBackgroundTask, options).then(() => {
            // Only Android, iOS will ignore this call
            // iOS will also run everything here in the background until .stop() is called
            BackgroundService.stop()
          })
        }
      },
    )

    return () => {
      subscription.remove()
    }
  }, [navigation, handleLockPress])

  const performBackgroundTask = async () => {
    await checkPendingActionsInBackground()
  }

  return null
}

export default HandleLockWalletAndBackgroundTasks
