import React, { useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

import { Box, Button, faceliftPalette, Pressable, Text } from '../theme'
import { AppIcons, Fonts } from '../assets'
import { scale } from 'react-native-size-matters'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { NFTAsset } from '../types'
import { useNavigation } from '@react-navigation/core'
type ReviewDrawerProps = {
  height: number
  title: string
  nftItem?: NFTAsset[]
  accountIdsToSendIn?: string[]
}

const ReviewDrawer: React.FC<ReviewDrawerProps> = (props) => {
  const { accountIdsToSendIn, nftItem, height, title } = props

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
        <Text style={(styles.text, styles.drawerTitle)}>{title}</Text>
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
          <Pressable
            variant="solid"
            label={'Send'}
            onPress={navigateToReview}
          />
        </Box>
      </Box>
    )
  }

  const renderSwapReviewContent = () => {
    return (
      <Box style={styles.drawerContainer}>
        <Text style={(styles.text, styles.drawerTitle)}>{title}</Text>
        <Text style={(styles.text, styles.subheadingText)}>
          TODO: Add Swap review content here
        </Text>
      </Box>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <BottomDrawer
        containerHeight={height}
        downDisplay={580}
        offset={50}
        startUp={true}
        roundedEdges={false}
        backgroundColor={faceliftPalette.white}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity>
            {nftItem ? renderNftSendContent() : renderSwapReviewContent()}
          </TouchableOpacity>
        </ScrollView>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { paddingHorizontal: 35, paddingVertical: 20 },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: faceliftPalette.white,
    zIndex: 100,
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
})

export default ReviewDrawer
