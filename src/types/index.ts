import { Dispatch, ReactElement, SetStateAction } from 'react'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { BigNumber } from '@liquality/types'
import {
  FeeLabel,
  Network,
  SendHistoryItem,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import { Asset } from '@liquality/wallet-core/dist/src/store/types'

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
  fees?: FeeDetails
  activeNetwork?: any
}

export interface AccountType {
  id: string
  name: string
  code: string
  chain: ChainId
  address?: string
  balance: number
  balanceInUSD?: number
  color?: string
  assets: Record<Asset, AccountType>
  fees?: FeeDetails
  activeNetwork?: Network
}

export type SwapAssetPairType = {
  fromAsset?: AccountType
  toAsset?: AccountType
}

export type SwapInfoType = {
  fromAsset: AccountType
  toAsset: AccountType
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
  assetData?: AccountType
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
  sendTransactionConfirmation?: SendHistoryItem
  swapAssetPair?: SwapAssetPairType
  swapTransaction?: SwapInfoType
  swapTransactionConfirmation?: SwapHistoryItem
  action?: ActionEnum
  selectedAssetCodes?: string[]
  onSelectAssetCodes?: (selectedAssetCodes: string[]) => void
  amountInput?: string
  code?: string
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
  OverviewScreen: StackPayload
  AssetChooserScreen: StackPayload
  AssetScreen: StackPayload
  AssetManagementScreen: StackPayload
  BackupWarningScreen: StackPayload
  BackupSeedScreen: { screenTitle?: string }
  BackupLoginScreen: { backupSeed?: boolean; screenTitle?: string }
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

export type RootTabParamList = {
  AppStackNavigator: undefined
  SettingsScreen: { shouldLogOut?: boolean }
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
  Light = 'light',
  Dark = 'dark',
  Null = '',
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
export type TotalFees = Record<'slow' | 'average' | 'fast', BigNumber>

export type LikelyWait = {
  slow?: string | number
  average?: string | number
  fast?: string | number
}
