import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import NftHeader from '../../../components/NFT/nft-header'
import { Box, palette } from '../../../theme'

import { RootStackParamList } from '../../../types'

type NftCollectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftCollectionScreen'
>

const dummyData = [
  {
    name: 'Shopee Supermarket',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  {
    name: 'RM15 Free Shipping',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  {
    name: '15% Cashback',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  { name: 'Live', uri: require('../../../assets/icons/nft_thumbnail.png') },
  {
    name: 'Shopee Food',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  {
    name: 'Shopee Pay',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  {
    name: 'Shop Malaysia',
    uri: require('../../../assets/icons/nft_thumbnail.png'),
  },
  { name: 'COD', uri: require('../../../assets/icons/nft_thumbnail.png') },
]

let bu = {
  accountId: 'f7dc7698-407d-463b-bd81-958e23a247d8',
  asset_contract: {
    address: '0xe42cad6fc883877a76a26a16ed92444ab177e306',
    external_link: 'https://consensys.net/merge',
    image_url:
      'https://i.seadn.io/gcs/files/6ae69eaefbf70905a975423ad9e16607.jpg?w=500&auto=format',
    name: 'TheMerge',
    symbol: 'MERGE',
  },
  collection: { name: 'The Merge: Regenesis' },
  description:
    "Regenesis is a collection of art NFTs celebrating the Ethereum Merge, a historic technological milestone and testament to the power of decentralized software development. This edition of the NFT collection illustrates an elaborately detailed world embodying the most important benefit of the Merge: sustainability. The art explores the scale and significance of the Merge, an ambitious re-architecture of the world's largest open programmable blockchain, which makes the network 2000x more energy efficient and positions Ethereum to sustainably support the next generation of Web3 creators and developers.",
  external_link: 'https://consensys.net/merge',
  id: 642879097,
  image_original_url:
    'https://opensea-private.mypinata.cloud/ipfs/Qma3dgNvmqabeVchAfG95KyESXCDojo4b1Fc8U5xiZ89hf',
  image_preview_url:
    'https://lh3.googleusercontent.com/VTjV3wixgJKaj39Ue741dEa6BUkKO9KB7sX2z6oXiZAD-h-syGztoBavJmIYM-OMKrJzSM3ODCmKo6mm99LarjuaFrSHysokWNRojuc=s250',
  image_thumbnail_url:
    'https://lh3.googleusercontent.com/VTjV3wixgJKaj39Ue741dEa6BUkKO9KB7sX2z6oXiZAD-h-syGztoBavJmIYM-OMKrJzSM3ODCmKo6mm99LarjuaFrSHysokWNRojuc=s128',
  name: 'TheMerge',
  starred: false,
  token_id: '33495',
}

let a = [
  {
    accountId: 'f7dc7698-407d-463b-bd81-958e23a247d8',
    asset_contract: {
      address: '0xe42cad6fc883877a76a26a16ed92444ab177e306',
      external_link: 'https://consensys.net/merge',
      image_url:
        'https://i.seadn.io/gcs/files/6ae69eaefbf70905a975423ad9e16607.jpg?w=500&auto=format',
      name: 'TheMerge',
      symbol: 'MERGE',
    },
    collection: { name: 'The Merge: Regenesis' },
    description:
      "Regenesis is a collection of art NFTs celebrating the Ethereum Merge, a historic technological milestone and testament to the power of decentralized software development. This edition of the NFT collection illustrates an elaborately detailed world embodying the most important benefit of the Merge: sustainability. The art explores the scale and significance of the Merge, an ambitious re-architecture of the world's largest open programmable blockchain, which makes the network 2000x more energy efficient and positions Ethereum to sustainably support the next generation of Web3 creators and developers.",
    external_link: 'https://consensys.net/merge',
    id: 642879097,
    image_original_url:
      'https://opensea-private.mypinata.cloud/ipfs/Qma3dgNvmqabeVchAfG95KyESXCDojo4b1Fc8U5xiZ89hf',
    image_preview_url:
      'https://lh3.googleusercontent.com/VTjV3wixgJKaj39Ue741dEa6BUkKO9KB7sX2z6oXiZAD-h-syGztoBavJmIYM-OMKrJzSM3ODCmKo6mm99LarjuaFrSHysokWNRojuc=s250',
    image_thumbnail_url:
      'https://lh3.googleusercontent.com/VTjV3wixgJKaj39Ue741dEa6BUkKO9KB7sX2z6oXiZAD-h-syGztoBavJmIYM-OMKrJzSM3ODCmKo6mm99LarjuaFrSHysokWNRojuc=s128',
    name: 'TheMerge',
    starred: false,
    token_id: '33495',
  },
]

const wallet = setupWallet({
  ...defaultOptions,
})
const NftCollectionScreen = ({
  navigation,
  route,
}: NftCollectionScreenProps) => {
  const { nftCollection, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)
  const [data, setData] = useState(dummyData)

  const { activeWalletId } = wallet.state

  console.log(nftCollection.length, 'NFTS????')

  const seeNftDetail = useCallback(
    (nftItem) => {
      console.log('SEE NFT DETAIL!!')
      navigation.navigate('NftDetailScreen', {
        screenTitle: 'NFT Detail',
        nftItem: nftItem,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  useEffect(() => {}, [])

  const renderCollectionGrid = () => {
    return (
      <SafeAreaView style={styles.flatListContainer}>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return (
              <View style={styles.inner}>
                <Image source={item.uri} style={styles.image} />
              </View>
            )
          }}
        />
      </SafeAreaView>
    )
  }

  console.log(nftCollection, 'codlec')
  return (
    <Box flex={1} style={styles.overviewBlock}>
      <ScrollView>
        <Box style={styles.headerContainer}>
          <NftHeader
            blackText={nftCollection[0].collection.name.toUpperCase()}
            greyText={`${nftCollection.length} NFTS`}
            width={Dimensions.get('screen').width}
            height={225}
          />
        </Box>
        {renderCollectionGrid()}
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {},

  tabText: {
    //fontFamily: 'Anek Kannada';
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 28,
    letterSpacing: 0.75,
    textTransform: 'capitalize',
    color: '#646F85',
  },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: palette.white,
  },

  headerContainer: {
    marginBottom: 20,
  },

  flatListContainer: {
    margin: 20,
  },

  pressable: { position: 'relative' },
  column: {
    margin: 20,
  },
  inner: {
    flexDirection: 'row',
    marginRight: 5,
    marginBottom: 5,
  },
  image: {
    width: Dimensions.get('screen').width / 2 - 20,
    height: Dimensions.get('screen').width / 2 - 20,
  },
})

export default NftCollectionScreen
