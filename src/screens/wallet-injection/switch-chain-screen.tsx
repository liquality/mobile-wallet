import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'
import { emitterController } from '../../controllers/emitterController'
import { INJECTION_REQUESTS } from '../../controllers/constants'
import ButtonFooter from '../../components/button-footer'
import { Box, Button, faceliftPalette, Text } from '../../theme'
import { RootStackParamList } from '../../types'
import { accountForAssetState } from '../../atoms'
import { Fonts } from '../../assets'

const { OFF_SWITCH_CHAIN } = INJECTION_REQUESTS

type SwitchChainScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwitchChainScreen'
>

const SwitchChainScreen = ({ navigation, route }: SwitchChainScreenProps) => {
  const accountForConnectedChain = useRecoilValue(accountForAssetState('ETH'))

  const switchChain = () => {
    emitterController.emit(OFF_SWITCH_CHAIN, {
      address: [accountForConnectedChain?.address],
      chainId: parseInt(route.params.walletConnectData.chainId),
    })
    navigation.navigate('OverviewScreen')
  }

  const reject = () => {
    navigation.navigate('OverviewScreen')
  }

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
})

export default SwitchChainScreen
