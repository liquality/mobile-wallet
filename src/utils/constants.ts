import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'
import { SvgProps } from 'react-native-svg'
import { AppIcons } from '../assets'
import { SortFunctionKeyType } from '../custom-hooks/use-filtered-history'
import { TxKeyPath } from '../i18n'
import { ActionEnum, ActivityStatusEnum } from '../types'

export const COPY_BUTTON_TIMEOUT = 2000
export const FADE_IN_OUT_DURATION = 400
export const GRADIENT_BACKGROUND_HEIGHT = scale(200)
export const LARGE_TITLE_HEADER_HEIGHT = scale(81)
export const RECEIVE_HEADER_HEIGHT = scale(160)
export const ICON_SIZE = scale(23)
export const ONBOARDING_PADDING = 36
export const DRAWER_PADDING = 32
export const SCREEN_PADDING = 20
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height
export const INPUT_OPACITY_INACTIVE = 0.6
export const CONGRATULATIONS_MESSAGE_MARGIN_TOP = 300
export const INPUT_OPACITY_ACTIVE = 1
export const HORIZONTAL_CONTENT_HEIGHT = scale(65)

export const KEYS = {
  ACTIVE_NETWORK_KEY: 'activeNetworkKey',
  ACTIVE_THEME: 'activeTheme',
  ACTIVE_LANG: 'activeLang',
  ACCOUNTS_IDS_FOR_TESTNET: 'accountsIdsForTestnet',
  ACCOUNTS_IDS_FOR_MAINNET: 'accountsIdsForMainnet',
}

const {
  SendFilterIcon,
  SwapFilterIcon,
  NftFilterIcon,
  NftFilterInactiveIcon,
  PendingFilterIcon,
  CancelledFilterIcon,
  CompletedFilterIcon,
  ReceiveIcon,
  RefundedFilterIcon,
  NeedsAttentionFilterIcon,
  FailedFilterIcon,
  Uniswap,
  OneInch,
  FastBTC,
  Sovryn,
  Thorchain,
  Astroport,
  Jupiter,
  HopProviderIcon,
  LiFiProviderIcon,
  DebridgeProviderIcon,
} = AppIcons

type IconType = React.FC<
  SvgProps & {
    fillSecondary?: string | undefined
  }
>

export type ButtonProps = {
  key: ActivityStatusEnum | ActionEnum
  value: TxKeyPath
  status: boolean
  icon: IconType
  inactiveIcon: IconType
}

export const transFilterBtns: Array<ButtonProps> = [
  {
    key: ActionEnum.SEND,
    value: 'assetScreen.send',
    status: false,
    icon: SendFilterIcon,
    inactiveIcon: SendFilterIcon,
  },
  {
    key: ActionEnum.SWAP,
    value: 'assetScreen.swap',
    status: false,
    icon: SwapFilterIcon,
    inactiveIcon: SwapFilterIcon,
  },
  // advanced attributes
  {
    key: ActionEnum.NFT,
    value: 'nfts',
    status: false,
    icon: NftFilterIcon,
    inactiveIcon: NftFilterInactiveIcon,
  },
  {
    key: ActionEnum.RECEIVE,
    value: 'assetScreen.receive',
    status: false,
    icon: ReceiveIcon,
    inactiveIcon: ReceiveIcon,
  },
]

export const statusFilterBtn: Array<ButtonProps> = [
  {
    key: ActivityStatusEnum.PENDING,
    value: 'sortPicker.pending',
    status: false,
    icon: PendingFilterIcon,
    inactiveIcon: PendingFilterIcon,
  },
  {
    key: ActivityStatusEnum.COMPLETED,
    value: 'sortPicker.completed',
    status: false,
    icon: CompletedFilterIcon,
    inactiveIcon: CompletedFilterIcon,
  },
  {
    key: ActivityStatusEnum.CANCELLED,
    value: 'sortPicker.canceled',
    status: false,
    icon: CancelledFilterIcon,
    inactiveIcon: CancelledFilterIcon,
  },
  {
    key: ActivityStatusEnum.REFUNDED,
    value: 'sortPicker.refunded',
    status: false,
    icon: RefundedFilterIcon,
    inactiveIcon: RefundedFilterIcon,
  },
  {
    key: ActivityStatusEnum.NEEDS_ATTENTION,
    value: 'needsAttention',
    status: false,
    icon: NeedsAttentionFilterIcon,
    inactiveIcon: NeedsAttentionFilterIcon,
  },
  {
    key: ActivityStatusEnum.FAILED,
    value: 'failed',
    status: false,
    icon: FailedFilterIcon,
    inactiveIcon: FailedFilterIcon,
  },
]

export type SortRadioButtonProp = {
  key: SortFunctionKeyType
  value: TxKeyPath
}

export const sortRadioButtons: Array<SortRadioButtonProp> = [
  {
    key: 'by_date',
    value: 'sortPicker.by_date',
  },
  {
    key: 'needs_attention',
    value: 'sortPicker.needs_attention',
  },
  {
    key: 'pending',
    value: 'sortPicker.pending',
  },
  {
    key: 'canceled',
    value: 'sortPicker.canceled',
  },
  {
    key: 'refunded',
    value: 'sortPicker.refunded',
  },
  {
    key: 'failed',
    value: 'sortPicker.failed',
  },
  {
    key: 'completed',
    value: 'sortPicker.completed',
  },
]

