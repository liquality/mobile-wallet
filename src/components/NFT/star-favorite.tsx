import { Pressable, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { AppIcons } from '../../assets'
import { Box } from '../../theme'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'
import { toggleNFTStarred } from '../../store/store'
import { NFT } from '../../types'

const { Ellipse, Star, BlackStar } = AppIcons

type StarFavoriteProps = {
  activeWalletId: string
  nftAsset: NFT
}

const StarFavorite: React.FC<StarFavoriteProps> = (props) => {
  const { activeWalletId, nftAsset } = props
  const activeNetwork = useRecoilValue(networkState)
  const [, setShowStarred] = useState(false)

  const renderStarFavorite = () => {
    return (
      <Box
        style={styles.starContainer}
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => {
          e.stopPropagation()
        }}>
        <Pressable
          onPress={() => {
            toggleStarred()
          }}
          style={styles.ellipse}>
          <Ellipse style={styles.ellipse} />
          {nftAsset.starred ? (
            <BlackStar style={styles.star} />
          ) : (
            <Star style={styles.star} />
          )}
        </Pressable>
      </Box>
    )
  }

  const toggleStarred = useCallback(async () => {
    nftAsset.starred = !nftAsset.starred
    setShowStarred(!nftAsset.starred)
    const payload = {
      network: activeNetwork,
      walletId: activeWalletId,
      accountId: nftAsset.accountId,
      nft: nftAsset,
    }
    await toggleNFTStarred(payload)
  }, [activeNetwork, activeWalletId, nftAsset])
  return renderStarFavorite()
}

const styles = StyleSheet.create({
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
    left: 9,
    top: 9,
  },
  starContainer: { position: 'absolute' },
})

export default StarFavorite
