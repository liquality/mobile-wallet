import React, { Fragment, useState } from 'react'
import {
  Alert,
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import QRCode from 'react-native-qrcode-svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AccountType, RootStackParamList } from '../../../types'
import AssetIcon from '../../../components/asset-icon'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import CheckIcon from '../../../assets/icons/swap-check.svg'
import CopyIcon from '../../../assets/icons/copy.svg'
import TransakIcon from '../../../assets/icons/transak.svg'
import { useRecoilValue } from 'recoil'
import i18n from 'i18n-js'
import { addressStateFamily, networkState } from '../../../atoms'
import { labelTranslateFn, COPY_BUTTON_TIMEOUT } from '../../../utils'
import BuyCryptoModal from './buyCryptoModal'

const PowerByTransak = () => (
  <View style={styles.poweredTransakIconView}>
    <Text style={styles.poweredBuyTextStyle} tx="receiveScreen.poweredBy" />
    <TransakIcon
      width={85}
      height={24}
      stroke={'#FFFFFF'}
      style={styles.icon}
    />
  </View>
)

type ReceiveScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ReceiveScreen'
>

const ReceiveScreen = ({ navigation, route }: ReceiveScreenProps) => {
  const [buttonPressed, setButtonPressed] = useState<boolean>(false)
  const { name, chain, code, id }: AccountType = route.params.assetData!
  const address = useRecoilValue(addressStateFamily(id))
  const activeNetwork = useRecoilValue(networkState)
  const { width } = Dimensions.get('screen')
  const [cryptoModalVisible, setCryptoModalVisible] = useState(false)

  const isPoweredByTransak = true

  const onCloseButtonPress = () => {
    setCryptoModalVisible(false)
  }

  const QRCodeSize = width < 390 ? width / 2.4 : width / 2

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

  const handleCopyAddressPress = async () => {
    if (!address) Alert.alert(labelTranslateFn('receiveScreen.addressEmpty')!)
    Clipboard.setString(address)
    setButtonPressed(true)
    setTimeout(() => {
      Clipboard.setString('')
      setButtonPressed(false)
    }, COPY_BUTTON_TIMEOUT)
  }

  return (
    <View style={styles.container}>
      <BuyCryptoModal
        visible={cryptoModalVisible}
        onPress={onCloseButtonPress}
        isPoweredByTransak={isPoweredByTransak}
        poweredTransakComp={<PowerByTransak />}
        handleLinkPress={handleLinkPress}
      />
      <View style={styles.headerBlock}>
        <AssetIcon asset={code} chain={chain} />
        <Text style={styles.addressLabel}>
          {i18n.t('receiveScreen.yourCurrent', { code, activeNetwork })}
        </Text>
        <View style={styles.addressWrapper}>
          <Text style={styles.address}>{address}</Text>
          <Pressable onPress={handleCopyAddressPress}>
            <CopyIcon width={10} stroke={'#9D4DFA'} />
          </Pressable>
        </View>
      </View>
      <View style={styles.ContentBlock}>
        <Text style={styles.scanPrompt} tx="receiveScreen.scanORcode" />
        {!!address && <QRCode value={address} size={QRCodeSize} />}
        {activeNetwork === 'testnet' && (
          <Fragment>
            <Text style={styles.linkLabel}>
              {getFaucetUrl(name).name} Testnet faucet
            </Text>
            <Text
              style={styles.link}
              onPress={() => handleLinkPress(getFaucetUrl(name).url)}>
              {getFaucetUrl(name).url}
            </Text>
          </Fragment>
        )}
        <View style={styles.buyCryptoBtnView}>
          <Button
            type="secondary"
            variant="m"
            label={{ tx: 'receiveScreen.buyCrypto' }}
            onPress={() => setCryptoModalVisible(true)}
            isBorderless={false}
            isActive={true}
          />
          {isPoweredByTransak && <PowerByTransak />}
        </View>
      </View>
      <View style={styles.actionBlock}>
        <Button
          type="secondary"
          variant="m"
          label={{ tx: 'receiveScreen.done' }}
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label={
            buttonPressed
              ? { tx: 'receiveScreen.copied' }
              : { tx: 'receiveScreen.copyAdd' }
          }
          onPress={handleCopyAddressPress}
          isBorderless={false}
          isActive={true}>
          {buttonPressed ? (
            <CheckIcon
              width={15}
              height={15}
              stroke={'#FFFFFF'}
              style={styles.icon}
            />
          ) : (
            <CopyIcon
              width={15}
              height={15}
              stroke={'#FFFFFF'}
              style={styles.icon}
            />
          )}
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBlock: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#3D4767',
    marginVertical: 5,
  },
  addressWrapper: {
    flexDirection: 'row',
  },
  address: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    color: '#1D1E21',
    marginRight: 5,
  },
  ContentBlock: {
    flex: 0.6,
    alignItems: 'center',
  },
  scanPrompt: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    color: '#000D35',
    width: '70%',
    marginBottom: 20,
  },
  linkLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 20,
    lineHeight: 18,
  },
  link: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#9D4DFA',
  },
  actionBlock: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: (Dimensions.get('window').width - 315) / 2,
    paddingBottom: 20,
  },
  icon: {
    marginRight: 5,
  },
  buyCryptoBtnView: {
    alignItems: 'center',
  },
  poweredTransakIconView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  poweredBuyTextStyle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#646F85',
  },
})

export default ReceiveScreen
