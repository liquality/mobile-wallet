import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Image } from 'react-native'
import { useRecoilValue } from 'recoil'

import { emitterController } from '../../controllers/emitterController'
import { INJECTION_REQUESTS } from '../../controllers/constants'
import ButtonFooter from '../../components/button-footer'
import { Box, Button, faceliftPalette, Text } from '../../theme'
import { RootStackParamList } from '../../types'
import { networkState } from '../../atoms'
import { Fonts, AppIcons } from '../../assets'
const { ON_SESSION_REQUEST, OFF_SESSION_REQUEST } = INJECTION_REQUESTS

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>
const { DottedLine, ChevronDown } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const InitInjectionScreen = ({ navigation, route }: NftDetailScreenProps) => {
  const { activeWalletId } = wallet.state
  console.log(wallet.state, 'Wallet state')
  const activeNetwork = useRecoilValue(networkState)

  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    emitterController.on(ON_SESSION_REQUEST, ({ params }) => {
      const [data] = params
      setData(data)
      setIsOpen(true)
    })
  }, [])

  console.log(data, 'what is data?', data?.peerMeta.icons[0])
  const connect = () => {
    //TODO: make the wallet address come from getAddressByChainId(data.chainId) instead
    emitterController.emit(OFF_SESSION_REQUEST, [
      '0xD8CeBecb8a26864812E73A35B59f318890a76966',
    ])
    navigation.navigate('OverviewScreen')
  }

  const reject = () => {
    emitterController.emit(OFF_SESSION_REQUEST, null)
    navigation.navigate('OverviewScreen')
  }

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      padding={'xl'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Text style={styles.headerText}>Connect Request</Text>
      <Box>
        {data ? (
          <Image
            style={styles.imgLogo}
            source={{ uri: data.peerMeta.icons[0] }}
          />
        ) : null}
      </Box>
      <Text style={styles.permissionText}>
        By granting permission to {data?.peerMeta.name} they can read your
        public account addresses. Make sure you trust this site.
      </Text>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'Connect'}
          onPress={connect}
          isBorderless={true}
          appendChildren={false}></Button>
        <Button
          type="secondary"
          variant="l"
          label={'Deny'}
          onPress={reject}
          isBorderless={true}
          isActive={true}
        />
      </ButtonFooter>
    </Box>
  )
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.5,
    fontSize: 42,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
    color: faceliftPalette.darkGrey,
  },
  permissionText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.5,
    fontSize: 15,
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
    color: faceliftPalette.darkGrey,
  },
  imgLogo: { width: 65, height: 65 },
})

export default InitInjectionScreen
