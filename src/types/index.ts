import { Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { NetworkEnum } from '../core/types'

export type AssetDataElementType = {
  id: string
  name: string
  code?: string
  chain?: ChainId
  address?: string
  balance?: BigNumber
  balanceInUSD?: BigNumber
  color?: string
  assets?: Array<AssetDataElementType>
  showAssets?: boolean
  fees?: FeeDetails
  activeNetwork?: NetworkEnum
}

export type StackPayload = {
  termsAcceptedAt?: number
  password?: string
  seedWords?: Array<SeedWordType>
  previousScreen?: keyof RootStackParamList
  nextScreen?: keyof RootStackParamList
  seedPhrase?: string
  mnemonic?: string
  imported?: boolean
  assetData?: AssetDataElementType
  screenTitle?: string
  customFee?: number
  showPopup?: boolean
  sendTransaction?: {
    amount?: BigNumber
    gasFee?: BigNumber
    destinationAddress?: string
    asset?: string
  }
  action?: ActionEnum
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
  AssetChooserScreen: StackPayload
  AssetScreen: StackPayload
  AssetManagementScreen: StackPayload
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

export enum DarkModeEnum {
  Light,
  Dark,
}

export enum ActionEnum {
  SEND,
  SWAP,
  RECEIVE,
}
