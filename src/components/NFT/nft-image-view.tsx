import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import React, { useState } from 'react'
import { AppIcons } from '../../assets'
import { Box, palette } from '../../theme'
import { Text } from '../text/text'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'
import { toggleNFTStarred } from '../../store/store'

const { SeeAllNftsIcon, LongArrow, Star, Ellipse, BlackStar } = AppIcons

type NftImageViewProps = {
  iterableNftArray: Object
  seeNftDetail: () => void
  activeWalletId?: boolean
}

const NftImageView: React.FC<NftImageViewProps> = (props) => {
  const { iterableNftArray, seeNftDetail, activeWalletId } = props
  const [starredNft, setStarredNft] = useState<boolean>(false)
  const activeNetwork = useRecoilValue(networkState)

  const renderStarFavorite = (nftAsset) => {
    return (
      <Pressable
        onPress={() => {
          toggleStarred(nftAsset)
        }}
        style={styles.ellipse}>
        <Ellipse style={styles.ellipse}></Ellipse>
        {nftAsset.starred ? (
          <BlackStar style={styles.star}></BlackStar>
        ) : (
          <Star style={styles.star}></Star>
        )}
      </Pressable>
    )
  }

  const toggleStarred = async (nftAsset: Object) => {
    setStarredNft(!starredNft)
    const payload = {
      network: activeNetwork,
      walletId: activeWalletId,
      accountId: nftAsset.accountId,
      nft: nftAsset,
    }
    console.log(nftAsset.starred, 'starred or no?')
    await toggleNFTStarred(payload)
  }

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray.length !== 0) {
      rows = iterableNftArray.map((nftItem, index) => {
        //If NFT collection array is 1, image should cover full width
        if (nftItem.length === 1) {
          return (
            <Box style={{ margin: 20 }}>
              <Text>
                {nftItem[0].collection.name} | {nftItem.length}
              </Text>
              <Pressable onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  source={{
                    uri: nftItem[0].image_thumbnail_url,
                  }}
                  style={{
                    width: Dimensions.get('screen').width,
                    resizeMode: 'contain',
                    aspectRatio: 1, // Your aspect ratio
                  }}
                />
              </Pressable>
            </Box>
          )
        } else if (nftItem.length === 2) {
          return (
            <Box style={{ margin: 20 }}>
              <Text>
                {nftItem[0].collection.name} | {nftItem.length}
              </Text>
              <Pressable
                style={styles.pressable}
                onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  source={{
                    uri: nftItem[0].image_thumbnail_url,
                  }}
                  style={{
                    width: Dimensions.get('screen').width / 2,
                    height: Dimensions.get('screen').width / 2,
                  }}
                />
                <Image
                  source={{
                    uri: nftItem[1].image_thumbnail_url,
                  }}
                  style={{
                    width: Dimensions.get('screen').width / 2,
                    height: Dimensions.get('screen').width / 2,
                  }}
                />
              </Pressable>
            </Box>
          )
        } else {
          let nftImagesScrollable = nftItem.map(
            (nftItemInsideCollection, index) => {
              return (
                <Box>
                  <Pressable
                    style={styles.pressable}
                    onPress={() => seeNftDetail(nftItemInsideCollection)}>
                    <Image
                      source={{
                        uri: nftItemInsideCollection.image_thumbnail_url,
                      }}
                      style={{
                        marginRight: 5,
                        width: 105,
                        height: 105,
                      }}
                    />
                  </Pressable>
                  {renderStarFavorite(nftItemInsideCollection)}
                </Box>
              )
            },
          )
          return (
            <Box style={{ margin: 20 }}>
              <Text>
                {nftItem[0].collection.name} | {nftItem.length}
              </Text>
              <ScrollView key={index} horizontal={true}>
                <Box
                  flex={0.1}
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="s">
                  {nftImagesScrollable}

                  <Pressable
                    onPress={() =>
                      console.log('Go to full collection screen here!')
                    }
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
  container: {},

  seeAllText: {
    position: 'absolute',
    left: '17.14%',
    right: '56.19%',
    top: '16.19%',
    bottom: '15.24%',

    //fontFamily: 'Anek Kannada',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 18,
    color: palette.white,
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
    left: '8%',
    right: '8%',
    top: '8%',
    bottom: '8%',
  },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },

  tabBarFocused: {
    borderBottomWidth: 2,
    lineHeight: '1em',

    color: palette.purplePrimary,
    borderBottomColor: palette.purplePrimary,
  },
  pressable: { position: 'relative' },
})

export default NftImageView
