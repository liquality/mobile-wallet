import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { AppIcons, Fonts } from '../../assets'
import { Box, palette } from '../../theme'
import { Text } from '../text/text'
import { useNavigation } from '@react-navigation/core'
import { faceliftPalette } from '../../theme/faceliftPalette'
import StarFavorite from './star-favorite'
import { NFTAsset } from '../../types'
import FullWidthImage from './full-width-image'
import HorizontallyScrollableImage from './horizontally-scrollable-image'

const { SeeAllNftsIcon, LongArrow } = AppIcons

type NftImageViewProps = {
  iterableNftArray: NFTAsset[]
  seeNftDetail: (nftItem: NFTAsset[]) => void
  activeWalletId: string
  accountIdsToSendIn: string[]
  showAllNftsScreen?: boolean
}

const NftImageView: React.FC<NftImageViewProps> = (props) => {
  const {
    showAllNftsScreen,
    iterableNftArray,
    seeNftDetail,
    activeWalletId,
    accountIdsToSendIn,
  } = props
  const [imgError, setImgError] = useState<boolean>(false)
  const navigation = useNavigation()

  const checkImgUrlExists = (imgUrl: string) => {
    return !imgError && imgUrl
      ? { uri: imgUrl }
      : require('../../assets/icons/nft_thumbnail.png')
  }

  const handleGoToCollection = useCallback(
    (nftCollection) => {
      navigation.navigate('NftCollectionScreen', {
        nftCollection,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  const renderNftArray = () => {
    let rows = []
    rows = iterableNftArray.map((nftItem, index) => {
      //If NFT collection array is 1, image should cover full width
      if (nftItem.length === 1) {
        return (
          <FullWidthImage
            index={index}
            nftItem={nftItem}
            seeNftDetail={seeNftDetail}
            setImgError={setImgError}
            checkImgUrlExists={checkImgUrlExists}
            activeWalletId={activeWalletId}
            handleGoToCollection={handleGoToCollection}
          />
        )
        //If NFT collection array is 2, images should be on 1 row next to eachother
      } else if (nftItem.length === 2) {
        return (
          <Box>
            <Pressable
              style={styles.collectionTextContainer}
              onPress={() => handleGoToCollection(nftItem)}>
              <Text style={[styles.collectionNameText, styles.numberOfNfts]}>
                <Text style={styles.collectionNameText}>
                  {' '}
                  {nftItem[0].collection.name}{' '}
                </Text>
                <Text style={[styles.collectionNameText, styles.pipe]}>
                  {' '}
                  |{' '}
                </Text>{' '}
                {nftItem.length}{' '}
              </Text>
            </Pressable>

            <SafeAreaView>
              <FlatList
                data={nftItem}
                numColumns={2}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  return (
                    <Box style={styles.inner}>
                      <Pressable onPress={() => seeNftDetail(item)}>
                        <Image
                          source={{
                            uri: item.image_original_url,
                          }}
                          style={styles.twoImagesOnRow}
                        />
                      </Pressable>
                      <StarFavorite
                        nftAsset={item}
                        activeWalletId={activeWalletId}
                      />
                    </Box>
                  )
                }}
              />
            </SafeAreaView>
          </Box>
        )
      } else if (nftItem === 3 || (nftItem.length > 4 && !showAllNftsScreen)) {
        return (
          <Box>
            <Pressable
              style={styles.collectionTextContainer}
              onPress={() => handleGoToCollection(nftItem)}>
              <Text style={[styles.collectionNameText, styles.numberOfNfts]}>
                <Text style={styles.collectionNameText}>
                  {' '}
                  {nftItem[0].collection.name}{' '}
                </Text>
                <Text style={[styles.collectionNameText, styles.pipe]}>
                  {' '}
                  |{' '}
                </Text>{' '}
                {nftItem.length}{' '}
              </Text>
            </Pressable>

            <SafeAreaView>
              <FlatList
                data={nftItem}
                numColumns={3}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                  return (
                    <Box style={styles.inner}>
                      <Pressable onPress={() => seeNftDetail(item)}>
                        <Image
                          source={{
                            uri: item.image_original_url,
                          }}
                          style={styles.threeImagesOnRow}
                        />
                      </Pressable>
                      <StarFavorite
                        nftAsset={item}
                        activeWalletId={activeWalletId}
                      />
                    </Box>
                  )
                }}
              />
            </SafeAreaView>
          </Box>
        )
      }
      //If NFT collection array is more than 4 and ShowAllNftsScreen is images should appear in scrollable list
      else if (nftItem.length > 4 && showAllNftsScreen) {
        return (
          <HorizontallyScrollableImage
            nftItem={nftItem}
            seeNftDetail={seeNftDetail}
            setImgError={setImgError}
            checkImgUrlExists={checkImgUrlExists}
            activeWalletId={activeWalletId}
            handleGoToCollection={handleGoToCollection}
          />
        )
      }
    })

    return rows
  }

  return renderNftArray()
}

const styles = StyleSheet.create({
  collectionNameText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 27,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
  },
  collectionTextContainer: {
    paddingVertical: 10,
  },

  pipe: {
    color: faceliftPalette.grey,
  },
  numberOfNfts: {
    fontWeight: '400',
  },

  inner: {
    flexDirection: 'row',
    marginRight: 5,
    marginBottom: 5,
  },
  twoImagesOnRow: {
    width: Dimensions.get('screen').width / 2.2,
    height: Dimensions.get('screen').width / 2.2,
  },
  threeImagesOnRow: {
    width: Dimensions.get('screen').width / 3.3,
    height: Dimensions.get('screen').width / 3.3,
  },
})

export default NftImageView
