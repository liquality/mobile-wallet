import { NetworkEnum } from './config'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { FeeDetails } from '@liquality/types/lib/fees'

export interface WalletManagerI {
  createWallet: (wallet: WalletType, password: string) => Promise<StateType>
  retrieveWallet: () => Promise<StateType>
  restoreWallet: (password: string, state: StateType) => Promise<StateType>
  updateAddressesAndBalances: (state: StateType) => Promise<StateType>
  getPricesForAssets: (
    baseCurrencies: Array<string>,
    toCurrency: string,
  ) => Promise<{ [asset: string]: number }>
}

export interface StorageManagerI<T> {
  persist: (data: T) => Promise<boolean | Error>
  read: () => Promise<T>
}

export interface EncryptionManagerI {
  generateSalt: (byteCount: number) => string
  encrypt: (
    value: string,
    password: string,
  ) => Promise<{ encrypted: string; keySalt: string }>
  decrypt: (
    encrypted: string,
    keySalt: string,
    password: string,
  ) => Promise<string>
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

export type BalanceType = {
  [asset: string]: number
}

export type EnabledAssetType = Record<
  NetworkEnum,
  {
    [walletId: string]: Array<String>
  }
>

export type FeeType = Record<
  NetworkEnum,
  {
    [walletId: string]: {
      [asset: string]: FeeDetails
    }
  }
>

export interface AccountType {
  name: string
  chain: ChainId
  type: string
  index: number
  addresses: Array<string>
  assets: Array<string>
  balances?: BalanceType
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

export type FiatRateType = {
  [asset: string]: number
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
  enabledAssets?: EnabledAssetType
  customTokens?: any
  accounts?: AccountWrapperType
  fiatRates?: FiatRateType
  fees?: FeeType
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
  errorMessage?: string
}
