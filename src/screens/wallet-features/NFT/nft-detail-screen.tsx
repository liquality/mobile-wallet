import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { Box, faceliftPalette, palette, Text } from '../../../theme'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { RootStackParamList } from '../../../types'
import { Fonts, AppIcons } from '../../../assets'
import DetailsDrawerExpanded from '../../../components/NFT/details-drawer-expanded'
import StarAndThreeDots from '../../../components/NFT/star-and-three-dots'
import { checkIfCollectionNameExists, checkImgUrlExists } from '../../../utils'

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>

const { ShortLine } = AppIcons

const wallet = setupWallet({
  ...defaultOptions,
})
const NftDetailScreen = ({ route }: NftDetailScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)

  const [imgError, setImgError] = useState<string[]>([])
  const [showExpanded, setShowExpanded] = useState<boolean>(false)
  const [showOverview, setShowOverview] = useState<boolean>(true)

  const { activeWalletId } = wallet.state

  useEffect(() => {
    async function fetchData() {}
    fetchData()
  }, [activeNetwork, activeWalletId])

  const renderDrawerCollapsed = () => {
    return (
      <Text style={styles.drawerClosedText}>
        {checkIfCollectionNameExists(nftItem.name)} #{nftItem?.token_id}
      </Text>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <Box
        style={styles.headerContainer}
        justifyContent={'center'}
        alignItems={'center'}>
        <Image
          source={checkImgUrlExists(nftItem.image_original_url, imgError)}
          style={styles.image}
          onError={() => imgError.push(nftItem.image_original_url)}
        />
      </Box>
      <BottomDrawer
        containerHeight={671}
        downDisplay={580}
        offset={150}
        startUp={false}
        roundedEdges={false}
        backgroundColor={'rgba(255, 255, 255, 0.77)'}
        onExpanded={() => setShowExpanded(true)}
        onCollapsed={() => setShowExpanded(false)}>
        <Box justifyContent={'center'} alignItems={'center'}>
          <ShortLine style={styles.shortLine} />
          <ShortLine />
        </Box>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity>
            <Box style={styles.drawerContainer}>
              <Box marginVertical={'s'} flexDirection={'row'}>
                <Text style={[styles.descriptionTitle, styles.flex]}>
                  {!showExpanded ? renderDrawerCollapsed() : null}
                </Text>
                <StarAndThreeDots
                  accountIdsToSendIn={accountIdsToSendIn}
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
            </Box>
          </TouchableOpacity>
        </ScrollView>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { paddingHorizontal: 35, paddingVertical: 20 },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: palette.white,
  },

  shortLine: { padding: 3 },
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

  flex: { flex: 1 },
})

export default NftDetailScreen
