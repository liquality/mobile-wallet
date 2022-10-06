import { Linking, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts, AppIcons } from '../../assets'
import { Box, faceliftPalette, palette } from '../../theme'
import { Text } from '../text/text'
import NftTabBar from './nft-tab-bar'
import { NFTAsset } from '../../types'
import { useRecoilValue } from 'recoil'
import { accountInfoStateFamily, addressStateFamily } from '../../atoms'
import { labelTranslateFn } from '../../utils'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'

const { Line, SmallPurpleArrow, LockIcon } = AppIcons

type DetailsDrawerExpandedProps = {
  showOverview: boolean
  setShowOverview: (show: boolean) => void
  nftItem: NFTAsset
}

const DetailsDrawerExpanded: React.FC<DetailsDrawerExpandedProps> = (props) => {
  const { nftItem, showOverview, setShowOverview } = props
  const accountInfo = useRecoilValue(accountInfoStateFamily(nftItem.accountId))

  const addressForAccount = useRecoilValue(
    addressStateFamily(nftItem.accountId),
  ) as string

  const renderOverviewToggle = () => {
    return (
      <Box>
        <Text style={styles.descriptionTitle} tx="nft.description" />
        <Text style={styles.descriptionText}>
          {nftItem.description.substring(0, 100)}
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          {labelTranslateFn('nft.createdBy')}{' '}
          <Text style={[styles.createdBy, styles.leftLink]}>
            {labelTranslateFn('nft.creator')} <SmallPurpleArrow />
          </Text>
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          <LockIcon /> {labelTranslateFn('nft.unlockableContent')}{' '}
          <Text style={[styles.createdBy, styles.leftLink]}>
            {labelTranslateFn('nft.goSee')} <SmallPurpleArrow />
          </Text>
        </Text>
        <Line style={styles.line} />
        <Text style={styles.descriptionTitle}>
          {labelTranslateFn('nft.about')}{' '}
          {nftItem.collection.name.toUpperCase()}
        </Text>
        <Text style={styles.descriptionText}>
          {nftItem.description.substring(0, 100)}
        </Text>
        <Line style={styles.line} />
        <Text style={styles.createdBy}>
          {labelTranslateFn('nft.moreOf')}{' '}
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

  //TODO: Make these values dynamic reads from nftItem
  //but right now we dont have this NFT info from wallet-core and the providers
  const renderDetailsToggle = () => {
    return (
      <Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.account'}
          />
          <Text style={(styles.descriptionText, styles.leftLink)}>
            {shortenAddress(addressForAccount)}
            <SmallPurpleArrow />
          </Text>
        </Box>

        <Line style={styles.line} />
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text style={[styles.descriptionTitle, styles.flex]}>
            {labelTranslateFn('nft.contractAddress')}
          </Text>
          <Text style={(styles.descriptionText, styles.leftLink)}>
            {shortenAddress(nftItem.asset_contract?.address as string)}
            <SmallPurpleArrow />
          </Text>
        </Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.tokenId'}
          />

          <Text style={(styles.descriptionText, styles.leftLink)}>
            {nftItem.token_id}
          </Text>
        </Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.tokenStandard'}
          />

          <Text style={(styles.descriptionText, styles.leftLink, styles.flex)}>
            ERC-721
          </Text>
        </Box>
        <Line style={styles.line} />
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.blockchain'}
          />
          <Text style={(styles.descriptionText, styles.leftLink)}>
            {accountInfo.chain}
          </Text>
        </Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.metadata'}
          />
          <Text
            style={(styles.descriptionText, styles.leftLink, styles.flex)}
            tx={'nft.decentralized'}
          />
        </Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.creatorFee'}
          />

          <Text style={(styles.descriptionText, styles.leftLink, styles.flex)}>
            10%
          </Text>
        </Box>
        <Box marginVertical={'s'} flexDirection={'row'}>
          <Text
            style={[styles.descriptionTitle, styles.flex]}
            tx={'nft.itemActivity'}
          />

          <Text style={(styles.descriptionText, styles.leftLink)}>
            {labelTranslateFn('nft.explorer')} <SmallPurpleArrow />
          </Text>
        </Box>
      </Box>
    )
  }
  return (
    <Box>
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
    marginTop: 0,
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
  flex: { flex: 1 },
  leftLink: { color: palette.purplePrimary, flex: 1 },
  link: { marginTop: 3 },
})

export default DetailsDrawerExpanded
