import React, { FC, useCallback, useState } from 'react'
import { View, StyleSheet, Modal, SafeAreaView, Pressable } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { ChainId, chains } from '@liquality/cryptoassets'
import Svg, { Rect } from 'react-native-svg'
import Error from '../components/ui/error'

type QrCodeScannerPropsType = {
  onClose: (address: string) => void
  chain: ChainId
}

const QrCodeScanner: FC<QrCodeScannerPropsType> = (props) => {
  const { onClose, chain } = props
  const [error, setError] = useState('')

  const handleQrCodeDetected = useCallback(
    (event: BarCodeReadEvent) => {
      if (error) {
        setError('')
      }
      const address = event.data.split(':')?.[1]
      if (address && chains[chain].isValidAddress(address)) {
        onClose(event.data)
      } else {
        setError('Invalid QR Code')
      }
    },
    [chain, error, onClose],
  )

  const handleCloseBtnPress = () => {
    onClose('')
  }

  return (
    <Modal style={styles.modalView}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.actionWrapper}>
          <Pressable onPress={handleCloseBtnPress}>
            <FontAwesomeIcon
              style={styles.icon}
              icon={faTimes}
              color={'#FFF'}
              size={30}
            />
          </Pressable>
        </View>
        <View style={styles.container}>
          <Svg
            viewBox={'0 0 260 260'}
            x={0}
            y={0}
            height="260"
            width="260"
            style={styles.svg}>
            <Rect x="0" y="0" width="50" height="50" fill="#fefefe" />
            <Rect x="0" y="210" width="50" height="49" fill="#fefefe" />
            <Rect x="210" y="0" width="49" height="50" fill="#fefefe" />
            <Rect x="210" y="210" width="49" height="49" fill="#fefefe" />
            <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              captureAudio={false}
              onBarCodeRead={handleQrCodeDetected}
            />
          </Svg>
          {!!error && <Error message={error} style={styles.error} />}
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#000',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#000',
  },
  actionWrapper: {
    backgroundColor: '#000',
    alignItems: 'flex-end',
  },
  icon: {
    marginRight: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 257,
    height: 257,
    borderColor: '#fefefe',
    marginTop: 1,
    marginLeft: 1,
  },
  error: {
    width: 260,
  },
})

export default QrCodeScanner
