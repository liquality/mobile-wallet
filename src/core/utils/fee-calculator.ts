import { BigNumber } from '@liquality/types'
import {
  assets as cryptoassets,
  chains,
  currencyToUnit,
  isEthereumChain,
  unitToCurrency,
} from '@liquality/cryptoassets'
import { prettyBalance } from '@liquality/wallet-core/dist/utils/coinFormatter'

const isERC20 = (asset: string) => {
  return cryptoassets[asset]?.type === 'erc20'
}

/**
 * Converts gas fees from unit to currency (eg: GWEI -> ETH)
 * @param _asset asset name (ETH)
 * @param _feePrice fee price in units
 */
//TODO double check this logic
export const calculateGasFee = (_asset: string, _feePrice: number): number => {
  if (!_asset || !_feePrice || _feePrice <= 0) {
    throw new Error('Invalid arguments')
  }

  if (!cryptoassets[_asset]) {
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

  const chainId = cryptoassets[_asset].chain
  const nativeAsset = chains[chainId].nativeAsset
  const feePrice = isEthereumChain(chainId)
    ? new BigNumber(_feePrice).times(1e9)
    : _feePrice // ETH fee price is in gwei
  const asset = isERC20(_asset) ? 'ERC20' : _asset
  const feeUnit = units[asset]

  return unitToCurrency(
    cryptoassets[nativeAsset],
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
  _asset: string,
  _feePrice: number,
  _balance: number,
): string => {
  if (!_asset || !_feePrice || _feePrice <= 0) {
    throw new Error('Invalid arguments')
  }

  if (!cryptoassets[_asset]) {
    throw new Error('Invalid asset name')
  }

  if (isERC20(_asset)) {
    return prettyBalance(new BigNumber(_balance), _asset).toString()
  } else {
    const available = BigNumber.max(
      new BigNumber(_balance).minus(
        currencyToUnit(cryptoassets[_asset], _feePrice),
      ),
      0,
    )

    return prettyBalance(available, _asset).toString()
  }
}
