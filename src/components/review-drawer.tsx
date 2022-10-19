import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Box, faceliftPalette, Pressable, Text } from '../theme'
import { Fonts, AppIcons } from '../assets'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { NFTAsset } from '../types'
import { AccountId } from '@liquality/wallet-core/dist/src/store/types'
import { useRecoilValue } from 'recoil'
import { accountInfoStateFamily } from '../atoms'
type ReviewDrawerProps = {
  handlePressSend: () => void
  height: number
  title: string
  nftItem?: NFTAsset[]
  accountIdsToSendIn?: string[]
  destinationAddress: string
  accountId: AccountId
  showDrawer: (show: boolean) => void
}

const { XIcon } = AppIcons
const ReviewDrawer: React.FC<ReviewDrawerProps> = (props) => {
  const {
    handlePressSend,
    nftItem,
    height,
    title,
    accountId,
    destinationAddress,
    showDrawer,
  } = props

  const accountInfo = useRecoilValue(accountInfoStateFamily(accountId))

  const renderNftSendContent = () => {
    return (
      <Box style={styles.drawerContainer}>
        {/* TODO: Fix the styling of this */}
        <TouchableOpacity
          onPress={() => {
            showDrawer(false)
          }}>
          <XIcon width={20} height={20} />
        </TouchableOpacity>
        <Text style={(styles.text, styles.drawerTitle)}>{title}</Text>
        <Text style={(styles.text, styles.subheadingText)}>
          Network/Speed Fee
        </Text>
        <Box flexDirection={'row'}>
          <Text style={(styles.text, styles.subheadingInfo)}>
            {/* TODO: fetch dynamic gas estimations */}
            ~0.004325 ETH | $13.54
          </Text>
        </Box>
        <Text style={(styles.text, styles.subheadingText)}>Send To</Text>
        <Text style={(styles.text, styles.subheadingInfo)}>
          {accountInfo.chain}
        </Text>
        <Text style={(styles.text, styles.subheadingInfo)}>
          {destinationAddress}
        </Text>

        <Box alignItems={'center'} paddingTop={'xl'}>
          <Pressable variant="solid" label={'Send'} onPress={handlePressSend} />
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
        offset={0}
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
