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

  //Hardcoded my own metamask mumbai testnet for testing purposes
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

  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor={backgroundColor}
      paddingHorizontal="onboardingPadding">
      <Box width="100%" height={scale(400)}>
        <Box position={'absolute'} top={10} zIndex={100}>
          <ImageBackground
            style={styles.upperBgImg}
            resizeMode="contain"
            source={uppperBgImg}>
            <Box flex={1} padding={'xl'}>
              <Text
                color={'textColor'}
                paddingTop="m"
                style={styles.helpUsTextStyle}
                tx="optInAnalyticsModal.helpUsToImprove"
              />
              <Text
                color={'textColor'}
                marginTop={'l'}
                variant={'normalText'}
                tx="optInAnalyticsModal.shareWhereYouClick"
              />
              <Box marginTop={'s'}></Box>

              <Box marginTop={'l'}>
                <Pressable
                  label={{ tx: 'Ok' }}
                  variant="solid"
                  style={styles.okButton}
                />
              </Box>
            </Box>
          </ImageBackground>
        </Box>
        <ImageBackground
          style={styles.lowerBgImg}
          resizeMode="contain"
          source={lowerBgImg}
        />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  modalView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerBgImg: {
    height: '98%',
  },
  upperBgImg: {
    height: '100%',
    marginTop: scale(-8),
    marginLeft: scale(-8),
  },
  helpUsTextStyle: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: scale(24),
    lineHeight: scale(30),
    textAlign: 'left',
  },
  okButton: {
    height: scale(36),
    width: scale(54),
  },
})

export default NftOverviewScreen
