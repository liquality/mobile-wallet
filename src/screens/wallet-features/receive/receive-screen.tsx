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
import { useRecoilValue } from 'recoil'
import i18n from 'i18n-js'
import { addressStateFamily, networkState } from '../../../atoms'
import { labelTranslateFn } from '../../../utils'

type ReceiveScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ReceiveScreen'
>

const ReceiveScreen = ({ navigation, route }: ReceiveScreenProps) => {
  const [buttonPressed, setButtonPressed] = useState<boolean>(false)
  const { name, chain, code, id }: AccountType = route.params.assetData!
  const address = useRecoilValue(addressStateFamily(id))
  const activeNetwork = useRecoilValue(networkState)

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
  }

  return (
    <View style={styles.container}>
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
        {!!address && <QRCode value={address} size={200} />}
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
    flex: 0.5,
    justifyContent: 'center',
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
    marginBottom: 30,
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
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: (Dimensions.get('window').width - 315) / 2,
    paddingBottom: 20,
  },
  icon: {
    marginRight: 5,
  },
})

export default ReceiveScreen
