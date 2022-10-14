import { Dimensions, Image, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts } from '../../assets'
import { Box, faceliftPalette } from '../../theme'
import { Text } from '../text/text'
import StarFavorite from './star-favorite'
import { NFTAsset } from '@chainify/types'
import { NFT } from '../../types'
import { checkIfCollectionNameExists, checkImgUrlExists } from '../../utils'

type FullWidthImageProps = {
  index: number
  nftItem: NFT[]
  seeNftDetail: (nftItem: NFTAsset[]) => void
  setImgError: (err: boolean) => void
  imgError: string[]
  activeWalletId: string
  handleGoToCollection: (nftItem: NFTAsset[]) => void
}

const FullWidthImage: React.FC<FullWidthImageProps> = (props) => {
  const {
    index,
    nftItem,
    seeNftDetail,
    setImgError,
    imgError,
    activeWalletId,
    handleGoToCollection,
  } = props
  console.log('he')
  const renderFullWidthImage = () => {
    return (
      <Box key={index}>
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
        <Box>
          <Box justifyContent={'center'} alignItems={'center'}>
            <Pressable
              style={styles.pressable}
              onPress={() => seeNftDetail(nftItem[0])}>
              <Image
                source={checkImgUrlExists(
                  nftItem[0].image_original_url,
                  imgError,
                )}
                style={styles.oneImageBig}
                onError={() => imgError.push(nftItem[0].image_original_url)}
              />
            </Pressable>
          </Box>
          <StarFavorite nftAsset={nftItem[0]} activeWalletId={activeWalletId} />
        </Box>
      </Box>
    )
  }
  return renderFullWidthImage()
}

const styles = StyleSheet.create({
  oneImageBig: {
    borderRadius: 4,
    width: Dimensions.get('screen').width - 20,
    resizeMode: 'contain',
    aspectRatio: 1,
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

export default FullWidthImage
