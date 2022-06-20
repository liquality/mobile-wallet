import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import SplashScreen from 'react-native-splash-screen'
import { isNewInstallation } from '../store/store'
import { Log } from '../utils'

const HandleLockWallet = ({}) => {
  const navigation = useNavigation()
  const appState = useRef(AppState.currentState)
  const [, setAppStateVisible] = useState(appState.current)

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
        //console.log('App has come to the foreground!')
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      //console.log('AppState CURRENT:', appState.current)
      if (
        appState.current === 'background' ||
        appState.current === 'inactive'
      ) {
        navigation.navigate('LoginScreen')
      }
    })

    return () => {
      subscription.remove()
    }
  }, [navigation])

  return null
}

export default HandleLockWallet
