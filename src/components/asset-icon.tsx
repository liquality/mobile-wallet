import * as React from 'react'
import { AppIcons } from '../assets'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { FC } from 'react'
import { ICON_SIZE } from '../utils'
import { StyleProp, ViewStyle } from 'react-native'

const {
  BitcoinChainIcon,
  BitcoinChainIcon: BTCIcon,
  EthereumChainIcon,
  RootstockChainIcon,
  BinanceSmartChainIcon,
  NearChainIcon,
  PolygonChainIcon,
  ArbitrumChainIcon,
  TerraChainIcon,
  FuseChainIcon,
  AvalancheChainIcon,
  AvalancheChainIcon: AvalancheIcon,
  SolanaChainIcon,
  ETHIcon,
  RBTCIcon,
  SovrynIcon,
  DAIIcon,
  LunaIcon,
  TerraIcon,
  BNBIcon,
  Nearcon,
  MaticIcon,
  PwethIcon,
  ArbitrumIcon,
  SolanaIcon,
  BlankIcon,
  AllChainIndicator,
  // swapProvider
  HopProviderIcon,
  OneInch,
  Sovryn,
  Thorchain,
  Uniswap,
} = AppIcons

type AssetIconType = {
  chain?: ChainId
  asset?: string
  size?: number
  styles?: StyleProp<ViewStyle>
}

const extractSpecificIcon = {
  [`${ChainId.Bitcoin}`]: {
    assetName: BitcoinChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Ethereum}`]: {
    assetName: EthereumChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Rootstock}`]: {
    assetName: RootstockChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.BinanceSmartChain}`]: {
    assetName: BinanceSmartChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Near}`]: {
    assetName: NearChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Polygon}`]: {
    assetName: PolygonChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Arbitrum}`]: {
    assetName: ArbitrumChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Terra}`]: {
    assetName: TerraChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Fuse}`]: {
    assetName: FuseChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Avalanche}`]: {
    assetName: AvalancheChainIcon,
    viewBoxValue: '',
  },
  [`${ChainId.Solana}`]: {
    assetName: SolanaChainIcon,
    viewBoxValue: '',
  },
  eth: {
    assetName: ETHIcon,
    viewBoxValue: '',
  },
  rbtc: {
    assetName: RBTCIcon,
    viewBoxValue: '',
  },
  dai: {
    assetName: DAIIcon,
    viewBoxValue: '',
  },
  sov: {
    assetName: SovrynIcon,
    viewBoxValue: '',
  },
  btc: {
    assetName: BTCIcon,
    viewBoxValue: '',
  },
  luna: {
    assetName: LunaIcon,
    viewBoxValue: '',
  },
  ust: {
    assetName: TerraIcon,
    viewBoxValue: '',
  },
  bnb: {
    assetName: BNBIcon,
    viewBoxValue: '0 0 32 32',
  },
  near: {
    assetName: Nearcon,
    viewBoxValue: '',
  },
  matic: {
    assetName: MaticIcon,
    viewBoxValue: '',
  },
  pweth: {
    assetName: PwethIcon,
    viewBoxValue: '0 0 32 32',
  },
  arbeth: {
    assetName: ArbitrumIcon,
    viewBoxValue: '0 0 32 32',
  },
  avax: {
    assetName: AvalancheIcon,
    viewBoxValue: '0 0 32 32',
  },
  sol: {
    assetName: SolanaIcon,
    viewBoxValue: '0 0 32 32',
  },
  all: {
    assetName: AllChainIndicator,
    viewBoxValue: '',
  },
  hop: {
    assetName: HopProviderIcon,
    viewBoxValue: '',
  },
  ['1inch']: {
    assetName: OneInch,
    viewBoxValue: '',
  },
  sovryn: {
    assetName: Sovryn,
    viewBoxValue: '',
  },
  thorchain: {
    assetName: Thorchain,
    viewBoxValue: '',
  },
  uniswap: {
    assetName: Uniswap,
    viewBoxValue: '',
  },
}

const AssetIcon: FC<AssetIconType> = (props) => {
  const { chain, asset, size = ICON_SIZE, styles } = props
  const extractedIcon = chain
    ? extractSpecificIcon[chain.toLowerCase()]
    : asset
    ? extractSpecificIcon[asset.toLowerCase()]
    : null
  if (extractedIcon) {
    const AssetName = extractedIcon.assetName
    const viewBoxValue = extractedIcon.viewBoxValue
    if (viewBoxValue) {
      return (
        <AssetName
          viewBox={viewBoxValue}
          width={size}
          height={size}
          style={styles}
        />
      )
    } else {
      return <AssetName width={size} height={size} style={styles} />
    }
  } else {
    return <BlankIcon width={size} height={size} style={styles} />
  }
}

export default AssetIcon
