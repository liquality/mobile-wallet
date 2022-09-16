import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback, useState } from 'react'
import { Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Fonts } from '../../../assets'
import { networkState } from '../../../atoms'
import { getAllEnabledAccounts, updateNFTs } from '../../../store/store'
import { Box, palette } from '../../../theme'
import { RootTabParamList } from '../../../types'
type ShowAllNftsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'ShowAllNftsScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const ShowAllNftsScreen = ({ navigation }: ShowAllNftsScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)
  const [, setAllNftData] = useState({})
  const [iterableNftArray, setIterableNftArray] = useState([])
  const [accountIdsToSendIn, setAccountIdsToSendIn] = useState<string[]>([])

  const { activeWalletId } = wallet.state

  const fetchAllNfts = async () => {
    return wallet.getters.allNftCollections
  }

  useEffect(() => {
    async function fetchData() {
      const enabledAccountsToSendIn = await getAllEnabledAccounts()
      const accIds = enabledAccountsToSendIn.map((account) => {
        return account.id
      })
      setAccountIdsToSendIn(accIds)
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      let allNfts = await fetchAllNfts()
      setAllNftData(allNfts)
      let wholeNftArr = Object.values(allNfts).map((val) => {
        return val
      })
      setIterableNftArray(wholeNftArr)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWalletId, activeNetwork])

  const seeNftDetail = useCallback(
    (nftItem) => {
      navigation.navigate('NftDetailScreen', {
        screenTitle: 'NFT Detail',
        nftItem: nftItem,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray.length !== 0) {
      rows = iterableNftArray.map((nftItem, index) => {
        return (
          <ScrollView key={index} horizontal={true}>
            <Box
              flex={0.1}
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="s">
              <Text>{nftItem[0].collection.name}</Text>

              <Pressable onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  /*          source={{
            uri: nftItem[0].image_thumbnail_url,
          }} 
                //Hardcoded icon for now since i'm waiting for this PR 
                (https://github.com/liquality/wallet-core/pull/166) to be merged so I dont have to handle
                different URLs and manipulating strings to https in frontend code
          */
                  source={require('../../../assets/icons/nft_thumbnail.png')}
                  style={{ width: 150, height: 100 }}
                />
              </Pressable>
            </Box>
          </ScrollView>
        )
      })
    } else {
      return <Text>No NFTs to show</Text>
    }

    return rows
  }

  return (
    <Box style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>NFT SCreen</Text>

      {renderNftArray()}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },

  label: {
    fontFamily: Fonts.Regular,
    fontWeight: '700',
    fontSize: 12,
  },

  headerLabel: {
    marginVertical: 10,
  },
})

export default ShowAllNftsScreen
