import {
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { AppIcons, Fonts, Images } from '../../assets'
import { useRecoilValue } from 'recoil'
import { accountInfoStateFamily, networkState, themeMode } from '../../atoms'
import { NFT } from '../../types'
import { Box, faceliftPalette, Text } from '../../theme'
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/core'
import { getNftTransferLink } from '@liquality/wallet-core/dist/src/utils/asset'
import { AccountId } from '@liquality/wallet-core/dist/src/store/types'

const { PurpleThreeDots, ThreeDots, Send, Sell, Share, XIcon } = AppIcons

type NftContextMenu = {
  nftItem: NFT
  accountIdsToSendIn: string[]
  accountId: AccountId
}

const NftContextMenu: React.FC<NftContextMenu> = (props) => {
  const { accountIdsToSendIn, nftItem, accountId } = props
  const [showPopUp, setShowPopUp] = useState(false)
  const [marketplaceLink, setMarketplaceLink] = useState('')

  const activeNetwork = useRecoilValue(networkState)
  const accountInfo = useRecoilValue(accountInfoStateFamily(accountId))

  const navigation = useNavigation()
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const lowerBgImg =
    currentTheme === 'light' ? Images.contextMenuDark : Images.contextMenuLight

  const uppperBgImg =
    currentTheme === 'dark' ? Images.contextMenuDark : Images.contextMenuLight

  React.useEffect(() => {
    async function fetchData() {
      const transferLink = await getNftTransferLink(
        accountInfo.code,
        activeNetwork,
        nftItem?.token_id,
        nftItem?.asset_contract.address,
      )
      setMarketplaceLink(transferLink)
    }
    fetchData()
  }, [accountInfo.code, activeNetwork, nftItem])

  const navigateToSendNftScreen = useCallback(() => {
    setShowPopUp(false)
    navigation.navigate('NftSendScreen', {
      nftItem,
      accountIdsToSendIn,
      accountId,
    })
  }, [accountId, accountIdsToSendIn, navigation, nftItem])

  const renderPopUp = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        style={styles.modalView}>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor={backgroundColor}
          paddingHorizontal="onboardingPadding">
          <Box style={styles.popup}>
            <ImageBackground
              style={styles.lowerBgImg}
              resizeMode="contain"
              source={lowerBgImg}>
              <ImageBackground
                style={styles.upperBgImg}
                resizeMode="contain"
                source={uppperBgImg}>
                <Box flex={1}>
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    marginTop={'l'}>
                    <Pressable
                      onPress={navigateToSendNftScreen}
                      style={styles.row}>
                      <Send style={styles.icon} />
                      <Text style={styles.modalRowText} tx={'nft.send'} />
                    </Pressable>
                    <Pressable
                      onPress={() => Linking.openURL(marketplaceLink)}
                      style={styles.row}>
                      <Sell
                        width={scale(19)}
                        height={scale(19)}
                        style={styles.sellIcon}
                      />
                      <Text
                        style={(styles.modalRowText, styles.textPurple)}
                        tx={'nft.sell'}
                      />
                    </Pressable>
                    <Pressable style={styles.row}>
                      <Share style={styles.icon} />
                      <Text style={styles.modalRowText} tx={'nft.share'} />
                    </Pressable>
                  </Box>
                </Box>
              </ImageBackground>
            </ImageBackground>
            <TouchableWithoutFeedback onPress={() => setShowPopUp(false)}>
              <Box position={'absolute'} right={scale(10)} top={scale(-10)}>
                <PurpleThreeDots />
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </Box>
      </Modal>
    )
  }
  return (
    <Box
      style={styles.container}
      flexDirection={'row'}
      justifyContent={'space-between'}>
      <Pressable
        onPress={() => {
          navigation.goBack()
        }}
        style={styles.threeDots}>
        <XIcon />
      </Pressable>
      {showPopUp ? renderPopUp() : null}

      <Pressable
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => {
          e.stopPropagation()
        }}
        onPress={() => {
          setShowPopUp(true)
        }}
        style={styles.threeDots}>
        <ThreeDots />
      </Pressable>
      {showPopUp ? renderPopUp() : null}
    </Box>
  )
}

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: scale(20),
    marginRight: scale(20),
    marginTop: scale(10),
  },
  container: { marginTop: scale(34) },

  textPurple: { color: faceliftPalette.buttonDefault, fontSize: 17 },

  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 5 },

  modalRowText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: faceliftPalette.greyMeta,
  },
  icon: { marginRight: 10 },
  sellIcon: { marginLeft: scale(-10), marginRight: scale(8) },

  popup: {
    position: 'absolute',
    top: 60,
    right: 10,
  },

  modalView: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerBgImg: {
    height: 163,
    width: 143,
  },
  upperBgImg: {
    height: 163,
    marginTop: scale(-3),
    marginLeft: scale(-7),
  },
})

export default NftContextMenu
