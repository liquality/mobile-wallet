import React from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Box, faceliftPalette, Pressable, Text } from '../theme'
import { Fonts, AppIcons } from '../assets'
import { NFTAsset } from '../types'
import { AccountId } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue } from 'recoil'
import { accountInfoStateFamily } from '../atoms'
import { labelTranslateFn } from '../utils'

type ReviewDrawerProps = {
  handlePressSend: () => void
  title: string
  nftItem?: NFTAsset[]
  destinationAddress: string
  accountId: AccountId
  setShowDrawer: (show: boolean) => void
}

const { BuyCryptoCloseLight } = AppIcons
const ReviewDrawer: React.FC<ReviewDrawerProps> = (props) => {
  const {
    handlePressSend,
    title,
    accountId,
    destinationAddress,
    setShowDrawer,
    nftItem,
  } = props
  const accountInfo = useRecoilValue(accountInfoStateFamily(accountId))

  const renderNftSendContent = () => {
    return (
      <Box style={styles.drawerContainer}>
        <Text style={(styles.text, styles.drawerTitle)}>{title}</Text>
        <Text style={(styles.text, styles.subheadingText)}>
          {labelTranslateFn('nft.speedFee')}
        </Text>
        <Box flexDirection={'row'}>
          <Text style={(styles.text, styles.subheadingInfo)}>
            {/* TODO: fetch dynamic gas estimations */}
            ~0.004325 ETH | $13.54
          </Text>
        </Box>
        <Text style={(styles.text, styles.subheadingText)}>
          {labelTranslateFn('nft.sendTo')}{' '}
        </Text>
        <Text style={(styles.text, styles.subheadingInfo)}>
          {accountInfo.chain}
        </Text>
        <Text
          style={(styles.text, styles.subheadingInfo)}
          paddingBottom={'xxl'}>
          {destinationAddress}
        </Text>

        <Box alignItems={'center'} paddingTop={'xl'}>
          <Pressable
            variant="solid"
            label={{ tx: 'nft.sendNft' }}
            onPress={handlePressSend}
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
    <Box style={styles.container}>
      <ScrollView style={styles.reviewContent}>
        <Box marginTop={'xl'} alignItems="flex-end" padding={'screenPadding'}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setShowDrawer(false)
            }}>
            <BuyCryptoCloseLight />
          </TouchableOpacity>
        </Box>
        <Box
          flex={1}
          backgroundColor="mainBackground"
          paddingHorizontal={'screenPadding'}
          paddingBottom={'xxl'}>
          {nftItem ? renderNftSendContent() : renderSwapReviewContent()}
        </Box>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: faceliftPalette.semiTransparentGrey,
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    zIndex: 100,
  },
  reviewContent: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('screen').width,
  },
  drawerContainer: { paddingHorizontal: 15, paddingVertical: 20 },

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
