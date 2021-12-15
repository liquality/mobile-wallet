// To make testing easier for team members
import { createWallet } from './store/store'
import { StateType } from './core/types'

const onOpenSesame = async (dispatch: any, navigation: any) => {
  const PASSWORD = '123123123'
  const MNEMONIC =
    'legend else tooth car romance thought rather share lunar reopen attend refuse'
  setTimeout(async () => {
    createWallet(PASSWORD, MNEMONIC)
      .then((walletState) => {
        dispatch({
          type: 'SETUP_WALLET',
          payload: walletState,
        })
        navigation.navigate('MainNavigator')
      })
      .catch(() => {
        dispatch({
          type: 'ERROR',
          payload: {
            errorMessage: 'Unable to create wallet. Try again!',
          } as StateType,
        })
      })
  }, 1000)
}

export { onOpenSesame }
