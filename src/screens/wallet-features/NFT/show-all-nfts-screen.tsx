import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { updateNFTs } from '../../../store/store'
import Box from '../../../theme/box'
import { RootTabParamList } from '../../../types'
type ShowAllNftsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'ShowAllNftsScreen'
>

/* const hardCodedNftList = {
  'Neon District Season One Item': [
    {
      asset_contract: {
        address: '0x7227e371540cf7b8e512544ba6871472031f3335',
        name: 'Neon District Season One Item',
        symbol: 'NDITEM1',
      },
      collection: {
        name: 'Neon District Season One Item',
      },
      token_id: '158456337646102184554375542858',
      amount: '1',
      standard: 'ERC721',
      name: 'Factor Fabricator: Paragon',
      description:
        'Armor found within Neon District.\n\nA Neon District: Season One game item, playable on https://portal.neondistrict.io.\n\nNeon District is a free-to-play cyberpunk role-playing game. Collect characters and gear, craft and level up teams, and battle against other players through competitive multiplayer and in turn-based combat.',
      image_original_url:
        'https://neon-district-season-one.s3.amazonaws.com/images/factorfabricatorp-uncommon-arms-female-thumb.png',
      image_preview_url:
        'https://neon-district-season-one.s3.amazonaws.com/images/factorfabricatorp-uncommon-arms-female-thumb.png',
      image_thumbnail_url:
        'https://neon-district-season-one.s3.amazonaws.com/images/factorfabricatorp-uncommon-arms-female-thumb.png',
      external_link:
        'https://portal.neondistrict.io/asset/158456337646102184554375542858',
      starred: false,
      accountId: '9a44ded7-b621-486f-9e07-d722c5b2e60b',
    },
  ],
  'Sunflower Land': [
    {
      asset_contract: {
        address: '0x2b4a66557a79263275826ad31a4cddc2789334bd',
        name: 'Sunflower Land',
        symbol: 'SL',
      },
      collection: {
        name: 'Sunflower Land',
      },
      token_id: '95834',
      amount: '1',
      standard: 'ERC721',
      name: 'Sunflower Land #95834',
      description:
        'A new farm at Sunflower Land. It is still being verified and not recommended to buy as it may be blacklisted.',
      image_original_url:
        'https://sunflower-land.com/testnet/farms/verifying.png',
      image_preview_url:
        'https://sunflower-land.com/testnet/farms/verifying.png',
      image_thumbnail_url:
        'https://sunflower-land.com/testnet/farms/verifying.png',
      external_link: 'https://sunflower-land.com/play/?farmId=95834',
      starred: false,
      accountId: '9a44ded7-b621-486f-9e07-d722c5b2e60b',
    },
  ],
  'Galaxy OAT': [
    {
      asset_contract: {
        address: '0x1871464f087db27823cff66aa88599aa4815ae95',
        name: 'Galaxy OAT',
        symbol: 'OAT',
      },
      collection: {
        name: 'Galaxy OAT',
      },
      token_id: '824888',
      amount: '1',
      standard: 'ERC721',
      starred: false,
      accountId: '9a44ded7-b621-486f-9e07-d722c5b2e60b',
    },
  ],
} */
const wallet = setupWallet({
  ...defaultOptions,
})
const ShowAllNftsScreen = ({ navigation, route }: ShowAllNftsScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)
  const [allNftData, setAllNftData] = useState({})
  const [iterableNftArray, setIterableNftArray] = useState([])

  const { activeWalletId } = wallet.state
  const enabledAccountsToSendIn = wallet.getters.accountsData
  const accountIdsToSendIn = enabledAccountsToSendIn.map((account) => {
    return account.id
  })

  const fetchAllNfts = async () => {
    return wallet.getters.allNftCollections
  }

  useEffect(() => {
    async function fetchData() {
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      let allNfts = await fetchAllNfts()
      setAllNftData(allNfts)
      //Manipulate NFT object to be iterable
      let wholeNftArr = Object.values(allNftData).map((val) => {
        return val
      })
      setIterableNftArray(wholeNftArr)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNftData, activeNetwork, activeWalletId])

  const seeNftDetail = useCallback(
    (nftItem) => {
      console.log(nftItem, 'NFT ITEEEEM')
      navigation.navigate('NftDetailScreen', {
        nftItem: nftItem,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation],
  )

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray) {
      rows = iterableNftArray.map((nftItem, index) => {
        return (
          <ScrollView key={index} horizontal={true}>
            <Box
              flex={0.1}
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="s">
              <Text>{nftItem[0].collection.name}</Text>
              {/*               <Text>{nftItem[0].description}</Text>
               */}
              <Pressable onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  /*   source={{
                  uri: nftItem[0].image_thumbnail_url,
                }} */
                  source={require('../../../assets/icons/nft_thumbnail.png')}
                  style={{ width: 150, height: 100 }}
                />
              </Pressable>
            </Box>
          </ScrollView>
        )
      })
    } else {
      return <Text>No data available</Text>
    }

    return rows
  }

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>NFT SCreen</Text>

      {renderNftArray()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },

  headerLabel: {
    marginVertical: 10,
  },
})

export default ShowAllNftsScreen
