import * as React from 'react'
import { StyleSheet } from 'react-native'
import BitcoinChainIcon from '../assets/icons/crypto/bitcoin_chain.svg'
import EthereumChainIcon from '../assets/icons/crypto/ethereum_chain.svg'
import RootstockChainIcon from '../assets/icons/crypto/rsk_chain.svg'
import BinanceSmartChainIcon from '../assets/icons/crypto/bsc_chain.svg'
import NearChainIcon from '../assets/icons/crypto/near_chain.svg'
import PolygonChainIcon from '../assets/icons/crypto/polygon_chain.svg'
import ArbitrumChainIcon from '../assets/icons/crypto/arbitrum.svg'
import TerraChainIcon from '../assets/icons/crypto/terra_chain.svg'
import FuseChainIcon from '../assets/icons/crypto/fuse.svg'

import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/bitcoin_chain.svg'
import RBTCIcon from '../assets/icons/crypto/rbtc.svg'
import SovrynIcon from '../assets/icons/crypto/sov.svg'
import DAIIcon from '../assets/icons/crypto/dai.svg'
import LunaIcon from '../assets/icons/crypto/luna.svg'
import TerraIcon from '../assets/icons/crypto/terra.svg'
import BNBIcon from '../assets/icons/crypto/bnb.svg'
import Nearcon from '../assets/icons/crypto/near.svg'
import MaticIcon from '../assets/icons/crypto/matic.svg'
import PwethIcon from '../assets/icons/crypto/pweth.svg'
import ArbitrumIcon from '../assets/icons/crypto/arbeth.svg'
import BlankIcon from '../assets/icons/crypto/blank.svg'

import { ChainId } from '@liquality/cryptoassets/src/types'
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
