import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/btc.svg'
import * as React from 'react'
import { View } from 'react-native'

const AssetIcon = ({ asset }: { asset?: string }) => {
  if (!asset) {
    return <View>Icon not available</View>
  }
  if (asset.toLowerCase() === 'eth' || asset.toLowerCase() === 'ethereum') {
    return <ETHIcon width={28} height={28} />
  } else {
    return <BTCIcon width={28} height={28} />
  }
}

export default AssetIcon
