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
import { sendTransaction } from '../../store/store'
import { getNativeAssetCode } from '@liquality/cryptoassets'
import { BigNumber } from '@liquality/types'
import { FeeLabel } from '@liquality/wallet-core/dist/src/store/types'
const { OFF_SEND_TRANSACTION } = INJECTION_REQUESTS

type ApproveTransactionInjectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ApproveTransactionInjectionScreen'
>
const { DottedLine, ChevronDown } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const ApproveTransactionInjectionScreen = ({
  navigation,
  route,
}: ApproveTransactionInjectionScreenProps) => {
  const { activeWalletId } = wallet.state
  const activeNetwork = useRecoilValue(networkState)
  const { chainId, walletConnectData } = route.params

  const send = async () => {
    let asset = getNativeAssetCode(activeNetwork, 'polygon')

    //TODO: uniswap wants u to sign a transaction without a value
    //before you sign the actual swap transaction, how would I do that using wallet core
    //when sendTransaction() function expects a value param?
    //TODO IN THIS CASE MAKE VALUE BE 0

    const hash = await sendTransaction({
      asset,
      activeNetwork,
      to: walletConnectData.to,
      value: walletConnectData.value
        ? new BigNumber(parseInt(walletConnectData.value, 10))
        : new BigNumber(0),
      fee: walletConnectData.gas,
      feeLabel: FeeLabel.Average,
      memo: walletConnectData.data,
    })

    emitterController.emit(OFF_SEND_TRANSACTION, hash)
    navigation.navigate('OverviewScreen')
  }

  const reject = () => {}

  return (
    <Box
      flex={1}
      backgroundColor={'white'}
      padding={'xl'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Text style={styles.headerText}>Approve</Text>

      <Text style={styles.permissionText}>
        By granting permission to they can read your public account addresses.
        Make sure you trust this site.
      </Text>
      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={'Approve'}
          onPress={send}
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

export default ApproveTransactionInjectionScreen
