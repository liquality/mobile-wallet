// To make testing easier for team members
import { createWallet } from './store/store'
import { StateType } from './core/types'
import { InteractionManager } from 'react-native'

const onOpenSesame = async (dispatch: any, navigation: any) => {
  const PASSWORD = '123123123'
  const MNEMONIC =
    'legend else tooth car romance thought rather share lunar reopen attend refuse'
  InteractionManager.runAfterInteractions(() => {
    createWallet(PASSWORD, MNEMONIC)
      .then((walletState) => {
        dispatch({
          type: 'SETUP_WALLET',
          payload: walletState,
        })
      })
      .catch(() => {
        dispatch({
          type: 'ERROR',
          payload: {
            errorMessage: 'Unable to create wallet. Try again!',
          } as StateType,
        })
      })
  }).done(() => {
    navigation.navigate('MainNavigator')
  })
}

export { onOpenSesame }
