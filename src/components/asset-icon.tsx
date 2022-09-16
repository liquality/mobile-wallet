import * as React from 'react'
import { StyleSheet } from 'react-native'
import { AppIcons } from '../assets'
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
} = AppIcons

import { ChainId } from '@liquality/cryptoassets/dist/src/types'
import { FC } from 'react'

type AssetIconType = {
  chain?: ChainId
  asset?: string
  size?: number
}

//TODO this approach does not scale, refactor to a better one
//TODO Match the name of the icon to the name of the asset and load icons dynamically
const AssetIcon: FC<AssetIconType> = (props) => {
  const SIZE = 25
  const { chain, asset, size = SIZE } = props
  if (chain) {
    if (chain?.toLowerCase() === ChainId.Bitcoin) {
      return <BitcoinChainIcon width={size} height={size} style={styles.icon} />
    } else if (chain?.toLowerCase() === ChainId.Ethereum) {
      return (
        <EthereumChainIcon width={size} height={size} style={styles.icon} />
      )
    } else if (chain?.toLowerCase() === ChainId.Rootstock) {
      return (
        <RootstockChainIcon width={size} height={size} style={styles.icon} />
      )
    } else if (chain?.toLowerCase() === ChainId.BinanceSmartChain) {
      return (
        <BinanceSmartChainIcon width={size} height={size} style={styles.icon} />
      )
    } else if (chain?.toLowerCase() === ChainId.Near) {
      return <NearChainIcon width={size} height={size} style={styles.icon} />
    } else if (chain?.toLowerCase() === ChainId.Polygon) {
      return <PolygonChainIcon width={size} height={size} style={styles.icon} />
    } else if (chain?.toLowerCase() === ChainId.Arbitrum) {
      return (
        <ArbitrumChainIcon width={size} height={size} style={styles.icon} />
      )
    } else if (chain?.toLowerCase() === ChainId.Terra) {
      return <TerraChainIcon width={size} height={size} style={styles.icon} />
    } else if (chain?.toLowerCase() === ChainId.Fuse) {
      return <FuseChainIcon width={size} height={size} style={styles.icon} />
    } else if (chain?.toLowerCase() === ChainId.Avalanche) {
      return (
        <AvalancheChainIcon width={size} height={size} style={styles.icon} />
      )
    } else if (chain?.toLowerCase() === ChainId.Solana) {
      return <SolanaChainIcon width={size} height={size} style={styles.icon} />
    }
  } else {
    if (asset?.toLowerCase() === 'eth') {
      return <ETHIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'rbtc') {
      return <RBTCIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'dai') {
      return <DAIIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'sov') {
      return <SovrynIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'btc') {
      return <BTCIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'luna') {
      return <LunaIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'ust') {
      return <TerraIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'bnb') {
      return (
        <BNBIcon
          viewBox="0 0 32 32"
          width={25}
          height={25}
          style={styles.icon}
        />
      )
    } else if (asset?.toLowerCase() === 'near') {
      return <Nearcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'matic') {
      return <MaticIcon width={size} height={size} style={styles.icon} />
    } else if (asset?.toLowerCase() === 'pweth') {
      return (
        <PwethIcon
          viewBox="0 0 32 32"
          width={size}
          height={size}
          style={styles.icon}
        />
      )
    } else if (asset?.toLowerCase() === 'arbeth') {
      return (
        <ArbitrumIcon
          viewBox="0 0 32 32"
          width={size}
          height={size}
          style={styles.icon}
        />
      )
    } else if (asset?.toLowerCase() === 'avax') {
      return (
        <AvalancheIcon
          viewBox="0 0 32 32"
          width={size}
          height={size}
          style={styles.icon}
        />
      )
    } else if (asset?.toLowerCase() === 'sol') {
      return (
        <SolanaIcon
          viewBox="0 0 32 32"
          width={size}
          height={size}
          style={styles.icon}
        />
      )
    }
  }

  return <BlankIcon width={size} height={size} style={styles.icon} />
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 5,
  },
})

export default AssetIcon
