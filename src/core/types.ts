import { NetworkEnum } from './config'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { EthereumNetwork } from '@liquality/ethereum-networks'

export interface StorageManagerI {
  persist: (data: StateType) => Promise<boolean | Error>
  read: () => Promise<StateType | Error>
}

export interface WalletType {
  id?: string
  at?: number
  name?: string
  assets?: Array<string>
  activeNetwork?: NetworkEnum
  mnemomnic: string
  imported: boolean
}

export interface AccountType {
  name: string
  chain: ChainId
  type: string
  index: number
  addresses: Array<string>
  assets: Array<string>
  balances?: any
  color: string
  createdAt: number
  updatedAt?: number
}

export type ChainNetworkType = {
  [chainId in ChainId]?: {
    [network in NetworkEnum]: BitcoinNetwork | EthereumNetwork
  }
}

export type NetworkWrapperType = {
  [network in NetworkEnum]?: Array<AccountType>
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
  accounts?: AccountWrapperType
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
