import { ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { AppIcons, Fonts } from '../../assets'
import { Box, faceliftPalette } from '../../theme'
import { Text } from '../text/text'

const { Line } = AppIcons

type NoNftsProps = {}

const NoNfts: React.FC<NoNftsProps> = () => {
  //TODO: To be implemented with right assets
  /*   const renderNftMarketPlaces = () => {
    let rows = []
    let iterableNftMarketPlaceArray = [1, 2, 3, 4]
    rows = iterableNftMarketPlaceArray.map((nftItem, index) => {
      return (
        <Box>
          <ScrollView key={index} horizontal={true}>
            <Box flex={0.1} flexDirection="row" alignItems="center">
              <Pressable
                onPress={() => console.log('MARKET PLACE CLICK')}
                style={styles.pressable}>
                <SeeAllNftsIcon width={105} height={105} />
                <Text style={styles.seeAllText}>See {'\n'}All</Text>
                <LongArrow style={styles.longArrow} />
              </Pressable>
            </Box>
          </ScrollView>
        </Box>
      )
    })
    return rows
  } */

  //Main render
  return (
    <Box margin={'xl'}>
      <Text
        style={[styles.headerText, styles.headerTitle]}
        tx="nft.noNftsTitle"
      />
      <Text style={styles.headerText} tx="nft.noNftsHeaderText" />
      <Line style={styles.line} />

      <ScrollView horizontal={true}>
        <Box flex={0.1} flexDirection="row" alignItems="center">
          {/*  TODO: Implement {renderNftMarketPlaces()}
           */}
        </Box>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 35,
    fontWeight: '500',
  },
  line: { marginTop: 40 },
})

export default NoNfts
