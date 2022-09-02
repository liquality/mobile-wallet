import { BigNumber } from '@liquality/types'
import {
  currencyToUnit,
  getAsset,
  getChain,
  isEvmChain,
  unitToCurrency,
} from '@liquality/cryptoassets'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'

const isERC20 = (network: string, asset: string) => {
  return getAsset(network, asset)?.type === 'erc20'
}

/**
 * Converts gas fees from unit to currency (eg: GWEI -> ETH)
 * @param _asset asset name (ETH)
 * @param _feePrice fee price in units
 */
//TODO double check this logic
export const calculateGasFee = (
  _network: string,
  _asset: string,
  _feePrice: number,
): number => {
  if (!_asset || !_feePrice || _feePrice <= 0) {
    throw new Error('Invalid arguments')
  }

  if (!getAsset(_network, _asset)) {
    throw new Error('Invalid asset name')
  }

  const units: Record<string, number> = {
    BTC: 290,
    ETH: 21000,
    RBTC: 21000,
    BNB: 21000,
    NEAR: 10000000000000,
    SOL: 1000000,
    MATIC: 21000,
    ERC20: 90000,
    ARBETH: 620000,
  }

  const chainId = getAsset(_network, _asset).chain
  const nativeAsset = getChain(network, chainId)
  const feePrice = isEvmChain(_network, chainId)
    ? new BigNumber(_feePrice).times(1e9)
    : _feePrice // ETH fee price is in gwei
  const asset = isERC20(_network, _asset) ? 'ERC20' : _asset
  const feeUnit = units[asset]

  return unitToCurrency(
    getAsset(_network, nativeAsset),
    new BigNumber(feeUnit).times(feePrice).toNumber(),
  )
    .dp(6)
    .toNumber()
}

/**
 *
 * @param _asset asset name. (ETH)
 * @param _feePrice fee price in currency
 * @param _balance balance amount in unit
 */
export const calculateAvailableAmnt = (
  _network: string,
  _asset: string,
  _feePrice: number,
  _balance: number,
): string => {
  if (!_asset || !_feePrice || _feePrice <= 0) {
    throw new Error('Invalid arguments')
  }

  if (!getAsset(_network, _asset)) {
    throw new Error('Invalid asset name')
  }

  if (isERC20(_network, _asset)) {
    return prettyBalance(new BigNumber(_balance), _asset).toString()
  } else {
    const available = BigNumber.max(
      new BigNumber(_balance).minus(
        currencyToUnit(getAsset(_network, _asset), _feePrice),
      ),
      0,
    )

    return prettyBalance(available, _asset).toString()
  }
}
