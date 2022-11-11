import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, Modal, SafeAreaView, Pressable } from 'react-native'
import { ChainId, getChain } from '@liquality/cryptoassets'
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
import { labelTranslateFn } from '../utils'
import { useRecoilValue } from 'recoil'
import { networkState } from '../atoms'
import { AppIcons } from '../assets'
import { palette } from '../theme'
const { TimesIcon } = AppIcons

type QrCodeScannerPropsType = {
  onClose: (address: string) => void
  chain: ChainId
}

const QrCodeScanner: FC<QrCodeScannerPropsType> = (props) => {
  const [hasPermission, setHasPermission] = React.useState(false)
  const { onClose, chain } = props

  const [error, setError] = useState('')
  const activeNetwork = useRecoilValue(networkState)
  //TODO: Keep this here as we want to use this QR component instead, but there is a bug in the library
  /*   const [showInjectionFlow, setShowInjectionFlow] = useState(false)
  const [walletConnectPayload, setWalletConnectPayload] = useState({}) */

  const devices = useCameraDevices()
  const device = devices.back
  const onQRCodeDetected = useCallback(
    async (qrCode: Barcode) => {
      if (error) {
        setError('')
      }
      const address = qrCode.displayValue?.split(':')?.[1]
      if (address && getChain(activeNetwork, chain).isValidAddress(address)) {
        onClose(address)
      } else if (qrCode.displayValue?.startsWith('wc')) {
        //TODO: Keep this here as we want to use this QR component instead, but there is a bug in the library
        //new WalletConnectController(qrCode.displayValue)
        /*    await initWalletConnect(qrCode.displayValue, function (wcPayload) {
          console.log(wcPayload, 'wcPayload IN CALLBACKKK')
          setWalletConnectPayload({
            payload: wcPayload.payload,
            uri: qrCode.displayValue,
            connector: wcPayload.connector,
          })
          setError('Wallet connect connected')
          setShowInjectionFlow(true)
        }) */
        /*  navigation.navigate('InitInjectionScreen', {
          someVal: 'someval',
        }) */
      } else {
        setError(labelTranslateFn('invalidQRCode')!)
      }
    },
    [activeNetwork, chain, error, onClose],
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

  //TODO: Keep this here as we want to use this QR component instead, but there is a bug in the library
  /*   useEffect(() => {
    async function fetchData() {
      if (showInjectionFlow && Object.keys(walletConnectPayload).length !== 0) {
        console.log(walletConnectPayload, 'WC payload')
        await navigation.navigate('OverviewScreen', {
          walletConnectPayload,
        })
        onClose(walletConnectPayload.uri)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInjectionFlow, navigation, walletConnectPayload]) */

  return (
    <Modal style={styles.modalView}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.actionWrapper}>
          <Pressable onPress={handleCloseBtnPress}>
            <TimesIcon
              fill={palette.white}
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
            <Rect
              x="0"
              y="0"
              width="50"
              height="50"
              fill={palette.qrCodeColor}
            />
            <Rect
              x="0"
              y="210"
              width="50"
              height="49"
              fill={palette.qrCodeColor}
            />
            <Rect
              x="210"
              y="0"
              width="49"
              height="50"
              fill={palette.qrCodeColor}
            />
            <Rect
              x="210"
              y="210"
              width="49"
              height="49"
              fill={palette.qrCodeColor}
            />
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
    backgroundColor: palette.black2,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: palette.black2,
  },
  actionWrapper: {
    backgroundColor: palette.black2,
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
    borderColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 257,
    height: 257,
    borderColor: palette.qrCodeColor,
    marginTop: 1,
    marginLeft: 1,
    padding: 5,
  },
  error: {
    width: 260,
  },
})

export default QrCodeScanner
