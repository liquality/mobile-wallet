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
import { accountForAssetState, networkState } from '../../atoms'
import { Fonts, AppIcons } from '../../assets'

const { OFF_SWITCH_CHAIN } = INJECTION_REQUESTS

type SwitchChainScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ApproveTransactionInjectionScreen'
>
const { DottedLine, ChevronDown } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const SwitchChainScreen = ({
  navigation,
  route,
  walletConnectData,
}: SwitchChainScreenProps) => {
  const { activeWalletId } = wallet.state
  const activeNetwork = useRecoilValue(networkState)
  const accountForConnectedChain = useRecoilValue(accountForAssetState('ETH'))

  console.log(
    route.params,
    'SWITCH CHAIN PARAMOOS',
    route.params.walletConnectData.chainId,
  )

  //TODO: move this into SwitchChainScreen
  const switchChain = () => {
    //const wallet = walletController.getWallet(data.chainId)

    emitterController.emit(OFF_SWITCH_CHAIN, {
      address: [accountForConnectedChain?.address],
      chainId: parseInt(route.params.walletConnectData.chainId),
    })
    navigation.navigate('OverviewScreen')
  }

  const reject = () => {}

  console.log(route.params, 'ROUTE PARAMS SHOULD BE WC DATA')
  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      padding={'xl'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Text style={styles.headerText}>SWITCH CHAIN</Text>

      <Text style={styles.permissionText}>
        By granting permission to they can read your public account addresses.
        Make sure you trust this site.
      </Text>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'Approve'}
          onPress={switchChain}
          isBorderless={true}
          appendChildren={false}
        />
        <Button
          type="secondary"
          variant="l"
          label={'Deny'}
          onPress={() => navigation.goBack()}
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

export default SwitchChainScreen
