import { StateType } from './types'

interface WalletMapperI<T> {
  getRawState: () => T
  getAssetCount: () => number
  getAssetList?: () => any[]
  getTotalBalanceInUSD?: () => number
  getBalanceInNative?: (asset: string) => number
  getBalanceInUSD?: (asset: string) => number
  getGasFees?: (asset: string) => number[]
}

export class WalletMapper implements WalletMapperI<StateType> {
  state: StateType
  assetCount: number
  assetList: any[]
  balanceInNative: number
  balanceInUSD: number

  constructor(state: StateType) {
    this.state = state
    this.assetCount = 0
    this.assetList = []
    this.balanceInNative = 0
    this.balanceInUSD = 0
  }

  public getRawState(): StateType {
    return this.state
  }

  public getAssetCount(): number {
    return 0
  }
}
