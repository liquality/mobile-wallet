import { Dispatch, SetStateAction } from 'react'
import { DataElementType } from '../components/asset-flat-list'
import BigNumber from 'bignumber.js'

export type StackPayload = {
  termsAcceptedAt?: number
  password?: string
  seedWords?: Array<SeedWordType>
  previousScreen?: keyof RootStackParamList
  nextScreen?: keyof RootStackParamList
  seedPhrase?: string
  mnemonic?: string
  imported?: boolean
  assetData?: DataElementType
  screenTitle?: string
  customFee?: number
  sendTransaction?: {
    amount?: BigNumber
    gasFee?: BigNumber
    destinationAddress?: string
    asset?: string
  }
}

export type RootStackParamList = {
  Entry: undefined
  TermsScreen: undefined
  PasswordCreationScreen: StackPayload
  SeedPhraseScreen: StackPayload
  SeedPhraseConfirmationScreen: StackPayload
  CongratulationsScreen: undefined
  UnlockWalletScreen: StackPayload
  LoginScreen: undefined
  LoadingScreen: StackPayload
  OverviewScreen: undefined
  AssetScreen: StackPayload
  ReceiveScreen: StackPayload
  SendScreen: StackPayload
  SendReviewScreen: StackPayload
  SendConfirmationScreen: StackPayload
  CustomFeeScreen: StackPayload
  WalletImportNavigator: undefined
  MainNavigator: undefined
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
