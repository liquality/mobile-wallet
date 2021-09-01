import { NetworkEnum } from './config'

export interface StorageManagerI {
  persist: (key: string, data: any) => Promise<boolean>
  read: (key: string) => Promise<any>
}

export interface WalletType {
  id: string
  at: number
  name: string
  mnemomnic: string
  imported: boolean
}

export interface AccountType {
  id: string
  name: string
  chain: string
  type: string
  index: number
  addresses: Array<string>
  assets: Array<string>
  balances?: any
  color: string
  createdAt: number
  updatedAt?: number
}

export type NetworkWrapperType = {
  [network in NetworkEnum]: AccountType
}

export type AccountWrapperType = {
  [id: string]: NetworkWrapperType
}

export interface StateType {
  // <do not keep these in localStorage>
  key?: string
  wallets?: Array<WalletType>
  unlockedAt?: number
  // </do not keep these in localStorage>

  version?: number
  brokerReady?: boolean
  encryptedWallets?: string
  enabledAssets?: any
  customTokens?: any
  accounts?: any
  fiatRates?: any
  fees?: any
  history?: any
  marketData?: any
  activeNetwork?: NetworkEnum
  activeWalletId?: string
  activeAsset?: any
  keyUpdatedAt?: number
  keySalt?: string
  termsAcceptedAt?: number
  setupAt?: number
  injectEthereum?: boolean
  injectEthereumChain?: string
  usbBridgeWindowsId?: number
  externalConnections?: any
  analytics?: {
    userId: string
    acceptedDate: number
    askedDate: number
    askedTimes: number
    notAskAgain: boolean
  }
}
