import * as React from 'react'
import { FC } from 'react'
import { AppIcons } from '../assets'
import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { ICON_SIZE } from '../utils'
import { StyleProp, ViewStyle } from 'react-native'

const {
  BitcoinChainIcon,
  EthereumChainIcon,
  RootstockChainIcon,
  BinanceSmartChainIcon,
  NearChainIcon,
  PolygonChainIcon,
  ArbitrumChainIcon,
  TerraChainIcon,
  FuseChainIcon,
  AvalancheChainIcon,
  AvalancheIcon,
  SolanaChainIcon,
  OptimismChainIcon,
  BTCIcon,
  ETHIcon,
  RBTCIcon,
  SovrynIcon,
  DAIIcon,
  LunaIcon,
  TerraIcon,
  BNBIcon,
  NearIcon,
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
  OptimismIcon,
  EthereumAccountIcon,
  PolygonAccountIcon,
  ArbitrumAccountIcon,
  BitcoinAccountIcon,
  BSCAccountIcon,
  RootstockAccountIcon,
  AvalancheAccountIcon,
  NearAccountIcon,
  SolanaAccountIcon,
} = AppIcons

type AssetIconType = {
  chain?: ChainId
  account?: string
  asset?: string
  size?: number
  styles?: StyleProp<ViewStyle>
}

const extractSpecificIconForChain = {
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
  [`${ChainId.Optimism}`]: {
    assetName: OptimismChainIcon,
    viewBoxValue: '',
  },
}
const extractSpecificIconForAsset = {
  ETH: {
    assetName: ETHIcon,
    viewBoxValue: '',
  },
  OPTETH: {
    assetName: OptimismIcon,
    viewBoxValue: '',
  },
  OPTUSC: {
    assetName: OptimismIcon,
    viewBoxValue: '',
  },
  RBTC: {
    assetName: RBTCIcon,
    viewBoxValue: '',
  },
  DAI: {
    assetName: DAIIcon,
    viewBoxValue: '',
  },
  SOV: {
    assetName: SovrynIcon,
    viewBoxValue: '',
  },
  BTC: {
    assetName: BTCIcon,
    viewBoxValue: '',
  },
  LUNA: {
    assetName: LunaIcon,
    viewBoxValue: '',
  },
  UST: {
    assetName: TerraIcon,
    viewBoxValue: '',
  },
  BNB: {
    assetName: BNBIcon,
    viewBoxValue: '0 0 32 32',
  },
  NEAR: {
    assetName: NearIcon,
    viewBoxValue: '',
  },
  MATIC: {
    assetName: MaticIcon,
    viewBoxValue: '',
  },
  PWETH: {
    assetName: PwethIcon,
    viewBoxValue: '0 0 32 32',
  },
  ARBETH: {
    assetName: ArbitrumIcon,
    viewBoxValue: '0 0 32 32',
  },
  AVAX: {
    assetName: AvalancheIcon,
    viewBoxValue: '0 0 32 32',
  },
  SOL: {
    assetName: SolanaIcon,
    viewBoxValue: '0 0 32 32',
  },
  all: {
    assetName: AllChainIndicator,
    viewBoxValue: '',
  },
  HOP: {
    assetName: HopProviderIcon,
    viewBoxValue: '',
  },
  ['oneinchV4']: {
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

const extractSpecificIconForAccount = {
  Arbitrum: {
    assetName: ArbitrumAccountIcon,
    viewBoxValue: '',
  },
  Avalanche: {
    assetName: AvalancheAccountIcon,
    viewBoxValue: '',
  },
  Bitcoin: {
    assetName: BitcoinAccountIcon,
    viewBoxValue: '',
  },
  BNBSmartChain: {
    assetName: BSCAccountIcon,
    viewBoxValue: '',
  },
  Ethereum: {
    assetName: EthereumAccountIcon,
    viewBoxValue: '',
  },
  LegacyRootstock: {
    assetName: RootstockAccountIcon,
    viewBoxValue: '',
  },
  Near: {
    assetName: NearAccountIcon,
    viewBoxValue: '',
  },
  Polygon: {
    assetName: PolygonAccountIcon,
    viewBoxValue: '',
  },
  Rootstock: {
    assetName: RootstockAccountIcon,
    viewBoxValue: '',
  },
  Solana: {
    assetName: SolanaAccountIcon,
    viewBoxValue: '',
  },
  Terra: {
    assetName: TerraIcon,
    viewBoxValue: '',
  },
}

const AssetIcon: FC<AssetIconType> = (props) => {
  const { chain, asset, account, size = ICON_SIZE, styles } = props
  const canonicalAccountName = account?.replace(/ /g, '').slice(0, -1)

  const extractedIcon = chain
    ? extractSpecificIconForChain[chain]
    : asset
    ? extractSpecificIconForAsset[asset]
    : canonicalAccountName
    ? extractSpecificIconForAccount[canonicalAccountName]
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
