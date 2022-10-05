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
import { networkState, themeMode } from '../../atoms'
import { toggleNFTStarred } from '../../store/store'
import { NFT } from '../../types'
import { Box, faceliftPalette, Text } from '../../theme'
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/core'

const { Star, BlackStar, ThreeDots, ModalClose, Send, Sell, Share } = AppIcons

type StarAndThreeDots = {
  activeWalletId: string
  nftItem: NFT
  accountIdsToSendIn: string[]
}

const StarAndThreeDots: React.FC<StarAndThreeDots> = (props) => {
  const { accountIdsToSendIn, activeWalletId, nftItem } = props
  const activeNetwork = useRecoilValue(networkState)
  const [, setShowStarred] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false)
  const navigation = useNavigation()
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark' ? 'semiTransparentDark' : 'semiTransparentWhite'

  const lowerBgImg =
    currentTheme === 'light' ? Images.rectangleDark : Images.rectangleLight

  const uppperBgImg =
    currentTheme === 'dark' ? Images.rectangleDark : Images.rectangleLight

  const navigateToSendNftScreen = useCallback(() => {
    setShowPopUp(false)
    navigation.navigate('NftSendScreen', {
      nftItem,
      accountIdsToSendIn,
    })
  }, [accountIdsToSendIn, navigation, nftItem])

  const renderPopUp = () => {
    console.log('DO I COME HERE?')
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
                      <Text style={styles.modalRowText}>Send</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        Linking.openURL(
                          `https://opensea.io/assets/ethereum/${nftItem.asset_contract?.address}/${nftItem.token_id}`,
                        )
                      }
                      style={styles.row}>
                      <Sell style={styles.sellIcon} />
                      <Text style={styles.modalRowText}>Sell</Text>
                    </Pressable>
                    <Pressable style={styles.row}>
                      <Share style={styles.icon} />
                      <Text style={styles.modalRowText}>Share</Text>
                    </Pressable>
                  </Box>
                </Box>
              </ImageBackground>
            </ImageBackground>
            <TouchableWithoutFeedback onPress={() => setShowPopUp(false)}>
              <Box position={'absolute'} right={scale(-5)} top={scale(-10)}>
                <ModalClose />
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </Box>
      </Modal>
    )
  }

  const toggleStarred = useCallback(async () => {
    nftItem.starred = !nftItem.starred
    setShowStarred(!nftItem.starred)
    const payload = {
      network: activeNetwork,
      walletId: activeWalletId,
      accountId: nftItem.accountId,
      nft: nftItem,
    }
    await toggleNFTStarred(payload)
  }, [activeNetwork, activeWalletId, nftItem])
  return (
    <>
      <Pressable
        onPress={() => {
          toggleStarred()
        }}>
        {nftItem.starred ? (
          <BlackStar width={22} height={22} />
        ) : (
          <Star width={22} height={22} />
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          setShowPopUp(true)
        }}
        style={styles.threeDots}>
        <ThreeDots />
      </Pressable>
      {showPopUp ? renderPopUp() : null}
    </>
  )
}

const styles = StyleSheet.create({
  threeDots: {
    marginLeft: 20,
    marginTop: 10,
  },

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
  sellIcon: { marginRight: 15 },

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

export default StarAndThreeDots
