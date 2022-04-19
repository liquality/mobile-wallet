import { BigNumber } from '@liquality/types'
import {
  assets as cryptoassets,
  unitToCurrency,
  assets,
  isEthereumChain,
  chains,
} from '@liquality/cryptoassets'
import { Asset } from '@liquality/cryptoassets/dist/src/types'
import { isERC20 } from '@liquality/wallet-core/dist/utils/asset'

const SEND_FEE_UNITS: Record<string, number> = {
  BTC: 290,
  ETH: 21000,
  RBTC: 21000,
  BNB: 21000,
  NEAR: 10000000000000,
  SOL: 1000000,
  MATIC: 21000,
  ERC20: 90000,
  ARBETH: 620000,
  AVAX: 21000,
  LUNA: 100000,
  UST: 100000,
  FUSE: 21000,
}

export const VALUE_DECIMALS = 6
BigNumber.config({ EXPONENTIAL_AT: 1e9 })

//TODO It is not clear how we should format amounts
export const dp = (amount: number, coin: string): BigNumber => {
  if (!amount) {
    return new BigNumber(amount)
  }
  return new BigNumber(amount).dp(assets[coin].decimals)
}

export const dpUI = (
  amount: BigNumber,
  decimalPlaces: number = VALUE_DECIMALS,
): BigNumber => {
  if (!amount) {
    return amount
  }

  return new BigNumber(amount).dp(decimalPlaces, BigNumber.ROUND_FLOOR)
}

export const prettyBalance = (
  amount: BigNumber,
  coin: string,
  decimalPlaces: number = VALUE_DECIMALS,
): string => {
  if (!amount || !coin) {
    return '--'
  }

  const coinAsset = assets[coin] as Asset
  const currency = new BigNumber(unitToCurrency(coinAsset, amount.toNumber()))
  return dpUI(currency, decimalPlaces).toString()
}

export const prettyFiatBalance = (amount: number, rate: number): string => {
  if (!amount || !rate) {
    return `${amount}`
  }
  const fiatAmount = cryptoToFiat(amount, rate)
  return formatFiat(fiatAmount)
}

export const cryptoToFiat = (amount: number, rate: number): BigNumber => {
  if (!rate) {
    return new BigNumber(amount)
  }
  return new BigNumber(amount).times(rate)
}

export const fiatToCrypto = (amount: BigNumber, rate: number): BigNumber => {
  if (!rate) {
    return amount
  }
  return new BigNumber(amount)
    .dividedBy(rate)
    .dp(VALUE_DECIMALS, BigNumber.ROUND_FLOOR)
}

export const formatFiat = (amount: BigNumber | number): string => {
  if (!BigNumber.isBigNumber(amount)) {
    return new BigNumber(amount).toFormat(2, BigNumber.ROUND_CEIL)
  }

  return amount.toFormat(2, BigNumber.ROUND_CEIL)
}

export const gasUnitToCurrency = (
  asset: string,
  amount: BigNumber,
): BigNumber => {
  return isEthereumChain(assets[asset].chain)
    ? new BigNumber(amount).dividedBy(1e9)
    : new BigNumber(amount)
}

export const getTxFee = (asset: string, feePrice: number) => {
  const chainId = cryptoassets[asset].chain
  const nativeAsset = chains[chainId].nativeAsset
  const _feePrice = isEthereumChain(cryptoassets[asset].chain)
    ? new BigNumber(feePrice).times(1e9)
    : feePrice // ETH fee price is in gwei
  const _asset = isERC20(asset) ? 'ERC20' : asset
  const feeUnits = SEND_FEE_UNITS[_asset]
  const fee = new BigNumber(feeUnits).times(_feePrice)
  return unitToCurrency(cryptoassets[nativeAsset], fee)
}
