import { ChainNetworkType, NetworkEnum } from './types'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { EthereumNetworks } from '@liquality/ethereum-networks'

export const accountColors = [
  '#000000',
  '#1CE5C3',
  '#007AFF',
  '#4F67E4',
  '#9D4DFA',
  '#D421EB',
  '#FF287D',
  '#FE7F6B',
  '#EAB300',
  '#F7CA4F',
  '#A1E44A',
  '#3AB24D',
  '#8247E5',
]

export const chainDefaultColors: Partial<Record<ChainId, string>> = {
  bitcoin: '#EAB300',
  ethereum: '#4F67E4',
  rsk: '#3AB24D',
  bsc: '#F7CA4F',
  near: '#000000',
  polygon: '#8247E5',
  arbitrum: '#28A0EF',
}

export const ChainNetworks: Partial<ChainNetworkType> = {
  [ChainId.Bitcoin]: {
    [NetworkEnum.Testnet]: BitcoinNetworks.bitcoin_testnet,
    [NetworkEnum.Mainnet]: BitcoinNetworks.bitcoin,
  },
  [ChainId.Ethereum]: {
    [NetworkEnum.Testnet]: EthereumNetworks.ropsten,
    [NetworkEnum.Mainnet]: EthereumNetworks.ethereum_mainnet,
  },
}

export default {
  defaultAssets: {
    mainnet: [
      'BTC',
      'ETH',
      'DAI',
      'USDC',
      'USDT',
      'WBTC',
      'UNI',
      'RBTC',
      'SOV',
      'BNB',
      'NEAR',
      'MATIC',
      'PWETH',
      'ARBETH',
    ],
    testnet: [
      'BTC',
      'ETH',
      'DAI',
      'RBTC',
      'BNB',
      'NEAR',
      'SOV',
      'MATIC',
      'PWETH',
      'ARBETH',
    ],
  } as Record<NetworkEnum, string[]>,
  infuraApiKey: 'da99ebc8c0964bb8bb757b6f8cc40f1f',
  exploraApis: {
    testnet: 'https://liquality.io/testnet/electrs',
    mainnet: 'https://api-mainnet-bitcoin-electrs.liquality.io',
  },
  batchEsploraApis: {
    testnet: 'https://liquality.io/electrs-testnet-batch',
    mainnet: 'https://api-mainnet-bitcoin-electrs-batch.liquality.io',
  },
  networks: ['mainnet', 'testnet'] as NetworkEnum[],
  chains: [
    ChainId.Bitcoin,
    ChainId.Ethereum,
    ChainId.Rootstock,
    ChainId.BinanceSmartChain,
    ChainId.Near,
    ChainId.Polygon,
    ChainId.Arbitrum,
  ] as ChainId[],
}
