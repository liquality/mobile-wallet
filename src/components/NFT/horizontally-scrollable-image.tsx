import { Image, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { AppIcons, Fonts } from '../../assets'
import { Box, faceliftPalette, palette } from '../../theme'
import { Text } from '../text/text'
import StarFavorite from './star-favorite'
import { NFTAsset } from '@chainify/types'
import { NFT } from '../../types'
import { checkIfCollectionNameExists, checkImgUrlExists } from '../../utils'
const { SeeAllNftsIcon, LongArrow } = AppIcons

type HorizontallyScrollableImageProps = {
  index: number
  nftItem: NFT[]
  seeNftDetail: (nftItem: NFTAsset[]) => void
  imgError: string[]
  activeWalletId: string
  handleGoToCollection: (nftItem: NFTAsset[]) => void
}

const HorizontallyScrollableImage: React.FC<
  HorizontallyScrollableImageProps
> = (props) => {
  const {
    index,
    nftItem,
    seeNftDetail,

    imgError,
    activeWalletId,
    handleGoToCollection,
  } = props

  const nftImagesScrollable = useMemo(
    () =>
      nftItem.map((nftItemInsideCollection: NFTAsset, indexKey: number) => {
        return (
          <Box key={indexKey}>
            <Pressable
              style={styles.pressable}
              onPress={() => seeNftDetail(nftItemInsideCollection)}>
              <Image
                source={checkImgUrlExists(
                  nftItemInsideCollection.image_original_url,
                  imgError,
                )}
                style={styles.scrollableImg}
                onError={() =>
                  imgError.push(nftItemInsideCollection.image_original_url)
                }
              />
            </Pressable>
            <StarFavorite
              nftAsset={nftItemInsideCollection}
              activeWalletId={activeWalletId}
            />
          </Box>
        )
      }),
    [activeWalletId, imgError, nftItem, seeNftDetail],
  )
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
          <Text style={[styles.collectionNameText, styles.pipe]}> | </Text>{' '}
          {nftItem.length}{' '}
        </Text>
      </Pressable>
      <ScrollView key={index} horizontal={true}>
        <Box flex={0.1} flexDirection="row" alignItems="center">
          {nftImagesScrollable}

          {nftItem.length > 6 ? (
            <Pressable
              onPress={() => handleGoToCollection(nftItem)}
              style={styles.pressable}>
              <SeeAllNftsIcon width={105} height={105} />
              <Text style={styles.seeAllText}>See {'\n'}All</Text>
              <LongArrow style={styles.longArrow} />
            </Pressable>
          ) : null}
        </Box>
      </ScrollView>
    </Box>
  )
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

export default HorizontallyScrollableImage
