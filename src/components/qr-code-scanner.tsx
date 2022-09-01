import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Modal, SafeAreaView, Pressable } from 'react-native'
import { ChainId, chains } from '@liquality/cryptoassets'
import Svg, { Rect } from 'react-native-svg'
import Error from '../components/ui/error'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera'
import {
  Barcode,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner'
import { runOnJS } from 'react-native-reanimated'
import TimesIcon from '../assets/icons/times.svg'
import { labelTranslateFn } from '../utils'

type QrCodeScannerPropsType = {
  onClose: (address: string) => void
  chain: ChainId
}

const QrCodeScanner: FC<QrCodeScannerPropsType> = (props) => {
  const [hasPermission, setHasPermission] = React.useState(false)
  const { onClose, chain } = props
  const [error, setError] = useState('')
  const devices = useCameraDevices()
  const device = devices.back

  const onQRCodeDetected = useCallback(
    (qrCode: Barcode) => {
      if (error) {
        setError('')
      }
      const address = qrCode.displayValue?.split(':')?.[1]
      console.log(chain, 'wats chaain')
      if (address && chains[chain].isValidAddress(address)) {
        onClose(address)
      } else {
        setError(labelTranslateFn('invalidQRCode')!)
      }
    },
    [chain, error, onClose],
  )

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet'
      const qrCodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE])
      if (qrCodes.length > 0) {
        runOnJS(onQRCodeDetected)(qrCodes[0])
      }
    },
    [onQRCodeDetected],
  )

  const handleCloseBtnPress = () => {
    onClose('')
  }

  useEffect(() => {
    ;(async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'authorized')
    })()
  }, [])

  return (
    <Modal style={styles.modalView}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.actionWrapper}>
          <Pressable onPress={handleCloseBtnPress}>
            <TimesIcon
              fill={'#FFF'}
              style={styles.icon}
              width={30}
              height={30}
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
            {device && hasPermission && (
              <Camera
                style={styles.preview}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
              />
            )}
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
    padding: 5,
  },
  error: {
    width: 260,
  },
})

export default QrCodeScanner
