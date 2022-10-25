import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { useRecoilValue } from 'recoil'

import { emitterController } from '../../controllers/emitterController'
import { INJECTION_REQUESTS } from '../../controllers/constants'
import ButtonFooter from '../../components/button-footer'
import { Box, Button } from '../../theme'
import { RootStackParamList } from '../../types'
import { networkState } from '../../atoms'
import { Fonts } from '../../assets'
const { ON_SESSION_REQUEST, OFF_SESSION_REQUEST } = INJECTION_REQUESTS

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const InitInjectionScreen = ({ route }: NftDetailScreenProps) => {
  const { activeWalletId } = wallet.state
  const activeNetwork = useRecoilValue(networkState)

  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    emitterController.on(ON_SESSION_REQUEST, ({ params }) => {
      const [data] = params
      console.log('INSIDE THE EMITTER CONTROLLER, DATA:', data)
      setData(data)
      setIsOpen(true)
    })
  }, [])

  const connect = () => {
    //const wallet = walletController.getWallet(data.chainId)

    emitterController.emit(OFF_SESSION_REQUEST, [wallet.address])
    setIsOpen(false)
  }

  const reject = () => {
    emitterController.emit(OFF_SESSION_REQUEST, null)
    setIsOpen(false)
  }

  return (
    <Box flex={1} backgroundColor={'white'}>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'Approve/Connect'}
          onPress={connect}
          isBorderless={true}
          appendChildren={false}></Button>
        <Button
          type="secondary"
          variant="l"
          label={{ tx: 'common.cancel' }}
          onPress={reject}
          isBorderless={true}
          isActive={true}
        />
      </ButtonFooter>
    </Box>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
})

export default InitInjectionScreen
