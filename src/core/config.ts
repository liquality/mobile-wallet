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

export const chainDefaultColors: Partial<Record<any, string>> = {
  bitcoin: '#EAB300',
  ethereum: '#4F67E4',
  rsk: '#3AB24D',
  bsc: '#F7CA4F',
  near: '#000000',
  polygon: '#8247E5',
  arbitrum: '#28A0EF',
}

export const customConfig = {
  defaultAssets: {
    mainnet: [
      'BTC',
      'ETH',
      'DAI',
      'RBTC',
      'SOV',
      // 'USDC',
      // 'USDT',
      // 'WBTC',
      // 'UNI',
      // 'BNB',
      // 'NEAR',
      // 'MATIC',
      // 'PWETH',
      // 'ARBETH',
    ],
    testnet: [
      'BTC',
      'ETH',
      'DAI',
      'RBTC',
      'SOV',
      // 'BNB',
      // 'NEAR',
      // 'MATIC',
      // 'PWETH',
    ],
  } as Record<any, string[]>,
  infuraApiKey: 'da99ebc8c0964bb8bb757b6f8cc40f1f',
  exploraApis: {
    testnet: 'https://liquality.io/testnet/electrs',
    mainnet: 'https://api-mainnet-bitcoin-electrs.liquality.io',
  },
  batchEsploraApis: {
    testnet: 'https://liquality.io/electrs-testnet-batch',
    mainnet: 'https://api-mainnet-bitcoin-electrs-batch.liquality.io',
  },
  chains: [
    'bitcoin',
    'ethereum',
    'rootstock',
    // ChainId.BinanceSmartChain,
    // ChainId.Near,
    // ChainId.Polygon,
    // ChainId.Arbitrum,
  ],
  testnetContractAddresses: {
    DAI: '0xad6d458402f60fd3bd25163575031acdce07538d',
    SOV: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
    PWETH: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    SUSHI: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  } as Record<string, string>,
  swapProviders: {
    testnet: {
      liquality: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: 'LIQUALITY',
        agent:
          process.env.VUE_APP_AGENT_TESTNET_URL ||
          'https://liquality.io/swap-testnet-dev/agent',
      },
      uniswapV2: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: 'UNISWAPV2',
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      thorchain: {
        name: 'Thorchain',
        icon: 'thorchain.svg',
        type: 'THORCHAIN',
        thornode: 'https://testnet.thornode.thorchain.info',
      },
      sovryn: {
        name: 'Sovyrn',
        icon: 'sovryn.svg',
        type: 'SOVRYN',
        // routerAddress: SovrynTestnetAddresses.swapNetwork,
        // routerAddressRBTC: SovrynTestnetAddresses.proxy3,
        rpcURL: 'https://public-node.testnet.rsk.co/',
      },
    },
    mainnet: {
      liquality: {
        name: 'Liquality',
        icon: 'liquality.svg',
        type: 'LIQUALITY',
        agent: 'https://liquality.io/swap-dev/agent',
      },
      liqualityBoost: {
        name: 'Liquality Boost',
        type: 'LIQUALITYBOOST',
        network: 'mainnet',
        icon: 'liqualityboost.svg',
        supportedBridgeAssets: ['MATIC'],
      },
      uniswapV2: {
        name: 'Uniswap V2',
        icon: 'uniswap.svg',
        type: 'UNISWAPV2',
        routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      },
      oneinchV3: {
        name: 'Oneinch V3',
        icon: 'oneinch.svg',
        type: 'ONEINCHV3',
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
        icon: 'sovryn.svg',
        type: 'FASTBTC',
        bridgeEndpoint: 'http://3.131.33.161:3000/',
      },
      sovryn: {
        name: 'Sovyrn',
        icon: 'sovryn.svg',
        type: 'SOVRYN',
        // routerAddress: SovrynMainnetAddresses.swapNetwork,
        // routerAddressRBTC: SovrynMainnetAddresses.proxy3,
        rpcURL: 'https://public-node.rsk.co/',
      },
    },
  },
}

class CustomConfig {
  private readonly _state: any

  constructor(infuraAPIKey: string, state: any) {
    this._state = state
  }

  public getDefaultEnabledAssets(network: any): string[] {
    return (
      this._state.activeWalletId &&
      this._state?.enabledAssets?.[network]?.[this._state.activeWalletId]
    )
  }

  public getDefaultEnabledChains(): any[] {
    return customConfig.chains
  }

  public getDefaultNetwork(): any {
    return this._state.activeNetwork
  }
}

export default CustomConfig
