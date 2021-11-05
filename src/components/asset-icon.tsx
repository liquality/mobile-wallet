import ETHIcon from '../assets/icons/crypto/eth.svg'
import BTCIcon from '../assets/icons/crypto/btc.svg'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

const AssetIcon = ({ asset, size }: { asset?: string; size?: number }) => {
  if (!asset) {
    return <View>Icon not available</View>
  }
  if (asset.toLowerCase() === 'eth' || asset.toLowerCase() === 'ethereum') {
    return (
      <ETHIcon width={size || 28} height={size || 28} style={styles.icon} />
    )
  } else {
    return <BTCIcon width={size || 28} height={28} style={styles.icon} />
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
})
export default AssetIcon
