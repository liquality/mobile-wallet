import { StateType, StorageManagerI } from './types'
import config, {
  accountColors,
  chainDefaultColors,
  ChainNetworks,
  NetworkEnum,
} from './config'
import { bitcoin } from '@liquality/types'
import { ChainId } from '@liquality/cryptoassets'
import { Client } from '@liquality/client'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { BitcoinJsWalletProvider } from '@liquality/bitcoin-js-wallet-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { BitcoinFeeApiProvider } from '@liquality/bitcoin-fee-api-provider'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { EthereumRpcFeeProvider } from '@liquality/ethereum-rpc-fee-provider'
import { EthereumGasNowFeeProvider } from '@liquality/ethereum-gas-now-fee-provider'
import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider'
import { EthereumJsWalletProvider } from '@liquality/ethereum-js-wallet-provider'

const BITCOIN_FEE_API_URL =
  'https://liquality.io/swap/mempool/v1/fees/recommended'

export default class AbstractWalletManager {
  cryptoassets: any
  storageManager: StorageManagerI | undefined

  protected getNextAccountColor(chain: string, index: number) {
    const defaultColor = chainDefaultColors[chain]
    const defaultIndex = accountColors.findIndex((c) => c === defaultColor)
    if (defaultIndex === -1) {
      return defaultColor
    }
    const finalIndex = index + defaultIndex
    if (finalIndex >= accountColors.length) {
      return accountColors[defaultIndex]
    }
    return accountColors[finalIndex]
  }

  // Derivation paths calculation
  protected getBitcoinDerivationPath(coinType: string, index: number) {
    const BTC_ADDRESS_TYPE_TO_PREFIX = {
      legacy: 44,
      'p2sh-segwit': 49,
      bech32: 84,
    }
    return `${
      BTC_ADDRESS_TYPE_TO_PREFIX[bitcoin.AddressType.BECH32]
    }'/${coinType}'/${index}'`
  }

  protected getEthereumBasedDerivationPath = (
    coinType: string,
    index: number,
  ) => `m/44'/${coinType}'/${index}'/0/0`

  protected calculateDerivationPaths(
    chainId: ChainId,
  ): (network: NetworkEnum, index: number) => string | undefined {
    if (chainId === ChainId.Bitcoin) {
      return (network: NetworkEnum, index: number) => {
        const bitcoinNetwork = ChainNetworks[ChainId.Bitcoin]![network]
        return this.getBitcoinDerivationPath(bitcoinNetwork.coinType, index)
      }
    }
    return (network: NetworkEnum, index: number) => {
      const ethNetwork = ChainNetworks[ChainId.Ethereum]![network]
      return this.getEthereumBasedDerivationPath(ethNetwork.coinType, index)
    }
  }

  protected createBtcClient(
    network: NetworkEnum,
    mnemonic: string,
    accountType: string,
    derivationPath: string,
  ) {
    const isTestnet = network === NetworkEnum.Testnet
    const bitcoinNetwork = ChainNetworks[ChainId.Bitcoin]![network]
    const esploraApi = config.exploraApis[network]
    const batchEsploraApi = config.batchEsploraApis[network]

    const btcClient = new Client()
    btcClient.addProvider(
      new BitcoinEsploraBatchApiProvider({
        batchUrl: batchEsploraApi,
        url: esploraApi,
        network: bitcoinNetwork as BitcoinNetwork,
        numberOfBlockConfirmation: 2,
      }),
    )

    btcClient.addProvider(
      new BitcoinJsWalletProvider({
        network: bitcoinNetwork as BitcoinNetwork,
        mnemonic,
        baseDerivationPath: derivationPath,
      }),
    )

    if (isTestnet) {
      btcClient.addProvider(new BitcoinRpcFeeProvider())
    } else {
      btcClient.addProvider(new BitcoinFeeApiProvider(BITCOIN_FEE_API_URL))
    }

    return btcClient
  }

  protected createEthereumClient(
    ethereumNetwork: EthereumNetwork,
    rpcApi: string,
    feeProvider: EthereumRpcFeeProvider | EthereumGasNowFeeProvider,
    mnemonic: string,
    derivationPath: string,
  ) {
    const ethClient = new Client()
    ethClient.addProvider(new EthereumRpcProvider({ uri: rpcApi }))

    ethClient.addProvider(
      new EthereumJsWalletProvider({
        network: ethereumNetwork,
        mnemonic,
        derivationPath,
      }),
    )

    ethClient.addProvider(feeProvider)

    return ethClient
  }

  protected async persistToLocalStorage(state: StateType) {
    await this.storageManager?.persist(state)
  }
}
