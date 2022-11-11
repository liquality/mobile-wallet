import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { storageManager, updateBalanceRatesMarketLoop } from '../store/store'
import { Log } from '../utils'
import { useInterval } from '../hooks'
import BackgroundService from 'react-native-background-actions'
import { checkPendingActionsInBackground } from '../store/store'
import { emitterController } from '../controllers/emitterController'
import { INJECTION_REQUESTS } from '../controllers/constants'
const { ON_SEND_TRANSACTION, ON_SWITCH_CHAIN } = INJECTION_REQUESTS

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

  /* AUTOMATICALLY SIGN USER OUT OF WALLET WHEN INACTIVE FOR 30 SEC IN BACKGROUND MODE */
  const handleLockPress = useCallback(() => {
    //For some reason there is unexpected behaviour when navigating to loginscreen directly
    //Therefore first navigating to settings and handling case in settings-screen solved this issue
    //perhaps not best/cleanest solution but works as expected
    navigation.navigate('SettingsScreen', {
      shouldLogOut: true,
    })
  }, [navigation])

  /* UPDATE BALANCES, RATES AND MARKET DATA EVERY 2 MIN */
  //TODO we need to agree on this value with the business team
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

  /* START OF WALLET CONNECT EVENTS LISTENING */
  useEffect(() => {
    emitterController.once(ON_SEND_TRANSACTION, async ({ params, chainId }) => {
      const [data] = params
      navigation.navigate('ApproveTransactionInjectionScreen', {
        chainId,
        walletConnectData: { ...data },
      })
    })
  }, [navigation])

  useEffect(() => {
    emitterController.on(ON_SWITCH_CHAIN, ({ params }) => {
      const [data] = params
      navigation.navigate('SwitchChainScreen', {
        walletConnectData: { ...data },
      })
    })
  }, [navigation])
  /* END OF WALLET CONNECT EVENTS LISTENING */

  /* CHECK AND TIME IF USER HAS BEEN IN BACKGROUND MODE */
  /* START BACKGROUND TASKS WHEN BACKGROUND MODE ACTIVATED SO SWAPS AND PENDING ACTIONS CAN CONTINUE RUNNING IN APP */
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
          const started = storageManager.read<string>('inactiveUserTime', '')

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
          storageManager.write('inactiveUserTime', start)
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
