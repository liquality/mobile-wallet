import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { Fonts } from '../../assets'
import { Box } from '../../theme'
import { Text } from '../text/text'
import { useNavigation } from '@react-navigation/core'
import { faceliftPalette } from '../../theme/faceliftPalette'
import StarFavorite from './star-favorite'
import { NFTAsset } from '../../types'
import FullWidthImage from './full-width-image'
import HorizontallyScrollableImage from './horizontally-scrollable-image'
import { checkIfCollectionNameExists, checkImgUrlExists } from '../../utils'

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
  const [imgError] = useState<string[]>([])
  const navigation = useNavigation()

  const handleGoToCollection = useCallback(
    (nftCollection) => {
      navigation.navigate('NftCollectionScreen', {
        nftCollection,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  const renderNftArray = useCallback(() => {
    let rows = []
    rows = iterableNftArray.map((nftItem, index) => {
      //If NFT collection array is 1, image should cover full width
      if (nftItem.length === 1) {
        return (
          <FullWidthImage
            index={index}
            nftItem={nftItem}
            seeNftDetail={seeNftDetail}
            imgError={imgError}
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
                  {checkIfCollectionNameExists(nftItem[0].collection.name)}{' '}
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
                          source={checkImgUrlExists(
                            item.image_original_url,
                            imgError,
                          )}
                          onError={() => imgError.push(item.image_original_url)}
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
      } else if (
        nftItem.length === 3 ||
        (nftItem.length > 4 && !showAllNftsScreen)
      ) {
        return (
          <Box>
            <Pressable
              style={styles.collectionTextContainer}
              onPress={() => handleGoToCollection(nftItem)}>
              <Text style={[styles.collectionNameText, styles.numberOfNfts]}>
                <Text style={styles.collectionNameText}>
                  {' '}
                  {checkIfCollectionNameExists(nftItem[0].collection.name)}{' '}
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
            imgError={imgError}
            activeWalletId={activeWalletId}
            handleGoToCollection={handleGoToCollection}
          />
        )
      }
    })

    return rows
  }, [
    activeWalletId,
    handleGoToCollection,
    imgError,
    iterableNftArray,
    seeNftDetail,
    showAllNftsScreen,
  ])

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
    width: Dimensions.get('screen').width / 2.3,
    height: Dimensions.get('screen').width / 2.3,
  },
  threeImagesOnRow: {
    width: Dimensions.get('screen').width / 3.3,
    height: Dimensions.get('screen').width / 3.3,
  },
})

export default NftImageView
