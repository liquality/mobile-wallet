import React, { FC, useCallback } from 'react'
import { View, StyleSheet, Modal, SafeAreaView, Pressable } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { ChainId, chains } from '@liquality/cryptoassets'

type QrCodeScannerPropsType = {
  onClose: (address: string) => void
}

const QrCodeScanner: FC<QrCodeScannerPropsType> = (props) => {
  const { onClose } = props

  const handleQrCodeDetected = useCallback(
    (event: BarCodeReadEvent) => {
      if (event.data && chains[ChainId.Ethereum].isValidAddress(event.data)) {
        onClose(event.data)
      }
    },
    [onClose],
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
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            onBarCodeRead={handleQrCodeDetected}
          />
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
  preview: {
    width: 250,
    height: 250,
    borderColor: '#fefefe',
    borderWidth: 2,
  },
})

export default QrCodeScanner
