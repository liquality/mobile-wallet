import { Dispatch, ReactElement, SetStateAction } from 'react'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { BigNumber, Transaction } from '@liquality/types'
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
  includeBackBtn?: boolean
  customFee?: number
  showPopup?: boolean
  sendTransaction?: {
    amount: number
    gasFee: number
    speedLabel: FeeLabel
    destinationAddress: string
    asset: string
    color: string
    memo?: string
  }
  sendTransactionConfirmation?: Transaction
  swapAssetPair?: SwapAssetPairType
  swapTransaction?: SwapInfoType
  swapTransactionConfirmation?: SwapHistoryItem
  action?: ActionEnum
  selectedAssetCodes?: string[]
  onSelectAssetCodes?: (selectedAssetCodes: string[]) => void
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
  BackupWarningScreen: undefined
  BackupSeedScreen: undefined
  BackupLoginScreen: undefined
  AssetToggleScreen: StackPayload
  ReceiveScreen: StackPayload
  SendScreen: StackPayload
  SendReviewScreen: StackPayload
  SendConfirmationScreen: StackPayload
  SwapConfirmationScreen: StackPayload
  CustomFeeScreen: StackPayload
  CustomFeeEIP1559Screen: StackPayload
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

export enum TimeLimitEnum {
  ALL = 'All',
  LAST_24HRS = 'last 24 hrs',
  LAST_WEEK = 'last week',
  LAST_MONTH = 'last month',
}

export enum ActivityStatusEnum {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Canceled',
  REFUNDED = 'Refunded',
  NEEDS_ATTENTION = 'Needs Attention',
  FAILED = 'Failed',
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
