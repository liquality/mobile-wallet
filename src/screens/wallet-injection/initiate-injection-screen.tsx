import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Dimensions, Image } from 'react-native'
import { useRecoilValue } from 'recoil'

import { emitterController } from '../../controllers/emitterController'
import { INJECTION_REQUESTS } from '../../controllers/constants'
import ButtonFooter from '../../components/button-footer'
import { Box, Button, faceliftPalette, Pressable, Text } from '../../theme'
import { RootStackParamList } from '../../types'
import { accountForAssetState, networkState } from '../../atoms'
import { Fonts, AppIcons } from '../../assets'
import {
  getAllEvmChains,
  getAsset,
  getChain,
  getNativeAssetCode,
} from '@liquality/cryptoassets'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import AssetIcon from '../../components/asset-icon'
import { scale } from 'react-native-size-matters'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
const { ON_SESSION_REQUEST, OFF_SESSION_REQUEST } = INJECTION_REQUESTS

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>
const { DottedArrow, ChevronDown, BlueLine } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const InitInjectionScreen = ({ navigation, route }: NftDetailScreenProps) => {
  const { activeWalletId } = wallet.state
  const activeNetwork = useRecoilValue(networkState)

  const [data, setData] = useState()
  const [connectedChain, setConnectedChain] = useState([])
  //TODO, if WalletConnect supports solana and not only EVM soon
  //we need to get the asset code from something like this: getNativeAssetCode(activeNetwork, chainConnected[0]) instead of 'ETH'
  const accountForConnectedChain = useRecoilValue(accountForAssetState('ETH'))
  console.log(accountForConnectedChain?.balance, 'acc?')
  useEffect(() => {
    emitterController.on(ON_SESSION_REQUEST, ({ params }) => {
      const [data] = params
      setData(data)
    })

    if (data) {
      let chainConnected = Object.entries(getAllEvmChains().mainnet).find(
        (chainName) => chainName[1].network.chainId === data.chainId,
      )
      setConnectedChain(chainConnected)
    }
  }, [activeNetwork, data])

  const connect = () => {
    emitterController.emit(OFF_SESSION_REQUEST, [
      accountForConnectedChain?.address,
    ])
    navigation.navigate('OverviewScreen')
  }

  const reject = () => {
    emitterController.emit(OFF_SESSION_REQUEST, null)
    navigation.navigate('OverviewScreen')
  }

  console.log(connectedChain[0], 'connected CHAIN?')
  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'screenPadding'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Text style={styles.headerText}>Connect Request</Text>
      <Box marginBottom={'l'}>
        {data ? (
          <Image
            style={styles.imgLogo}
            source={{ uri: data.peerMeta.icons[0] }}
          />
        ) : null}
      </Box>
      <Text style={styles.subheadingText}>{data?.peerMeta.name}</Text>

      <DottedArrow style={styles.dottedArrow} />
      <AssetIcon size={60} chain={'ethereum'} asset={'ETH'} />
      <BlueLine style={styles.dottedArrow} />
      {connectedChain[0] ? (
        <Text style={styles.subheadingText}>
          {getNativeAssetCode(activeNetwork, connectedChain[0])} Account
        </Text>
      ) : null}

      <Text style={styles.permissionText}>
        {shortenAddress(accountForConnectedChain.address)} | $
        {accountForConnectedChain?.balance}
      </Text>
      <Box marginTop={'xl'}>
        <Text style={styles.permissionText}>
          By granting permission to {data?.peerMeta.name} they can read your
          public account addresses. Make sure you trust this site.
        </Text>
      </Box>

      {/* <Box flex={0.5}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'walletConnect.connect' }}
            onPress={connect}
            variant="solid"
          />
        </Box>
        <Text
          onPress={reject}
          textAlign={'center'}
          variant="link"
          color={'black'}
          tx="termsScreen.cancel"
        />
      </Box> */}

      <ButtonFooter>
        <Button
          type="primary"
          variant="l"
          label={{
            tx: 'walletConnect.connect',
          }}
          onPress={connect}
          isBorderless={true}
          appendChildren={false}></Button>
        <Button
          type="secondary"
          variant="l"
          label={{ tx: 'common.cancel' }}
          onPress={navigation.goBack}
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
    color: faceliftPalette.darkGrey,
  },
  imgLogo: { width: 65, height: 65 },
  dottedArrow: { marginTop: scale(20), marginBottom: scale(20) },
  subheadingText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 17,

    color: faceliftPalette.greyBlack,
  },
})

export default InitInjectionScreen
