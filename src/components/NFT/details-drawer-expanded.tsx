import {
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { Fonts, AppIcons } from '../../assets'
import { Box, faceliftPalette, palette } from '../../theme'
import { Text } from '../text/text'
import NftTabBar from './nft-tab-bar'
import { NFTAsset } from '../../types'

const { Line, SmallPurpleArrow, LockIcon } = AppIcons

type DetailsDrawerExpandedProps = {
  showOverview: boolean
  setShowOverview: (show: boolean) => void
  nftItem: NFTAsset
}

const DetailsDrawerExpanded: React.FC<DetailsDrawerExpandedProps> = (props) => {
  const { nftItem, showOverview, setShowOverview } = props

  console.log(nftItem, 'nftITEM')

  const renderOverviewToggle = () => {
    return (
      <Box>
        <Text style={styles.descriptionTitle} tx="nft.description" />
        <Text style={styles.descriptionText}>
          {nftItem.description.substring(0, 100)}
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          Created By:{' '}
          <Text style={[styles.createdBy, styles.leftLink]}>
            OWNER <SmallPurpleArrow />
          </Text>
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          <LockIcon /> Unlockable Content:{' '}
          <Text style={[styles.createdBy, styles.leftLink]}>
            Go See <SmallPurpleArrow />
          </Text>
        </Text>
        <Line style={styles.line} />
        <Text style={styles.descriptionTitle}>
          ABOUT {nftItem.collection.name.toUpperCase()}
        </Text>
        <Text style={styles.descriptionText}>
          {nftItem.description.substring(0, 100)}
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          More Of:
          <Pressable onPress={() => Linking.openURL(nftItem.external_link)}>
            <Text style={[styles.createdBy, styles.leftLink, styles.link]}>
              {' '}
              {nftItem.collection.name} <SmallPurpleArrow />
            </Text>
          </Pressable>
        </Text>
      </Box>
    )
  }

  const renderDetailsToggle = () => {
    return (
      <Box>
        <Box flexDirection={'row'}>
          <Text style={[styles.descriptionText, styles.spaceBetween]}>
            ACCOUNT
          </Text>
          <Text style={(styles.descriptionText, styles.leftLink)}>
            {String(nftItem.asset_contract?.address).substr(0, 5) +
              '...' +
              String(nftItem.asset_contract?.address).substr(38, 4)}{' '}
            <SmallPurpleArrow />
          </Text>
        </Box>

        <Line style={styles.line} />
        <Box flexDirection={'row'}>
          <Text style={[styles.descriptionTitle, styles.spaceBetween]}>
            CONTRACT ADDRESS
          </Text>
          <Text style={(styles.descriptionText, styles.leftLink)}>
            {String(nftItem.asset_contract?.address).substr(0, 5) +
              '...' +
              String(nftItem.asset_contract?.address).substr(38, 4)}{' '}
            <SmallPurpleArrow />
          </Text>
        </Box>
        <Box flexDirection={'row'}>
          <Text style={[styles.descriptionTitle, styles.spaceBetween]}>
            TOKEN ID
          </Text>
          <Text style={(styles.descriptionTitle, styles.leftLink)}>
            {String(nftItem.asset_contract?.address).substr(0, 5) +
              '...' +
              String(nftItem.asset_contract?.address).substr(38, 4)}{' '}
            <SmallPurpleArrow />
          </Text>
        </Box>
        <Box flexDirection={'row'}>
          <Text style={[styles.descriptionTitle, styles.spaceBetween]}>
            TOKEN STANDARD
          </Text>
          <Text style={(styles.descriptionTitle, styles.leftLink)}>
            {String(nftItem.asset_contract?.address).substr(0, 5) +
              '...' +
              String(nftItem.asset_contract?.address).substr(38, 4)}{' '}
            <SmallPurpleArrow />
          </Text>
        </Box>
      </Box>
    )
  }
  return (
    <Box style={styles.drawerContainer}>
      <Text style={styles.collectionName}>{nftItem.collection.name}</Text>
      <Text style={styles.expandedTitle}>{nftItem.name}</Text>
      <NftTabBar
        leftTabText={'nft.tabBarOverview'}
        rightTabText={'nft.tabBarDetails'}
        setShowLeftTab={setShowOverview}
        showLeftTab={showOverview}
      />
      {showOverview ? renderOverviewToggle() : renderDetailsToggle()}
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { padding: 35 },

  collectionName: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 18,
    color: '#646F85',
  },

  createdBy: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 21,
    textTransform: 'capitalize',
    color: '#000000',
  },

  spaceBetween: {
    marginRight: '50%',
  },

  expandedTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 36,
    lineHeight: 49,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
  },
  line: {
    padding: 10,
  },

  descriptionTitle: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    marginTop: 10,
  },
  descriptionText: {
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 21,
    letterSpacing: 0.5,
    color: faceliftPalette.darkGrey,
    textTransform: 'capitalize',
  },
  leftLink: { color: palette.purplePrimary },
  link: { marginTop: 3 },
})

export default DetailsDrawerExpanded
