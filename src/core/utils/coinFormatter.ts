import BigNumber from 'bignumber.js'
import { unitToCurrency, assets } from '@liquality/cryptoassets'
import { Asset } from '@liquality/cryptoassets/dist/src/types'

export const VALUE_DECIMALS = 6

export const dp = (amount: number, coin: string) => {
  if (!amount) {
    return amount
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
  amount: number,
  coin: string,
  decimalPlaces: number = VALUE_DECIMALS,
): BigNumber => {
  if (!amount || !coin) {
    return new BigNumber(amount)
  }

  const coinAsset = assets[coin] as Asset
  const currency = new BigNumber(unitToCurrency(coinAsset, amount))
  return dpUI(currency, decimalPlaces)
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

export const formatFiat = (amount: BigNumber): string => {
  return amount.toFormat(2, BigNumber.ROUND_CEIL)
}