import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'
import { scale } from 'react-native-size-matters'
import { useRecoilValue } from 'recoil'
import { AppIcons, Fonts, Images } from '../../../assets'
import { networkState, themeMode } from '../../../atoms'
import AssetIcon from '../../../components/asset-icon'
import QrCodeScanner from '../../../components/qr-code-scanner'
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

const { CopyIcon, PurpleCopy, QRCode, NftCard, SeeAllNftsIcon } = AppIcons
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

type NftOverviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftOverviewScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})

const NftOverviewScreen = ({ route }: NftOverviewScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [statusMsg, setStatusMsg] = useState('')
  const theme = useRecoilValue(themeMode)

  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const lowerBgImg =
    currentTheme === 'light' ? Images.nftCardDark : Images.nftCardWhite

  const uppperBgImg =
    currentTheme === 'dark' ? Images.nftCardDark : Images.nftCardWhite

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const addressInput = useInputState('')

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
  console.log(nftItem.token_id, 'TOKEN ID')
  return (
    <Box flex={1} paddingHorizontal={'xl'} backgroundColor={'white'}>
      <Box flexDirection={'row'} alignItems="center" justifyContent={'center'}>
        <Pressable style={styles.pressable}>
          <NftCard width={355} height={154} />
          <Text style={styles.collectionName}>{nftItem.collection.name}</Text>
          <Text style={styles.nftName}>
            {nftItem.name} {'\n'} #{nftItem.token_id}
          </Text>

          <Image
            style={styles.nftImage}
            source={{
              uri: nftItem.image_original_url,
            }}
          />
          {/* <SeeAllNftsIcon width={105} height={105} />
          <Text style={styles.seeAllText}>See {'\n'}All</Text> */}
        </Pressable>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  collectionName: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 15,
    color: faceliftPalette.mediumGrey,
    position: 'absolute',
    left: '35.19%',
    top: '19.19%',
    bottom: '15.24%',
  },

  nftName: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 21,
    lineHeight: 27,

    color: faceliftPalette.mediumGrey,
    position: 'absolute',
    left: '35.19%',
    top: '45.19%',
    bottom: '15.24%',
  },

  nftImage: {
    position: 'absolute',
    left: '5.14%',
    right: '5.19%',
    top: '19.19%',
    bottom: '15.24%',
    width: 95,
    height: 95,
  },

  pressable: { position: 'relative' },
})

export default NftOverviewScreen
