import React, { useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Box, Button, faceliftPalette, Text } from '../theme'
import { AppIcons, Fonts } from '../assets'
import { scale } from 'react-native-size-matters'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { NFTAsset } from '../types'
import { useNavigation } from '@react-navigation/core'
type ReviewDrawerProps = {
  nftItem?: NFTAsset[]
  accountIdsToSendIn?: string[]
}

const ReviewDrawer: React.FC<ReviewDrawerProps> = (props) => {
  const { accountIdsToSendIn, nftItem } = props

  const navigation = useNavigation()

  const navigateToReview = () => {
    navigation.navigate('NftOverviewScreen', {
      nftItem,
      accountIdsToSendIn,
    })
  }
  const renderNftSendContent = () => {
    return (
      <Box style={styles.drawerContainer}>
        <Text style={(styles.text, styles.drawerTitle)}>Review Send NFT</Text>
        <Text style={(styles.text, styles.subheadingText)}>
          Network/Speed Fee
        </Text>
        <Box flexDirection={'row'}>
          <Text style={(styles.text, styles.subheadingInfo)}>
            ~0.004325 ETH | $13.54
          </Text>
        </Box>
        <Text style={(styles.text, styles.subheadingText)}>Send To</Text>
        <Text style={(styles.text, styles.subheadingInfo)}>
          sample.blockchain
        </Text>
        <Text style={(styles.text, styles.subheadingInfo)}>000x0000</Text>

        <Box alignItems={'center'} paddingTop={'xl'}>
          <Button
            type="primary"
            variant="l"
            label={'Send'}
            isBorderless={false}
            isActive={true}
            onPress={navigateToReview}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <BottomDrawer
        containerHeight={481}
        downDisplay={580}
        offset={50}
        startUp={true}
        roundedEdges={false}
        backgroundColor={faceliftPalette.white}
        onExpanded={() => setShowExpanded(true)}
        onCollapsed={() => setShowExpanded(false)}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity>{renderNftSendContent()}</TouchableOpacity>
        </ScrollView>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { paddingHorizontal: 35, paddingVertical: 20 },
  container: {
    backgroundColor: 'black',
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    zIndex: 10,
  },
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: faceliftPalette.white,
    zIndex: 100,
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

  text: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 0.5,
  },

  drawerTitle: {
    fontSize: 30,
    lineHeight: 40,
    color: faceliftPalette.darkGrey,
    marginTop: 20,
  },

  subheadingText: {
    color: faceliftPalette.greyMeta,
    fontSize: 15,
    marginTop: 30,
  },

  subheadingInfo: {
    color: faceliftPalette.greyBlack,
    fontSize: 15,
    marginTop: 5,
  },

  flex: { flex: 1 },
})

export default ReviewDrawer
