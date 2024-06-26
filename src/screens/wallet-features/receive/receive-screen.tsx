import React, { useEffect } from 'react'
import { Alert, Linking, StyleSheet } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, MainStackParamList } from '../../../types'
import {
  Text,
  palette,
  Box,
  Card,
  Pressable,
  showCopyToast,
} from '../../../theme'
import { useRecoilValue } from 'recoil'
import i18n from 'i18n-js'
import {
  addressStateFamily,
  networkState,
  optInAnalyticsState,
  walletState,
} from '../../../atoms'
import { labelTranslateFn, RECEIVE_HEADER_HEIGHT } from '../../../utils'
import { AppIcons, Fonts } from '../../../assets'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { moderateScale, scale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native-gesture-handler'
import analytics from '@react-native-firebase/analytics'
import DeviceInfo from 'react-native-device-info'
import CombinedChainAssetIcons from '../../../components/ui/CombinedChainAssetIcons'

const { CopyIcon } = AppIcons

type ReceiveScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'ReceiveScreen'
>

const ReceiveScreen = ({ navigation, route }: ReceiveScreenProps) => {
  const { chain, code, id }: AccountType = route.params.assetData!
  const address = useRecoilValue(addressStateFamily(id))
  const activeNetwork = useRecoilValue(networkState)
  const optinAnalytics = useRecoilValue(optInAnalyticsState)
  const wallet = useRecoilValue(walletState)
  const walletVersion = DeviceInfo.getVersion()

  const QRCodeSize = moderateScale(100, 0.1)

  //TODO Read this from a config file
  const getFaucetUrl = (asset: string): { name: string; url: string } => {
    return (
      {
        BTC: {
          name: 'Bitcoin',
          url: 'https://testnet-faucet.mempool.co/',
        },
        ETH: {
          name: 'Ethererum Ropsten',
          url: 'https://faucet.dimensions.network/',
        },
        RBTC: {
          name: 'RBTC/RSK',
          url: 'https://faucet.rsk.co/',
        },
        BNB: {
          name: 'BNB',
          url: 'https://testnet.binance.org/faucet-smart/',
        },
        NEAR: {
          name: 'NEAR',
          url: '',
        },
        SOL: {
          name: 'SOLANA',
          url: 'https://solfaucet.com/',
        },
        MATIC: {
          name: 'MATIC',
          url: 'https://faucet.matic.network/',
        },
        ARBETH: {
          name: 'ARBETH',
          url: 'https://faucet.rinkeby.io/',
        },
      }[asset] || { name: '', url: '' }
    )
  }

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url)
      }
    })
  }

  const onBuyCryptoPress = React.useCallback(() => {
    navigation.navigate('BuyCryptoDrawer', {
      isScrolledUp: false,
      token: code,
      showIntro: false,
      screenTitle: labelTranslateFn('buyCrypto')!,
    })
  }, [code, navigation])

  const handleCopyAddressPress = async () => {
    if (!address) {
      Alert.alert(labelTranslateFn('receiveScreen.addressEmpty')!)
    } else {
      if (optinAnalytics?.acceptedDate) {
        const { activeWalletId, version } = wallet
        analytics().logEvent('ReceiveCopyAddress', {
          category: 'Send/Receive',
          action: 'User copied address',
          label: `${code} (${chain}) address ${address}`,
          network: activeNetwork,
          walletId: activeWalletId,
          migrationVersion: version,
          walletVersion,
        })
      }
      showCopyToast('copyToast', labelTranslateFn('receiveScreen.copied')!)
      Clipboard.setString(address)
    }
  }

  useEffect(() => {
    if (optinAnalytics?.acceptedDate) {
      const { activeWalletId, version } = wallet
      analytics().logEvent('ReceiveScreen', {
        category: 'Receive screen',
        action: 'User on Receive screen',
        label: `${code}`,
        network: activeNetwork,
        walletId: activeWalletId,
        migrationVersion: version,
        walletVersion,
      })
    }
  }, [activeNetwork, code, optinAnalytics?.acceptedDate, wallet, walletVersion])

  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <Card
        variant={'headerCard'}
        height={RECEIVE_HEADER_HEIGHT}
        paddingHorizontal="screenPadding"
        justifyContent={'center'}
        alignItems="center">
        <CombinedChainAssetIcons
          chain={chain}
          code={code}
          scaleMultiplier={2}
        />
        <Text
          variant={'addressLabel'}
          color="greyMeta"
          marginTop={'xl'}
          textTransform={'uppercase'}>
          {i18n.t('receiveScreen.yourCurrent', { code, chain })}
        </Text>
        <Box
          flexDirection={'row'}
          justifyContent="center"
          alignItems={'center'}>
          <Text color={'textColor'} variant={'h4'} paddingRight={'m'}>
            {shortenAddress(address)}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCopyAddressPress}>
            <CopyIcon width={20} stroke={palette.blueVioletPrimary} />
          </TouchableOpacity>
        </Box>
      </Card>
      <Box flex={1} paddingHorizontal="screenPadding">
        <Box flex={0.7} alignItems="center">
          <Text
            textAlign={'center'}
            paddingTop={'mxxl'}
            paddingBottom={'l'}
            paddingHorizontal={'lxxl'}
            tx="receiveScreen.scanORcode"
            color={'textColor'}
            variant="h7"
          />
          {!!address && <QRCode value={address} size={QRCodeSize} />}
          {activeNetwork === 'testnet' && (
            <>
              <Text variant={'subListText'} color="textColor" paddingTop={'xl'}>
                {getFaucetUrl(code).name} Testnet faucet
              </Text>
              <Text
                variant={'subListText'}
                color={'link'}
                onPress={() => handleLinkPress(getFaucetUrl(code).url)}>
                {getFaucetUrl(code).url}
              </Text>
            </>
          )}
          <Box marginVertical={'xl'} alignItems="center">
            <Pressable
              label={{ tx: 'receiveScreen.buyCrypto' }}
              onPress={onBuyCryptoPress}
              variant="defaultOutline"
              style={styles.buyCryptoBtnStyle}
              textStyle={styles.buyCryptoTxtStyle}
            />
          </Box>
        </Box>
        <Box flex={0.3}>
          <Box marginVertical={'xl'}>
            <Pressable
              onPress={handleCopyAddressPress}
              variant="solid"
              customView={
                <Box
                  flexDirection={'row'}
                  alignItems="center"
                  justifyContent={'center'}>
                  <Text
                    variant={'h6'}
                    color="white"
                    tx="receiveScreen.copyAdd"
                  />
                  <CopyIcon
                    width={scale(1.3 * 15)}
                    height={scale(1.3 * 15)}
                    stroke={palette.white}
                    strokeWidth={1}
                    style={styles.icon}
                  />
                </Box>
              }
            />
          </Box>
          <Text
            onPress={navigation.goBack}
            textAlign={'center'}
            variant="link"
            tx="termsScreen.cancel"
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  buyCryptoBtnStyle: {
    height: scale(36),
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyCryptoTxtStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: scale(13),
  },
  icon: {
    marginLeft: 5,
  },
})

export default ReceiveScreen
