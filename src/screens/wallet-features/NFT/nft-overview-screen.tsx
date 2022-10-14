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
import { AppIcons, Fonts } from '../../../assets'
import { themeMode } from '../../../atoms'

import { Text, Box, faceliftPalette } from '../../../theme'
import { showCopyToast } from '../../../theme/toastConfig'
import { RootStackParamList } from '../../../types'
import { checkIfCollectionNameExists, labelTranslateFn } from '../../../utils'

const { NftCard, AngleDownIcon, AngleUpIcon, Line, PurpleCopy } = AppIcons

type NftOverviewScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftOverviewScreen'
>

const NftOverviewScreen = ({ route }: NftOverviewScreenProps) => {
  const { nftItem } = route.params
  //TODO: Implement loading for transaction to display transaction steps
  //const [loadingSend, setLoadingSend] = useState(false)
  const theme = useRecoilValue(themeMode)
  const [showAccordion, setShowAccordion] = useState(false)

  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const handleCopyAddressPress = async (stringToCopy: string) => {
    showCopyToast('copyToast', labelTranslateFn('nft.addressCopied')!)
    Clipboard.setString(stringToCopy)
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
            <Text style={styles.lowerRowText}>{nftItem.standard}</Text>
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
        <Text style={(styles.lowerRowText, styles.bold)}>TRANSACTION</Text>
      </Box>

      /* TODO: Add additional styling to this and fetch transaction steps data
       <Box
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
    <Box
      flex={1}
      paddingVertical={'xxl'}
      paddingHorizontal={'xl'}
      backgroundColor={backgroundColor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          flexDirection={'row'}
          alignItems="center"
          justifyContent={'center'}>
          <Pressable style={styles.pressable}>
            <NftCard width={355} height={154} />

            <Text style={styles.collectionName}>
              {checkIfCollectionNameExists(nftItem.collection.name)}
            </Text>
            <Text style={styles.nftName}>
              {checkIfCollectionNameExists(nftItem.name)} {'\n'} #
              {nftItem.token_id}
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
