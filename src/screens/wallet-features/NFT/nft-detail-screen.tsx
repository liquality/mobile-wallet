import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback, useState } from 'react'
import {
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { Box, Button, faceliftPalette, palette, Text } from '../../../theme'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { RootStackParamList } from '../../../types'
import { Fonts, AppIcons } from '../../../assets'
import NftTabBar from '../../../components/NFT/nft-tab-bar'
import DetailsDrawerExpanded from '../../../components/NFT/details-drawer-expanded'
import { toggleNFTStarred } from '../../../store/store'
import StarAndThreeDots from '../../../components/NFT/star-and-three-dots'

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>

const { Star, BlackStar, Line, ThreeDots } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const NftDetailScreen = ({ navigation, route }: NftDetailScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)

  const [imgError, setImgError] = useState<boolean>(false)
  const [showExpanded, setShowExpanded] = useState<boolean>(false)
  const [showOverview, setShowOverview] = useState<boolean>(true)

  const checkImgUrlExists = (imgUrl: string) => {
    return !imgError && imgUrl
      ? { uri: imgUrl }
      : require('../../../assets/icons/nft_thumbnail.png')
  }

  const { activeWalletId } = wallet.state

  useEffect(() => {
    async function fetchData() {}
    fetchData()
  }, [activeNetwork, activeWalletId])

  const renderDrawerCollapsed = () => {
    return (
      <Text style={styles.drawerClosedText}>
        {nftItem.name} #{nftItem?.token_id}
      </Text>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <Box style={styles.headerContainer}>
        <Image
          source={checkImgUrlExists(nftItem.image_original_url)}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      </Box>
      <BottomDrawer
        containerHeight={472}
        offset={120}
        downDisplay={420}
        startUp={false}
        roundedEdges={false}
        backgroundColor={'rgba(255, 255, 255, 0.77)'}
        onExpanded={() => setShowExpanded(true)}
        onCollapse={() => setShowExpanded(false)}>
        <Box style={styles.drawerContainer}>
          <Box marginVertical={'s'} flexDirection={'row'}>
            <Text style={[styles.descriptionTitle, styles.flex]}>
              {!showExpanded ? renderDrawerCollapsed() : null}
            </Text>
            <StarAndThreeDots
              activeWalletId={activeWalletId}
              nftItem={nftItem}
            />
          </Box>
          {showExpanded ? (
            <DetailsDrawerExpanded
              nftItem={nftItem}
              showOverview={showOverview}
              setShowOverview={setShowOverview}
            />
          ) : null}
          {/*   <Button
          type="primary"
          variant="l"
          label={'Send NFT'}
          isBorderless={false}
          isActive={true}
          onPress={navigateToSendNftScreen}
        /> */}
          {/*     <ScrollView horizontal={true}>
            <TouchableOpacity>
              <Box style={styles.drawerContainer} />
            </TouchableOpacity>
          </ScrollView> */}
        </Box>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { padding: 35 },

  threeDots: {
    marginLeft: 20,
    marginTop: 10,
  },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: palette.white,
  },

  headerContainer: {
    marginBottom: 20,
  },

  image: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain',
    aspectRatio: 1,
  },

  drawerClosedText: {
    fontFamily: 'Anek Kannada',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,

    letterSpacing: 0.5,

    color: '#000000',
  },

  descriptionTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    marginTop: 0,
  },
  descriptionText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    textTransform: 'capitalize',
  },
  flex: { flex: 1 },
  leftLink: { color: palette.purplePrimary, flex: 1 },
  link: { marginTop: 3 },

  collectionName: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#646F85',
  },

  expandedTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 36,
    lineHeight: 49,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
  },

  descriptionTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    marginTop: 10,
  },
  descriptionText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    textTransform: 'capitalize',
  },
})

export default NftDetailScreen
