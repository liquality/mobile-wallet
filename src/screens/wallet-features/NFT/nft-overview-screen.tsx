import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import {
  Clipboard,
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'
import { useRecoilValue } from 'recoil'
import { AppIcons, Fonts, Images } from '../../../assets'
import { networkState, themeMode } from '../../../atoms'
import CopyPopup from '../../../components/copy-popup'

import { sendNFTTransaction, updateNFTs } from '../../../store/store'
import { Text, Box, palette, faceliftPalette } from '../../../theme'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'

const {
  NftCard,
  AngleDownIcon,
  AngleUpIcon,
  Line,
  PurpleCopy,
  ConfirmationTrackerLine,
} = AppIcons
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
  const [showAccordion, setShowAccordion] = useState(false)
  const [showCopyPopup, setShowCopyPopup] = useState(false)

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

  const handleCopyAddressPress = async (stringToCopy: string) => {
    Clipboard.setString(stringToCopy)
    setShowCopyPopup(true)
  }

  const renderAccordion = () => {
    return (
      <Box>
        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Transaction ID</Text>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={(styles.lowerRowText, styles.purpleLink)}>00x000</Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>

        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Last Price</Text>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={styles.lowerRowText}>0.009 ETH</Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>

        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Your NFT from Address</Text>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={(styles.lowerRowText, styles.purpleLink)}>
              000x000
            </Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>

        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Your NFT to Address</Text>
          <Text style={(styles.lowerRowText, styles.purpleLink)}>
            sample.blockchain
          </Text>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={(styles.lowerRowText, styles.purpleLink)}>00x00</Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>

        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Token ID</Text>

          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={(styles.lowerRowText, styles.purpleLink)}>
              {nftItem.token_id}
            </Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>

        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Token Standard</Text>

          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={styles.lowerRowText}>ERC-721</Text>
            <Pressable onPress={() => handleCopyAddressPress('string-to-copy')}>
              <PurpleCopy />
            </Pressable>
          </Box>
        </Box>
      </Box>
    )
  }

  const renderTransactionSteps = () => {
    return (
      <Box
        marginTop={'xl'}
        width={scale(334)}
        height={scale(464)}
        backgroundColor={'greyBackground'}
        padding={'xl'}>
        <ConfirmationTrackerLine />
        <Text style={(styles.lowerRowText, styles.bold)}>TRANSACTION</Text>
      </Box>

      /*  <Box
        marginTop={'xl'}
        width={scale(334)}
        height={scale(464)}
        backgroundColor={'greyBackground'}>
        <Pressable style={styles.pressable}>
          <ConfirmationTrackerLine />

          <Text style={{ position: 'absolute', top: 0, left: 0 }}>
            TRANSACTION
          </Text>
        </Pressable>
      </Box> */
    )
  }
  return (
    <Box flex={1} paddingHorizontal={'xl'} backgroundColor={'white'}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {showCopyPopup ? (
          <CopyPopup
            showPopup={showCopyPopup}
            setShowPopup={setShowCopyPopup}
          />
        ) : null}

        <Box
          flexDirection={'row'}
          alignItems="center"
          justifyContent={'center'}>
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
          </Pressable>
        </Box>
        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Text style={styles.upperRowText}>Status</Text>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={styles.lowerRowText}>Completed/00 Confirmations</Text>
            <Text style={styles.lowerRowText}>ICON</Text>
          </Box>
        </Box>
        <Box paddingVertical={'l'}>
          <Text style={styles.upperRowText}>Initiated</Text>
          <Text style={styles.lowerRowText}>4/27/2022, 6:51pm</Text>
        </Box>
        <Box paddingVertical={'l'}>
          <Text style={styles.upperRowText}>Completed</Text>
          <Text style={styles.lowerRowText}>4/27/2022, 7:51pm</Text>
        </Box>
        <Box paddingVertical={'l'}>
          <Text style={styles.upperRowText}>Network Speed/Fee</Text>
          <Text style={styles.lowerRowText}>
            ETH Avg. 0.004325 ETH | 13.54 USD
          </Text>
        </Box>

        {renderTransactionSteps()}
        <Box paddingVertical={'l'} paddingTop={'xl'}>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Text style={(styles.lowerRowText, styles.bold)}>ADVANCED</Text>
            <Pressable onPress={() => setShowAccordion(!showAccordion)}>
              {showAccordion ? <AngleDownIcon /> : <AngleUpIcon />}
            </Pressable>
          </Box>
          <Box marginTop={'xl'}>{showAccordion ? <Line /> : null}</Box>
        </Box>
        {showAccordion ? renderAccordion() : null}
      </ScrollView>
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
    letterSpacing: 0.5,

    color: faceliftPalette.mediumGrey,
    position: 'absolute',
    left: '42.19%',
    top: '19.19%',
    bottom: '15.24%',
  },

  nftName: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 21,
    lineHeight: 27,
    letterSpacing: 0.5,

    color: faceliftPalette.darkGrey,
    position: 'absolute',
    left: '42.19%',
    top: '42.19%',
    bottom: '15.24%',
  },

  nftImage: {
    position: 'absolute',
    left: '10.14%',
    right: '5.19%',
    top: '19.19%',
    bottom: '15.24%',
    width: scale(83),
    height: scale(83),
  },

  purpleLink: { color: faceliftPalette.buttonDefault },

  upperRowText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: faceliftPalette.greyMeta,
  },

  lowerRowText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: 0.5,
    color: faceliftPalette.greyBlack,
  },

  bold: { fontWeight: '500' },

  pressable: { position: 'relative' },
})

export default NftOverviewScreen
