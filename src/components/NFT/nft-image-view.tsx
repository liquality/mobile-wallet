import {
  Dimensions,
  Image,
  Pressable,
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

const { SeeAllNftsIcon, LongArrow } = AppIcons

type NftImageViewProps = {
  iterableNftArray: NFTAsset[]
  seeNftDetail: (nftItem: NFTAsset[]) => void
  activeWalletId: string
  accountIdsToSendIn: string[]
}

const NftImageView: React.FC<NftImageViewProps> = (props) => {
  const { iterableNftArray, seeNftDetail, activeWalletId, accountIdsToSendIn } =
    props
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
          <Box paddingVertical={'xl'} key={index}>
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

            <Box>
              <Pressable
                style={styles.pressable}
                onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  source={checkImgUrlExists(nftItem[0].image_original_url)}
                  style={styles.oneImageBig}
                  onError={() => setImgError(true)}
                />
              </Pressable>

              <StarFavorite
                nftAsset={nftItem[0]}
                activeWalletId={activeWalletId}
              />
            </Box>
          </Box>
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
            <Pressable
              style={styles.pressable}
              onPress={(e) => seeNftDetail(nftItem[0], e)}>
              <Image
                source={{
                  uri: nftItem[0].image_original_url,
                }}
                style={{
                  width: Dimensions.get('screen').width / 2,
                  height: Dimensions.get('screen').width / 2,
                }}
                onError={() => setImgError(true)}
              />
              <Image
                source={{
                  uri: nftItem[1].image_original_url,
                }}
                style={{
                  width: Dimensions.get('screen').width / 2,
                  height: Dimensions.get('screen').width / 2,
                }}
                onError={() => setImgError(true)}
              />
            </Pressable>
          </Box>
        )
        //If NFT collection array is more than 2, images should appear in scrollable list
      } else {
        let nftImagesScrollable = nftItem.map(
          (nftItemInsideCollection: NFTAsset, indexKey: number) => {
            return (
              <Box key={indexKey}>
                <Pressable
                  style={styles.pressable}
                  onPress={() => seeNftDetail(nftItemInsideCollection)}>
                  <Image
                    source={checkImgUrlExists(
                      nftItemInsideCollection.image_original_url,
                    )}
                    style={styles.scrollableImg}
                    onError={() => setImgError(true)}
                  />
                </Pressable>
                <StarFavorite
                  nftAsset={nftItemInsideCollection}
                  activeWalletId={activeWalletId}
                />
              </Box>
            )
          },
        )
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
            <ScrollView key={index} horizontal={true}>
              <Box flex={0.1} flexDirection="row" alignItems="center">
                {nftImagesScrollable}

                <Pressable
                  onPress={() => handleGoToCollection(nftItem)}
                  style={styles.pressable}>
                  <SeeAllNftsIcon width={105} height={105} />
                  <Text style={styles.seeAllText}>See {'\n'}All</Text>
                  <LongArrow style={styles.longArrow} />
                </Pressable>
              </Box>
            </ScrollView>
          </Box>
        )
      }
    })

    return rows
  }

  return renderNftArray()
}

const styles = StyleSheet.create({
  scrollableImg: {
    marginRight: 5,
    width: 105,
    height: 105,
    borderRadius: 4,
  },

  oneImageBig: {
    borderRadius: 4,
    width: Dimensions.get('screen').width - 20,
    resizeMode: 'contain',
    aspectRatio: 1,
  },

  seeAllText: {
    position: 'absolute',
    left: '17.14%',
    right: '56.19%',
    top: '19.19%',
    bottom: '15.24%',
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 25,
    color: palette.white,
    letterSpacing: 0.5,
  },
  longArrow: {
    position: 'absolute',
    left: '60%',
    right: '50%',
    top: '60%',
    bottom: '50%',
  },

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

  pressable: { position: 'relative' },
})

export default NftImageView
