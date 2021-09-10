import { Dispatch, SetStateAction } from 'react'

type StackPayload = {
  termsAcceptedAt?: number
  password?: string
  seedWords?: Array<SeedWordType>
  previousScreen?: keyof RootStackParamList
  nextScreen?: keyof RootStackParamList
  seedPhrase?: string
}

export type RootStackParamList = {
  Entry: undefined
  TermsScreen: undefined
  PasswordCreationScreen: StackPayload
  WalletBackupScreen: StackPayload
  SeedPhraseConfirmationScreen: StackPayload
  CongratulationsScreen: StackPayload
  UnlockWalletScreen: StackPayload
  LoginScreen: undefined
  WalletImportNavigator: undefined
}

export interface UseInputStateReturnType<T> {
  value: T
  onChangeText:
    | Dispatch<SetStateAction<T>>
    | Dispatch<SetStateAction<T | undefined>>
}

export interface SeedWordType {
  id: number
  word: string
}
