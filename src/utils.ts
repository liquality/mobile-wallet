// To make testing easier for team members
import { createWallet } from './store/store'

const onOpenSesame = async (dispatch: any, navigation: any) => {
  const PASSWORD = '123123123'
  const MNEMONIC =
    'legend else tooth car romance thought rather share lunar reopen attend refuse'

  await dispatch(createWallet(PASSWORD, MNEMONIC))
  navigation.navigate('MainNavigator')
}

export { onOpenSesame }
