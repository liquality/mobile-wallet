// To make testing easier for team members
import { openSesame } from './store'

const onOpenSesame = async (dispatch: any, navigation: any) => {
  const wallet = {
    mnemomnic:
      'legend else tooth car romance thought rather share lunar reopen attend refuse',
    imported: true,
  }
  openSesame(wallet, '123123123').then((newState) => {
    dispatch({
      type: 'SETUP_WALLET',
      payload: newState,
    })

    navigation.navigate('MainNavigator')
  })
}

export { onOpenSesame }
