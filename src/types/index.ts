import { Dispatch, ReactElement, SetStateAction } from 'react'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { BigNumber } from '@liquality/types'
import {
  FeeLabel,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/store/types'

export type AssetDataElementType = {
  id: string
  name: string
  code: string
  chain: ChainId
  address?: string
  balance: number
  balanceInUSD?: number
  color?: string
  assets?: Array<AssetDataElementType>
  showAssets?: boolean
  fees?: FeeDetails
  activeNetwork?: any
}

export type SwapAssetPairType = {
  fromAsset?: AssetDataElementType
  toAsset?: AssetDataElementType
}

export type SwapInfoType = {
  fromAsset: AssetDataElementType
  toAsset: AssetDataElementType
  fromAmount: number
  toAmount: number
  quote: any
  fromNetworkFee: NetworkFeeType
  toNetworkFee: NetworkFeeType
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
    amount?: number
    gasFee?: number
    destinationAddress?: string
    asset?: string
  }
  sendTransactionConfirmation?: any
  swapAssetPair?: SwapAssetPairType
  swapTransaction?: SwapInfoType
  swapTransactionConfirmation?: SwapHistoryItem
  action?: ActionEnum
}

export type RootStackParamList = {
  Entry: undefined
  TermsScreen: StackPayload
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
  SwapConfirmationScreen: StackPayload
  CustomFeeScreen: StackPayload
  SwapScreen: StackPayload
  SwapReviewScreen: StackPayload
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

export type ProviderType = {
  name: string
  rate: number
  icon: () => ReactElement
}

export enum DarkModeEnum {
  Light,
  Dark,
}

export enum ActionEnum {
  SEND = 'SEND',
  SWAP = 'SWAP',
  RECEIVE = 'RECEIVE',
}

export type NetworkFeeType = {
  speed: FeeLabel
  value: number
}

export interface CustomFeeDetails extends FeeDetails {
  custom: {
    fee: number
  }
}

export type GasFees = Record<'slow' | 'average' | 'fast' | 'custom', BigNumber>
