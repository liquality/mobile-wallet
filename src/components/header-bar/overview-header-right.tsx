import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { AppIcons } from '../../assets'
import QrCodeScanner from '../qr-code-scanner'
import { Text } from '../text/text'

const { Bars } = AppIcons

const OverviewHeaderRight = ({
  onPress,
}: {
  onPress: () => void
}): React.ReactElement => {
  const [showQRScanner, setShowQRScanner] = useState(false)

  return showQRScanner ? (
    <QrCodeScanner
      onClose={() => setShowQRScanner(false)}
      chain={'ethereum'}></QrCodeScanner>
  ) : (
    <View style={styles.container}>
      <Pressable onPress={() => setShowQRScanner(true)}>
        <Text>QR SCANNER</Text>
      </Pressable>

      <Pressable onPress={onPress}>
        <Bars width={25} height={25} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default OverviewHeaderRight