export type SwapProviderRowProp = {
  icon: IconType
  name: string
  heading: string
  description: string
  pros: Array<string>
  cons: Array<string>
  feeStructure: Array<string>
}

export const swapProviderTiles: Array<SwapProviderRowProp> = [
  {
    icon: Uniswap,
    name: 'Uniswap V2',
    heading: 'Uniswap AMM Swaps',
    description: 'Popular DEX for Ethereum tokens only.',
    pros: ['High liquidity', 'Many pairs', 'Fast'],
    cons: ['Slippage', 'Ethereum tokens only', 'Few pairs'],
    feeStructure: [
      '0.3% liquidity provider fee',
      'Slippage (up to 0.5% in Liquality)',
    ],
  },
  {
    icon: OneInch,
    name: '1 inch v4',
    heading: '1Inch DEX Aggregator Swaps',
    description: 'Aggregate of popular DEXes',
    pros: [
      'Ethereum, Polygon, Binance, Smart Chain, Avalanche',
      'Best exchange rates',
      'High liquidity',
      'Many pairs',
      'Fast',
    ],
    cons: ['Slippage'],
    feeStructure: ['Additional aggregator fees', 'Slippage (up to 0.5%)'],
  },
  {
    icon: FastBTC,
    name: 'Fast BTC',
    heading: 'Sovryn FastBTC Relay',
    description: 'BTC to RBTC swaps up to 1 BTC',
    pros: ['Convenient for BTC --> RBTC'],
    cons: ['Custodial when depositing into RBTC'],
    feeStructure: [
      'To RBTC: 5000 sats + 0.2% per transaction',
      'MIN Transaction: 0.0005 BTC',
      'MAX Transaction: 1.00 BTC',
    ],
  },
  {
    icon: Sovryn,
    name: 'Sovryn',
    heading: 'Sovryn AMM Swaps',
    description:
      'Non-custodial and permissionless smart contract based system for Bitcoin lending, borrowing and margin trading',
    pros: ['Low liquidity provider fee', 'Margin Trading'],
    cons: ['Slippage'],
    feeStructure: [
      '0.15% liquidity provider fee',
      'Slippage (up to 0.5% in Liquality)',
    ],
  },
  {
    icon: Thorchain,
    name: 'Thorchain',
    heading: 'Thorchain AMM Swaps',
    description: 'Swap tokens across blockchains through liquidity pools.',
    pros: [
      'Cross-chain',
      'High liquidity',
      'Native assets',
      'Fee on destination chain not required',
    ],
    cons: [
      'Beta Software (chaosnet)',
      'Swaps executed on intermediary',
      'Few pairs',
    ],
    feeStructure: ['Outbound Fee', 'Slippage'],
  },
  {
    icon: Astroport,
    name: 'Astroport',
    heading: 'Astroport AMM Swaps',
    description:
      "Decentralized, permissionless and open-source, Astroport's marketplace is a public good governed by its community of token holders",
    pros: ['Low liquidity', 'Margin Trading'],
    cons: ['Slippage'],
    feeStructure: [
      '0.15% liquidity provider fee',
      'Slippage (up to 0.5% in Liquality)',
    ],
  },
  {
    icon: Jupiter,
    name: 'Jupiter',
    heading: 'Jupiter AMM Swaps',
    description:
      "Decentralized, permissionless and open-source, Jupiter's marketplace is a public good governed by its community of token holders",
    pros: ['Low liquidity', 'Margin Trading'],
    cons: ['Slippage'],
    feeStructure: [
      '0.15% liquidity provider fee',
      'Slippage (up to 0.5% in Liquality)',
    ],
  },
]

export const bridgesTile: Array<SwapProviderRowProp> = [
  {
    icon: LiFiProviderIcon,
    name: 'Li.Fi',
    heading: 'Li.Fi',
    description: 'Advanced Bridge & DEX Aggregation Protocol',
    pros: ['Cross-chain bridging'],
    cons: ['Slippage'],
    feeStructure: ['0.003% fee', 'Slippage (up to 0.5%)'],
  },
  {
    icon: DebridgeProviderIcon,
    name: 'DeBridge',
    heading: 'DeBridge Cross-Chain Swaps',
    description: 'deSwap — cross-chain swaps between any assets',
    pros: [
      'Ethereum, Polygon, Binance, Smart Chain, Avalanche',
      'Best exchange rates',
      'High liquidity',
      'Many pairs',
      'Fast',
    ],
    cons: ['Slippage'],
    feeStructure: ['Additional aggregator fees', 'Slippage (up to 3%)'],
  },
  {
    icon: HopProviderIcon,
    name: 'Hop',
    heading: 'Hop Exchange Cross-chain Swaps',
    description: 'Hop Exchange Cross-chain Swaps',
    pros: [
      'Ethereum, Polygon, Binance Smart Chain, Arbitrum, Optimism',
      'Best exchange rates',
      'High liquidity',
      'Fast',
    ],
    cons: ['Slippage'],
    feeStructure: ['Additional aggregator fees', 'Slippage (up to 3%)'],
  },
]
