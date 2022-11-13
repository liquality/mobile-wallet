import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import {
  Box,
  faceliftPalette,
  Text,
  ThemeType,
  showCopyToast,
  TouchableOpacity,
} from '../../../theme'
import { scale } from 'react-native-size-matters'
import { Alert, Linking, StyleSheet } from 'react-native'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import { AppIcons } from '../../../assets'
import { useTheme } from '@shopify/restyle'
import { labelTranslateFn } from '../../../utils'
import Clipboard from '@react-native-clipboard/clipboard'
import Share from 'react-native-share'
import I18n from 'i18n-js'
import { networkState, walletState } from '../../../atoms'
import { useRecoilValue } from 'recoil'
import { getNativeAsset } from '@liquality/wallet-core/dist/src/utils/asset'
import { getAddressExplorerLink } from '@liquality/wallet-core/dist/src/utils/asset'
import { getAsset } from '@liquality/cryptoassets'
const { CopyIcon, ShareIcon, GasIcon, ChevronRightIcon, TiltedArrow } = AppIcons

const RowComponent = ({
  title,
  subtitle,
  onPress,
}: {
  title: string
  subtitle?: number
  onPress: () => void
}) => {
  return (
    <Box
      borderTopWidth={1}
      borderTopColor={'whiteLightGrey'}
      borderBottomWidth={1}
      borderBottomColor={'whiteLightGrey'}
      height={scale(50)}
      justifyContent="center"
      marginTop={'xl'}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.rowCenter, styles.spaceBetween]}>
        <Box flexDirection={'row'} alignItems="center">
          <Text variant={'headerLink'}>{title}</Text>
          {subtitle ? (
            <Box
              width={1}
              marginHorizontal="l"
              height={scale(20)}
              backgroundColor="inactiveText"
            />
          ) : null}
          {subtitle ? <Text variant={'headerLink'}>{subtitle}</Text> : null}
        </Box>
        <ChevronRightIcon width={scale(15)} height={scale(15)} />
      </TouchableOpacity>
    </Box>
  )
}

type ScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'AccountDetailScreen'
>

