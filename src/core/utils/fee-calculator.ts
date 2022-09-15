import { BigNumber } from '@liquality/types'
import { currencyToUnit, getAsset, isEvmChain } from '@liquality/cryptoassets'
import { prettyBalance } from '@liquality/wallet-core/dist/src/utils/coinFormatter'
import { Network } from '@liquality/cryptoassets/dist/src/types'

/**
 *
 * @param _network current activenetwork. (testnet or mainnet)
 * @param _asset asset name. (ETH)
 * @param _feePrice fee price in currency
 * @param _balance balance amount in unit
 */
export const calculateAvailableAmnt = (
  _network: Network,
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

  if (isEvmChain(_network, getAsset(_network, _asset).chain)) {
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
