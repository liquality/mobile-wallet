import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Fonts, AppIcons } from '../../assets'
import { Box, Card, faceliftPalette, Text } from '../../theme'
import { GRADIENT_BACKGROUND_HEIGHT } from '../../utils'
import { scale } from 'react-native-size-matters'
import AssetIcon from '../asset-icon'
import { AccountType } from '../../types'
import { addressStateFamily } from '../../atoms'
import { useRecoilValue } from 'recoil'
import { shortenAddress } from '@liquality/wallet-core/dist/src/utils/address'
const adjustLineHeight = -scale(30)

const { Eye, Refresh, NftChain } = AppIcons

type NftHeaderProps = {
  blackText: string
  greyText: string
  handleRefreshNftsPress: () => Promise<void>
  accountInfo: AccountType
  isSpecificChain?: boolean
}

const NftHeader: React.FC<NftHeaderProps> = (props) => {
  const {
    isSpecificChain,
    accountInfo,
    handleRefreshNftsPress,
    blackText,
    greyText,
  } = props

  const addressForAccount = useRecoilValue(addressStateFamily(accountInfo?.id))

  const renderAllNftsHeaderText = () => {
    return (
      <Card
        variant={'headerCard'}
        height={GRADIENT_BACKGROUND_HEIGHT}
        paddingHorizontal="xl">
        <Box
          style={styles.eyebrowContainer}
          flex={0.65}
          justifyContent="center">
          {isSpecificChain ? (
            <Box marginBottom={'xl'} flexDirection={'row'}>
              <AssetIcon chain={accountInfo.chain} />
              <NftChain style={styles.nftChainOverlap} />

              <Text style={styles.addressText}>
                {shortenAddress(addressForAccount)}{' '}
              </Text>
              <Eye style={styles.eye} />
            </Box>
          ) : null}

          <Text color={'darkGrey'} variant="totalAsset">
            {blackText}
          </Text>

          <Box style={styles.textContainer}>
            <Text
              style={{ marginTop: adjustLineHeight }}
              variant="totalAsset"
              color={'nestedColor'}>
              {greyText}
            </Text>
            {isSpecificChain ? (
              <Pressable
                onPress={handleRefreshNftsPress}
                style={styles.refreshBtn}>
                <Refresh />
              </Pressable>
            ) : null}
          </Box>
        </Box>
      </Card>
    )
  }
  return renderAllNftsHeaderText()
}

const styles = StyleSheet.create({
  refreshBtn: {
    width: 37,
    height: 37,
    backgroundColor: faceliftPalette.mediumWhite,
    marginBottom: 10,
    position: 'relative',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: { marginTop: 10 },
  nftChainOverlap: { zIndex: 100, right: 10 },
  addressText: {
    fontFamily: Fonts.JetBrainsMono,
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    marginTop: 7,

    color: faceliftPalette.greyMeta,
  },

  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },

  eyebrowContainer: {
    marginTop: scale(80),
    display: 'flex',
    justifyContent: 'space-between',
  },
})

export default NftHeader
