import { setupWallet } from '@liquality/wallet-core'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState } from 'react'
import {
  Alert,
  Clipboard,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { useRecoilValue } from 'recoil'
import { AppIcons, Fonts } from '../../../assets'
import {
  accountInfoStateFamily,
  addressStateFamily,
  networkState,
  themeMode,
} from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import ButtonFooter from '../../../components/button-footer'
import QrCodeScanner from '../../../components/qr-code-scanner'
import ReviewDrawer from '../../../components/review-drawer'
import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import { Text, Button, Box, Card, faceliftPalette } from '../../../theme'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'
import {
  checkIfCollectionNameExists,
  GRADIENT_BACKGROUND_HEIGHT,
} from '../../../utils'

const { PurpleCopy, QRCode } = AppIcons
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type NftSendScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftSendScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})

const NftSendScreen = ({ navigation, route }: NftSendScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [errorMsg, setErrorMsg] = useState('')
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [showReviewDrawer, setShowReviewDrawer] = useState(false)
  const addressInput = useInputState('')
  const addressForAccount = useRecoilValue(
    addressStateFamily(nftItem.accountId),
  ) as string
  const accountInfo = useRecoilValue(accountInfoStateFamily(nftItem.accountId))
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'white'

  const handleCopyAddressPress = async () => {
    if (addressForAccount) {
      Clipboard.setString(addressForAccount)
    }
  }

  const handleQRCodeBtnPress = () => {
    setIsCameraVisible(!isCameraVisible)
  }

  const handleCameraModalClose = useCallback(
    (addressFromQrCode: string) => {
      setIsCameraVisible(!isCameraVisible)
      if (addressFromQrCode) {
        addressInput.onChangeText(addressFromQrCode.replace('ethereum:', ''))
      }
    },
    [addressInput, isCameraVisible],
  )

  const sendNft = async () => {
    try {
      /* 
      TODO add NFT fees, currently the fees sent in in extension 
      has wrong calculation (diff fees for NFTs and tokens and 
      a problem with NFT providers not giving fee estimations)
       const fee = this.feesAvailable
        ? this.assetFees[this.selectedFee].fee
        : undefined */
      const data = {
        network: activeNetwork,
        accountId: nftItem?.accountId,
        walletId: activeWalletId,
        receiver: addressInput.value,
        contract: nftItem?.asset_contract.address,
        tokenIDs: [nftItem?.token_id],
        values: [1],
        fee: undefined,
        feeLabel: 'average',
        nft: nftItem,
      }

      await sendNFTTransaction(data)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      //Success! You sent the NFT
      navigation.navigate('NftOverviewScreen', {
        nftItem,
        accountIdsToSendIn,
        addressInput: addressInput.value,
      })
    } catch (error) {
      Alert.alert('Failed to send the NFT')
    }
  }

  const handleOpenDrawer = () => {
    if (!addressInput.value) {
      setErrorMsg('Please enter a valid address.')
    } else {
      setShowReviewDrawer(true)
    }
  }

  return (
    <Box flex={1} backgroundColor={backgroundColor}>
      {showReviewDrawer ? (
        <ReviewDrawer
          addressInput={addressInput.value}
          handlePressSend={sendNft}
          title={'Review Send NFT'}
          height={481}
          nftItem={nftItem}
        />
      ) : null}
      {isCameraVisible ? (
        <QrCodeScanner chain={'ethereum'} onClose={handleCameraModalClose} />
      ) : null}
      <Card
        variant={'headerCard'}
        height={GRADIENT_BACKGROUND_HEIGHT}
        paddingHorizontal="xl">
        <Box flex={0.4} justifyContent="center" />
        <Box flex={1}>
          <Box alignItems="center" justifyContent="center">
            <Image
              style={styles.image}
              source={{
                uri: nftItem.image_original_url,
              }}
            />
            <Text variant={'sendNftCollectionNameHeader'}>
              {checkIfCollectionNameExists(nftItem.collection.name)}
            </Text>

            <Text variant={'sendNftNameHeader'}>
              {checkIfCollectionNameExists(nftItem.name)}
            </Text>
          </Box>
        </Box>
      </Card>
      <Box padding={'xl'}>
        <Text variant={'miniNftHeader'}>SENT FROM</Text>
        <Box paddingTop={'m'} flexDirection={'row'}>
          <AssetIcon chain={accountInfo.chain} />
          <Text fontSize={16} style={styles.textRegular}>
            {accountInfo.code}
          </Text>
        </Box>
        <Box paddingBottom={'m'} flexDirection={'row'}>
          <Text fontSize={18} style={styles.textRegular}>
            {/*   TODO: change to just use addressForAccount  when assets are loading again, for now hardcoded*/}
            {shortenAddress(addressForAccount)}{' '}
          </Text>
          <Pressable onPress={handleCopyAddressPress}>
            <PurpleCopy />
          </Pressable>
          <Text
            marginLeft={'m'}
            fontSize={18}
            color={'mediumGrey'}
            style={styles.textRegular}>
            {' '}
            |
          </Text>
          <Text
            marginLeft={'m'}
            fontSize={18}
            color={'mediumGrey'}
            style={styles.textRegular}>
            {accountInfo.balance} {accountInfo.code} Avail.
          </Text>
        </Box>
        <Box backgroundColor={'mediumWhite'} padding={'l'} paddingTop={'xl'}>
          <Text variant={'miniNftHeader'}>SEND TO</Text>
          <Box flexDirection={'row'}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}>
              <KeyboardAvoidingView>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="Enter Address"
                  style={styles.sendToInput}
                  onChangeText={addressInput.onChangeText}
                  value={addressInput.value}
                />
              </KeyboardAvoidingView>
            </ScrollView>
            <Pressable onPress={handleQRCodeBtnPress}>
              <QRCode />
            </Pressable>
          </Box>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </Box>
        <Box flexDirection={'row'} paddingVertical="l">
          <Text fontSize={16} style={(styles.textRegular, styles.purpleLink)}>
            Transfer Within Accounts
          </Text>
          <Text fontSize={16} style={styles.textRegular}>
            {' '}
            |{' '}
          </Text>
          <Text
            color={'buttonFontSecondary'}
            fontSize={16}
            style={(styles.textRegular, styles.purpleLink)}>
            Network Speed
          </Text>
        </Box>
        <Box style={styles.btnBox}>
          <ButtonFooter>
            <Button
              type="primary"
              variant="l"
              label={{
                tx: errorMsg ? 'sendScreen.insufficientFund' : 'common.review',
              }}
              onPress={() => handleOpenDrawer()}
              isBorderless={true}
              isActive={!errorMsg}
            />
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
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  textRegular: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25,
    letterSpacing: 0.5,

    color: faceliftPalette.darkGrey,
  },
  errorText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25,
    letterSpacing: 0.5,
    color: faceliftPalette.error,
  },

  image: {
    width: 95,
    height: 95,
    marginBottom: 20,
  },
  btnBox: { alignItems: 'center', marginTop: scale(150) },
  sendToInput: {
    marginTop: scale(5),
    fontSize: 19,

    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.5,
    color: faceliftPalette.greyMeta,
    width: '90%',
    marginRight: 10,
  },
  purpleLink: { color: faceliftPalette.buttonDefault },
})

export default NftSendScreen
