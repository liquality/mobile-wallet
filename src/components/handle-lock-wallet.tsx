import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useNavigation } from '@react-navigation/core'

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
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //App has come to the foreground
      }

      //To fetch current appstate use appState.current
      appState.current = nextAppState
      setAppStateVisible(appState.current)
      if (
        appState.current === 'background' ||
        appState.current === 'inactive'
      ) {
        setTimeout(() => {
          handleLockPress()
        }, 5000)
      }
    })

    return () => {
      subscription.remove()
    }
  }, [navigation, handleLockPress])

  return null
}

export default HandleLockWallet
