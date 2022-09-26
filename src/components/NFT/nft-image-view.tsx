import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native'
import React from 'react'
import { AppIcons } from '../../assets'
import { Box, palette } from '../../theme'
import { Text } from '../text/text'

const { SignOut } = AppIcons

type NftImageViewProps = {
  width: number
  height: number
  isFullPage?: boolean
}

const NftImageView: React.FC<NftImageViewProps> = (props) => {
  const { iterableNftArray, seeNftDetail } = props

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray.length !== 0) {
      rows = iterableNftArray.map((nftItem, index) => {
        //If NFT collection array is 1, image should cover full width
        if (nftItem.length === 1) {
          return (
            <Box style={{ margin: 20 }}>
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
              <Pressable onPress={() => seeNftDetail(nftItem[0])}>
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
                <Pressable
                  onPress={() => seeNftDetail(nftItemInsideCollection)}>
                  <Image
                    source={{
                      uri: nftItemInsideCollection.image_thumbnail_url,
                    }}
                    style={{ width: 150, height: 100 }}
                  />
                </Pressable>
              )
            },
          )
          return (
            <ScrollView key={index} horizontal={true}>
              <Box
                flex={0.1}
                flexDirection="row"
                alignItems="center"
                paddingHorizontal="s">
                {nftImagesScrollable}
              </Box>
            </ScrollView>
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

  tabText: {
    //fontFamily: 'Anek Kannada';
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0.75,
    textTransform: 'capitalize',
    color: '#646F85',

    /* Light Mode_Asset & Activity Rows/Grey Meta Data */
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

  headerTextFocused: {
    color: palette.black2,
  },
  fiatFast: {
    color: palette.green,
  },
})

export default NftImageView