const AccountDetailScreen: FC<ScreenProps> = ({ navigation, route }) => {
  const { assetData } = route.params
  const theme = useTheme<ThemeType>()
  const activeNetwork = useRecoilValue(networkState)
  const wallet = useRecoilValue(walletState)

  let nativeCode = ''
  let nativeName = ''
  if (assetData && assetData.code) {
    const asset = getNativeAsset(assetData?.code, activeNetwork)
    const nativeData = getAsset(activeNetwork, asset)
    nativeCode = nativeData.code
    nativeName = nativeData.name
  }

  const onCopyBtnPress = () => {
    if (assetData && assetData?.address) {
      showCopyToast('copyToast', labelTranslateFn('receiveScreen.copied')!)
      Clipboard.setString(assetData.address)
    } else {
      Alert.alert(labelTranslateFn('receiveScreen.addressEmpty')!)
    }
  }
  const onShareBtnPress = () => {
    if (assetData && assetData?.address) {
      Share.open({ message: assetData.address })
    } else {
      Alert.alert(labelTranslateFn('receiveScreen.addressEmpty')!)
    }
  }
  const onGasBtnPress = () => {
    navigation.navigate('ReceiveScreen', {
      assetData,
      screenTitle: I18n.t('assetScreen.receiveCode', { code: assetData?.name }),
    })
  }
  const onManageAssetRightIconPress = () => {
    if (nativeCode) {
      navigation.navigate('AssetManagementScreen', { code: nativeCode })
    } else {
      navigation.navigate('AssetManagementScreen', {})
    }
  }
  const onHideAccRightIconPress = () => {
    navigation.navigate('AccountManagementScreen', {})
  }

  const onShowOrExportPrivateKeyBtnPress = () => {
    if (assetData && assetData.address) {
      navigation.navigate('BackupWarningScreen', {
        isPrivateKey: true,
        walletId: wallet.activeWalletId,
        accountId: assetData.id,
        network: activeNetwork,
        chain: assetData.chain,
        shortenAddress: shortenAddress(assetData?.address),
        accountName: assetData.name,
      })
    }
  }

  const onExplorerLinkPress = () => {
    if (assetData && assetData.address) {
      const link = getAddressExplorerLink(
        assetData?.address,
        assetData?.code,
        activeNetwork,
      )
      Linking.openURL(link)
    } else {
      Alert.alert('link not found') // error handling work is pending
    }
  }

  return (
    <Box
      flex={1}
      paddingHorizontal="screenPadding"
      backgroundColor={'mainBackground'}>
      <Box
        height={scale(120)}
        marginTop={'xl'}
        justifyContent="flex-end"
        backgroundColor="greyBackground">
        <Box height={scale(90)}>
          <Box flexDirection={'row'}>
            <Box width={scale(4)} borderRadius={scale(5)} />
            <Text
              paddingHorizontal="xl"
              variant={'transLink'}
              tx="account"
              fontWeight={'400'}
              color={'black2'}
            />
          </Box>
          <Box flexDirection={'row'} height={scale(35)} marginTop="m">
            <Box
              width={scale(4)}
              borderRadius={scale(5)}
              height={scale(30)}
              style={{ backgroundColor: assetData?.color }}
              alignItems={'center'}
            />
            <Text
              paddingHorizontal="xl"
              variant={'warnText'}
              lineHeight={scale(35)}>
              {assetData?.name}
            </Text>
          </Box>
        </Box>
        <Box position={'absolute'} top={0} right={0} zIndex={0}>
          <Box justifyContent="center" alignItems={'flex-end'} zIndex={100}>
            <Box style={styles.topRightHalfCutArrow} />
          </Box>
        </Box>
      </Box>
      {assetData && assetData.address && (
        <Box
          flexDirection={'row'}
          marginTop="l"
          justifyContent={'space-between'}>
          <Box flexDirection={'row'}>
            <Text variant={'addressLabel'} color="darkGrey">
              {shortenAddress(assetData?.address)}
            </Text>
            <Box
              alignSelf={'flex-start'}
              width={1}
              marginLeft="m"
              height={scale(15)}
              backgroundColor="inactiveText"
            />
            <TouchableOpacity
              style={{ marginHorizontal: theme.spacing.l }}
              onPress={onCopyBtnPress}>
              <CopyIcon
                width={scale(15)}
                height={scale(15)}
                onPress={() => {}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShareBtnPress}>
              <ShareIcon />
            </TouchableOpacity>
          </Box>
          <TouchableOpacity onPress={onGasBtnPress} style={styles.rowCenter}>
            <GasIcon width={scale(20)} height={scale(20)} />
            <Text marginLeft={'s'} variant={'addressLabel'} tx="gas" />
          </TouchableOpacity>
        </Box>
      )}
      <RowComponent
        title={labelTranslateFn('manageAssets')!}
        onPress={onManageAssetRightIconPress}
      />
      <Text
        variant={'transLink'}
        fontWeight="500"
        marginTop={'xl'}
        tx="privateKey"
        color={'greyMeta'}
      />
      <Text
        variant={'listText'}
        fontWeight="400"
        lineHeight={scale(18)}
        color="black2"
        tx="cautionPrivateKey"
      />
      <TouchableOpacity
        onPress={onShowOrExportPrivateKeyBtnPress}
        style={styles.rowCenter}>
        <Text variant={'headerLink'} tx="exportPrivateKey" />
        <Box
          width={1}
          marginHorizontal="m"
          height={scale(15)}
          backgroundColor="inactiveText"
        />
        <Text variant={'headerLink'} tx="showPrivateKey" />
      </TouchableOpacity>
      <Text
        variant={'transLink'}
        fontWeight="500"
        marginTop={'xl'}
        tx="historyTransactions"
        color={'greyMeta'}
      />
      <Text
        variant={'listText'}
        fontWeight="400"
        lineHeight={scale(18)}
        color="black2"
        tx="seeAccountRelated"
      />
      {nativeName ? (
        <TouchableOpacity
          style={styles.rowCenter}
          onPress={onExplorerLinkPress}>
          <Text variant={'headerLink'} marginRight="m" paddingTop={'s'}>
            {I18n.t('goTo', { name: nativeName })}
          </Text>
          <TiltedArrow />
        </TouchableOpacity>
      ) : null}
      <RowComponent
        title={labelTranslateFn('hideAccount')!}
        onPress={onHideAccRightIconPress}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  topRightHalfCutArrow: {
    borderTopWidth: scale(40),
    borderTopColor: faceliftPalette.white,
    borderRightWidth: 0,
    borderBottomWidth: scale(40),
    borderBottomColor: faceliftPalette.greyBackground,
    borderLeftWidth: scale(40),
    borderLeftColor: faceliftPalette.greyBackground,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
})

export default AccountDetailScreen
