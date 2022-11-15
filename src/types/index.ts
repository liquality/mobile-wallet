import { Dispatch, ReactElement, SetStateAction } from 'react'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { FeeDetails } from '@liquality/types/lib/fees'
import { BigNumber } from '@liquality/types'
import {
  AccountId,
  FeeLabel,
  FiatRates,
  Network,
  RootState,
  SendHistoryItem,
  SwapHistoryItem,
} from '@liquality/wallet-core/dist/src/store/types'
import { Asset } from '@liquality/wallet-core/dist/src/store/types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export interface IClientMeta {
  description: string
  url: string
  icons: string[]
  name: string
}

export interface IWalletConnectSession {
  connected: boolean
  accounts: string[]
  chainId: number
  bridge: string
  key: string
  clientId: string
  clientMeta: IClientMeta | null
  peerId: string
  peerMeta: IClientMeta | null
  handshakeId: number
  handshakeTopic: string
}

export interface ISessionParams {
  approved: boolean
  chainId: number | null
  networkId: number | null
  accounts: string[] | null
  rpcUrl?: string | null
  peerId?: string | null
  peerMeta?: IClientMeta | null
}

export interface ICallTxData {
  type?: string
  to?: string
  value?: number | string
  gas?: number | string
  gasLimit?: number | string
  gasPrice?: number | string
  nonce?: number | string
  data?: string
}

