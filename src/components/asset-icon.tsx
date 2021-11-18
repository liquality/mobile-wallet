import * as React from 'react'
import { StyleSheet } from 'react-native'
import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/btc.svg'
import RBTCIcon from '../assets/icons/crypto/rbtc.svg'
import SovrynIcon from '../assets/icons/crypto/sov.svg'
import DAIIcon from '../assets/icons/crypto/dai.svg'
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
  const SIZE = 32
  const { chain, asset, size = SIZE } = props

  if (!asset && !chain) {
    return <BlankIcon width={size} height={size} style={styles.icon} />
  }

  if (
    asset?.toLowerCase() === 'eth' &&
    chain?.toLowerCase() === ChainId.Ethereum
  ) {
    return <ETHIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'rbtc' &&
    chain?.toLowerCase() === ChainId.Rootstock
  ) {
    return <RBTCIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'dai' &&
    chain?.toLowerCase() === ChainId.Ethereum
  ) {
    return <DAIIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'sov' &&
    chain?.toLowerCase() === ChainId.Rootstock
  ) {
    return <SovrynIcon width={size} height={size} style={styles.icon} />
  } else if (
    asset?.toLowerCase() === 'btc' ||
    chain?.toLowerCase() === ChainId.Bitcoin
  ) {
    return <BTCIcon width={size} height={SIZE} style={styles.icon} />
  } else if (chain?.toLowerCase() === 'ethereum') {
    return <ETHIcon width={size} height={size} style={styles.icon} />
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
