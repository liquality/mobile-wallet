import { Dispatch, SetStateAction } from 'react'

export type RootStackParamList = {
  Entry: undefined
  TermsScreen: undefined
  PasswordCreationScreen: undefined
  WalletBackupScreen: { password: string }
  SeedPhraseConfirmationScreen: undefined
  CongratulationsScreen: undefined
}

export interface UseInputStateReturnType<T> {
  value: T
  onChangeText:
    | Dispatch<SetStateAction<T>>
    | Dispatch<SetStateAction<T | undefined>>
}

export interface SeedPhraseType {
  id: number
  word: string
}