export interface ITxData extends ICallTxData {
  from: string
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
export interface NFTAsset {
  length: number
  token_id?: string
  asset_contract?: {
    address?: string
    name?: string
    symbol?: string
    image_url?: string
    external_link?: string
  }
  collection?: {
    name: string
  }
  id?: number
  description?: string
  external_link?: string
  image_original_url?: string
  image_preview_url?: string
  image_thumbnail_url?: string
  name?: string
  amount?: string
  standard?: string
}

export interface NFTWithAccount extends NFT {
  accountId: AccountId
}

export interface NFT extends NFTAsset {
  starred: boolean
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
  fromNetworkFee: CustomNetworkFeeType
  toNetworkFee: CustomNetworkFeeType
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
  code?: string
  amountInput?: string
  fee?: GasFees | null
  speedMode?: FeeLabel
  isPrivateKey?: boolean
  walletId?: string
  accountId?: string
  chain?: ChainId
  network?: Network
  accountName?: string
  shortenAddress?: string
  isScrolledUp?: boolean
  token?: string
  showIntro?: boolean
  showProvideIcon?: boolean
  assetsAreSameChain?: boolean
  specificAsset?: string
  chainId?: number
  walletConnectData?: ICallTxData
}

export type SettingStackParamList = {
  Settings: { shouldLogOut?: boolean }
}

export type RootStackParamList = {
  Entry: undefined
  TermsScreen: StackPayload
  SeedPhraseScreen: StackPayload
  SeedPhraseConfirmationScreen: StackPayload
  PasswordCreationScreen: StackPayload
  UnlockWalletScreen: StackPayload
  LoadingScreen: StackPayload
  LoginScreen: undefined
  CongratulationsScreen: undefined
  AboutLiqualityDrawer: StackPayload
}

export type LoginStackParamList = {
  LoginScreen: undefined
  TermsScreen: StackPayload
  UnlockWalletScreen: StackPayload
  PasswordCreationScreen: StackPayload
  LoadingScreen: StackPayload
  CongratulationsScreen: undefined
}

export type MainStackParamList = {
  OverviewScreen: StackPayload
  AssetChooserScreen: StackPayload
  AssetScreen: StackPayload
  AssetManagementScreen: StackPayload
  BackupWarningScreen: StackPayload
  BackupSeedScreen: { screenTitle?: string }
  BackupPrivateKeyScreen: StackPayload
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
  MainNavigator: undefined
  AppStackNavigator: undefined
  NftForSpecificChainScreen: {
    screenTitle?: string
    currentAccount?: AccountType
  }
  NftSendScreen: {
    nftItem?: NFTAsset
    accountIdsToSendIn: Object
  }
  NftDetailScreen: {
    screenTitle?: string
    nftItem?: NFTAsset
    accountIdsToSendIn: string[]
  }
  NftCollectionScreen: {
    nftCollection: NFTAsset[]
    accountIdsToSendIn: string[]
  }
  SettingsScreen: { shouldLogOut?: boolean }
  WithPopupMenu: undefined
  BuyCryptoDrawer: StackPayload
  SwapProviderModal: StackPayload
  SelectChainScreen: undefined
  SwapDetailsScreen: StackPayload
  ActivityFilterScreen: StackPayload
  SortingModal: StackPayload
  AdvancedFilterModal: StackPayload
  AccountManagementScreen: StackPayload
  SwapProviderInfoDrawer: StackPayload
  AccountDetailScreen: StackPayload
  InitInjectionScreen: StackPayload
  SwitchChainScreen: StackPayload
  ApproveTransactionInjectionScreen: StackPayload
  NftOverviewScreen: StackPayload
  AboutLiqualityDrawer: StackPayload
}

export type RootTabParamList = {
  AppStackNavigator: undefined
  SettingsScreen: { shouldLogOut?: boolean }
  ShowAllNftsScreen: undefined
}

export type RootParentStackList = {
  WalletCreationNavigator: undefined
  StackMainNavigator: undefined
  LoginStack: undefined
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

export enum LanguageEnum {
  English = 'en',
  Spanish = 'es',
  Mandarin = 'zh',
}

export enum ActionEnum {
  SEND = 'SEND',
  SWAP = 'SWAP',
  RECEIVE = 'RECEIVE',
  NFT = 'NFT',
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
  WAITING_FOR_CONFIRMATIONS = 'WAITING_FOR_CONFIRMATIONS',
}

export type NetworkFeeType = {
  speed: FeeLabel
  value: number
}

export enum CustomFeeLabel {
  Custom = 'custom',
}

export type ExtendedFeeLabel = CustomFeeLabel | FeeLabel

export type CustomNetworkFeeType = {
  speed: FeeLabel | CustomFeeLabel
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

export interface CustomRootState extends RootState {
  digestedState?: {
    totalFiatBalance: number
    accounts: Record<Asset, AccountType>
    fiatRates: FiatRates
  }
  assetFilter?: {
    timeLimit?: string
    actionTypes?: string[]
    dateRange?: {
      start: string | undefined
      end: string | undefined
    }
    activityStatuses?: string[]
    assetToggles?: string[]
    sorter?: string | undefined
    codeSort?: string | undefined
  }
}

export enum ErrorMessages {
  NotEnoughToken,
  NotEnoughTokenSelectMax,
  NotEnoughCoverFees,
  NotEnoughGas,
  AdjustSending,
}

export interface ErrorMsgAndType {
  msg: string
  type: ErrorMessages | null
}

export type SendToastProps = {
  errorMessage: {
    msg: string
    type: ErrorMessages
  }
  code: string
  amount: string
  onGetPress: () => void
  onMaxPress: () => void
  resetMsg: () => void
}

export type AccountIdType = {
  id: string
  name: Asset
}

export type NavigationProps = NativeStackScreenProps<
  MainStackParamList,
  | 'OverviewScreen'
  | 'SendConfirmationScreen'
  | 'BackupWarningScreen'
  | 'AssetManagementScreen'
  | 'AssetChooserScreen'
  | 'ReceiveScreen'
  | 'SwapDetailsScreen'
  | 'AssetScreen'
  | 'SendScreen'
  | 'BuyCryptoDrawer'
  | 'SwapScreen'
  | 'SwapProviderModal'
  | 'ActivityFilterScreen'
  | 'AccountManagementScreen'
  | 'SwapProviderInfoDrawer'
  | 'AccountDetailScreen'
  | 'InitInjectionScreen'
  | 'SwitchChainScreen'
  | 'ApproveTransactionInjectionScreen'
  | 'AboutLiqualityDrawer'
>
