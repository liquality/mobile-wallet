export interface DefaultAssetsType {
  mainnet: Array<string>
  testnet: Array<string>
}

export enum NetworkEnum {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export type ChainColorType = {
  [name: string]: string
}

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

export const chainDefaultColors = {
  bitcoin: '#EAB300',
  ethereum: '#4F67E4',
  rsk: '#3AB24D',
  bsc: '#F7CA4F',
  near: '#000000',
  polygon: '#8247E5',
  arbitrum: '#28A0EF',
} as ChainColorType

export const SwapProviderType = {
  LIQUALITY: 'LIQUALITY',
  UNISWAPV2: 'UNISWAPV2',
  ONEINCHV3: 'ONEINCHV3',
  THORCHAIN: 'THORCHAIN',
  FASTBTC: 'FASTBTC',
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
  } as DefaultAssetsType,
  infuraApiKey: 'da99ebc8c0964bb8bb757b6f8cc40f1f',
  exploraApis: {
    testnet: 'https://liquality.io/testnet/electrs',
    mainnet: 'https://api-mainnet-bitcoin-electrs.liquality.io',
  },
  batchEsploraApis: {
    testnet: 'https://liquality.io/electrs-testnet-batch',
    mainnet: 'https://api-mainnet-bitcoin-electrs-batch.liquality.io',
  },
  swapProviders: {
    testnet: {
      liquality: {
        name: 'Liquality',
        type: SwapProviderType.LIQUALITY,
        agent:
          process.env.VUE_APP_AGENT_TESTNET_URL ||
          'https://liquality.io/swap-testnet/agent',
      },
      uniswapV2: {
        name: 'Uniswap V2',
        type: SwapProviderType.UNISWAPV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      thorchain: {
        name: 'Thorchain',
        type: SwapProviderType.THORCHAIN,
        thornode: 'https://testnet.thornode.thorchain.info',
      },
    },
    mainnet: {
      liquality: {
        name: 'Liquality',
        type: SwapProviderType.LIQUALITY,
        agent: 'https://liquality.io/swap/agent',
      },
      uniswapV2: {
        name: 'Uniswap V2',
        type: SwapProviderType.UNISWAPV2,
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      oneinchV3: {
        name: 'Oneinch V3',
        type: SwapProviderType.ONEINCHV3,
        agent: 'https://api.1inch.exchange/v3.0',
        routerAddress: '0x11111112542d85b3ef69ae05771c2dccff4faa26',
        referrerAddress: {
          ethereum: '0xaf2C465dC79DeDf7305CDe782439171D147Abac7',
          polygon: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
          bsc: '0x3a712CC47aeb0F20A7C9dE157c05d74B11F172f5',
        },
        referrerFee: 0.3,
      },
      fastBTC: {
        name: 'FastBTC',
        type: SwapProviderType.FASTBTC,
        bridgeEndpoint: 'http://3.131.33.161:3000/',
      },
    },
  },
  discordUrl: 'https://discord.gg/Xsqw7PW8wk',
  networks: ['mainnet', 'testnet'] as Array<NetworkEnum>,
  chains: ['bitcoin', 'ethereum', 'rsk', 'bsc', 'near', 'polygon', 'arbitrum'],
}
