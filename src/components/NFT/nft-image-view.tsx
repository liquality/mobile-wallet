import {
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { AppIcons, Fonts } from '../../assets'
import { Box, palette } from '../../theme'
import { Text } from '../text/text'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'
import { toggleNFTStarred } from '../../store/store'
import { useNavigation } from '@react-navigation/core'
import { faceliftPalette } from '../../theme/faceliftPalette'
import StarFavorite from './star-favorite'

const { SeeAllNftsIcon, LongArrow, Star, Ellipse, BlackStar } = AppIcons

type NftImageViewProps = {
  iterableNftArray: Object
  seeNftDetail: (
    nftItem: Object,
    e: NativeSyntheticEvent<NativeTouchEvent>,
  ) => void
  activeWalletId?: boolean
  accountIdsToSendIn: string[]
}

const NftImageView: React.FC<NftImageViewProps> = (props) => {
  const { iterableNftArray, seeNftDetail, activeWalletId, accountIdsToSendIn } =
    props
  const activeNetwork = useRecoilValue(networkState)
  const [imgError, setImgError] = useState<boolean>(false)
  const navigation = useNavigation()

  const checkImgUrlExists = (imgUrl: string) => {
    console.log(imgError, 'IMG ERRO?', imgUrl)
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
    [navigation],
  )

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray.length !== 0) {
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
                  onPress={(e) => seeNftDetail(nftItem[0], e)}>
                  <Image
                    source={checkImgUrlExists(nftItem[0].image_thumbnail_url)}
                    style={{
                      borderRadius: 4,
                      width: Dimensions.get('screen').width - 20,
                      resizeMode: 'contain',
                      aspectRatio: 1,
                    }}
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
                    uri: nftItem[0].image_thumbnail_url,
                  }}
                  style={{
                    width: Dimensions.get('screen').width / 2,
                    height: Dimensions.get('screen').width / 2,
                  }}
                  onError={() => setImgError(true)}
                />
                <Image
                  source={{
                    uri: nftItem[1].image_thumbnail_url,
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
        } else {
          let nftImagesScrollable = nftItem.map(
            (nftItemInsideCollection, index) => {
              return (
                <Box key={index}>
                  <Pressable
                    style={styles.pressable}
                    onPress={() => seeNftDetail(nftItemInsideCollection)}>
                    <Image
                      source={checkImgUrlExists(
                        nftItemInsideCollection.image_thumbnail_url,
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
                    <SeeAllNftsIcon width={105} height={105}></SeeAllNftsIcon>
                    <Text style={styles.seeAllText}>See {'\n'}All</Text>
                    <LongArrow style={styles.longArrow}></LongArrow>
                  </Pressable>
                </Box>
              </ScrollView>
            </Box>
          )
        }
      })
    } else {
      return <Text>No NFTs to show</Text>
    }

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
  ellipse: {
    position: 'absolute',
    left: '0%',
    right: '0%',
    top: '0%',
    bottom: '0%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  star: {
    position: 'absolute',
    left: 9,
    top: 9,
  },
  starContainer: { position: 'absolute' },

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
