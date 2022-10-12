import { setupWallet } from '@liquality/wallet-core'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useState } from 'react'
import {
  Clipboard,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { AppIcons, Fonts } from '../../../assets'
import { addressStateFamily, networkState, themeMode } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
import ReviewDrawer from '../../../components/review-drawer'
import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import {
  Text,
  Button,
  Box,
  palette,
  Card,
  faceliftPalette,
} from '../../../theme'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'
import { GRADIENT_BACKGROUND_HEIGHT } from '../../../utils'

const { CopyIcon, PurpleCopy, QRCode } = AppIcons
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
  const [statusMsg, setStatusMsg] = useState('')
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [showReviewDrawer, setShowReviewDrawer] = useState(false)

  const theme = useRecoilValue(themeMode)

  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const addressForAccount = useRecoilValue(
    addressStateFamily(nftItem.accountId),
  ) as string

  //Hardcoded my own metamask mumbai testnet for testing purposes
  const addressInput = useInputState('')

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

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
      setStatusMsg('Success! You sent the NFT')
    } catch (error) {
      setStatusMsg('Failed to send the NFT')
    }
  }

  const handleCopyAddressPress = async () => {
    if (addressForAccount) {
      Clipboard.setString(addressForAccount)
    }
    // setButtonPressed(true)
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

  console.log('REVIEW DRAWR?', showReviewDrawer)
  return (
    <Box flex={1} backgroundColor={backgroundColor}>
      {showReviewDrawer ? (
        <ReviewDrawer
          nftItem={nftItem}
          accountIdsToSendIn={accountIdsToSendIn}
        />
      ) : null}
      {isCameraVisible ? (
        <QrCodeScanner chain={'ethereum'} onClose={handleCameraModalClose} />
      ) : null}
      <Card
        variant={'headerCard'}
        height={GRADIENT_BACKGROUND_HEIGHT}
        paddingHorizontal="xl">
        <Box flex={0.4} justifyContent="center"></Box>
        <Box flex={1}>
          <Box alignItems="center" justifyContent="center">
            <Image
              style={styles.image}
              source={{
                uri: nftItem.image_original_url,
              }}
            />
            <Text variant={'sendNftCollectionNameHeader'}>
              {nftItem.collection.name}
            </Text>

            <Text variant={'sendNftNameHeader'}>
              {nftItem.name} #{nftItem.token_id}
            </Text>
          </Box>
        </Box>
      </Card>
      <Box padding={'xl'}>
        <Text variant={'miniNftHeader'}>SENT FROM</Text>
        <Box paddingTop={'m'} flexDirection={'row'}>
          <AssetIcon chain={'ethereum'} />
          <Text fontSize={16} style={styles.textRegular}>
            ETH
          </Text>
        </Box>
        <Box paddingBottom={'m'} flexDirection={'row'}>
          {/*   TODO: change to just use accountinfo  when assets are loading again, for now hardcoded*/}

          <Text fontSize={18} style={styles.textRegular}>
            {/*   TODO: change to just use addressForAccount  when assets are loading again, for now hardcoded*/}
            {shortenAddress(nftItem.accountId)}{' '}
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
            3.5 ETH Avail.
          </Text>
        </Box>
        <Box backgroundColor={'mediumWhite'} padding={'l'} paddingTop={'xl'}>
          <Text variant={'miniNftHeader'}>SEND TO</Text>
          <Box flexDirection={'row'}>
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Enter Address"
              style={styles.sendToInput}
              onChangeText={addressInput.onChangeText}
              value={addressInput.value}
              autoCorrect={false}
              returnKeyType="done"
            />
            <Pressable onPress={handleQRCodeBtnPress}>
              <QRCode />
            </Pressable>
          </Box>
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
          <Button
            type="primary"
            variant="l"
            label={'Review'}
            isBorderless={false}
            isActive={true}
            onPress={() => setShowReviewDrawer(true)}
          />
          <Button
            type="secondary"
            variant="l"
            /*           label={{ tx: 'receiveScreen.buyCrypto' }}*/
            label="Cancel"
            onPress={() => navigation.goBack()}
            isBorderless={false}
            isActive={true}
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
  tickerText: {
    fontSize: 16,
  },
  textMargin: {},
  textRegular: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25,
    letterSpacing: 0.5,

    color: faceliftPalette.darkGrey,
  },

  image: {
    width: 95,
    height: 95,
    marginBottom: 20,
  },
  btnBox: { alignItems: 'center' },
  sendToInput: {
    marginTop: 5,
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

  copyIcon: { color: 'purple' },
})

export default NftSendScreen
