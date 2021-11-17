import * as React from 'react'
import { StyleSheet } from 'react-native'
import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/btc.svg'
import RootstockIcon from '../assets/icons/crypto/btc.svg'
import BinanceIcon from '../assets/icons/crypto/bnb.svg'
import NearIcon from '../assets/icons/crypto/near.svg'
import PolygonIcon from '../assets/icons/crypto/polygon.svg'
import ArbitrumIcon from '../assets/icons/crypto/arbeth.svg'
import TerraIcon from '../assets/icons/crypto/terra.svg'
import BlankIcon from '../assets/icons/crypto/blank.svg'
import { ChainId } from '@liquality/cryptoassets/src/types'
import { FC } from 'react'

type AssetIconType = {
  chain?: ChainId
  asset?: string
  size?: number
}

const AssetIcon: FC<AssetIconType> = (props) => {
  const SIZE = 32
  const { chain, asset, size = SIZE } = props

  if (!asset && !chain) {
    return <BlankIcon width={size} height={size} style={styles.icon} />
  }

  if (asset?.toLowerCase() === 'eth' || chain?.toLowerCase() === 'ethereum') {
    return <ETHIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'rsk' ||
    chain?.toLowerCase() === ChainId.Rootstock
  ) {
    return <RootstockIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'bsc' ||
    chain?.toLowerCase() === ChainId.BinanceSmartChain
  ) {
    return <BinanceIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'near' ||
    chain?.toLowerCase() === ChainId.Near
  ) {
    return <NearIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'polygon' ||
    chain?.toLowerCase() === ChainId.Polygon
  ) {
    return <PolygonIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'arbitrum' ||
    asset?.toLowerCase() === ChainId.Arbitrum
  ) {
    return <ArbitrumIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'ust' ||
    chain?.toLowerCase() === 'terra'
  ) {
    return <TerraIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'btc' ||
    chain?.toLowerCase() === ChainId.Bitcoin
  ) {
    return <BTCIcon width={size} height={SIZE} style={styles.icon} />
  } else {
    return <BlankIcon width={size} height={size} style={styles.icon} />
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default AssetIcon
