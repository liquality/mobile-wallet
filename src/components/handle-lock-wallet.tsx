import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HandleLockWallet = ({}) => {
  const navigation = useNavigation()
  const appState = useRef(AppState.currentState)
  const [, setAppStateVisible] = useState(appState.current)

  const handleLockPress = useCallback(() => {
    //For some reason there is unexpected behaviour when navigating to loginscreen directly
    //Therefore first navigating to settings and handling case in settings-screen solved this issue
    //perhaps not best/cleanest solution but works as expected
    navigation.navigate('SettingsScreen', {
      shouldLogOut: true,
    })
  }, [navigation])

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
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
          var start = new Date().getTime().toString()
          await AsyncStorage.setItem('inactiveUserTime', start)
        }
      },
    )

    return () => {
      subscription.remove()
    }
  }, [navigation, handleLockPress])

  return null
}

export default HandleLockWallet
