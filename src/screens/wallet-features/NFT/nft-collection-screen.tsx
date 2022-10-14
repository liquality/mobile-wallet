import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback } from 'react'
import {
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native'
import NftHeader from '../../../components/NFT/nft-header'
import StarFavorite from '../../../components/NFT/star-favorite'
import { Box, palette } from '../../../theme'

import { RootStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'

type NftCollectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftCollectionScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const NftCollectionScreen = ({
  navigation,
  route,
}: NftCollectionScreenProps) => {
  const { nftCollection, accountIdsToSendIn } = route.params
  const { activeWalletId } = wallet.state

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

  const renderCollectionGrid = () => {
    return (
      <SafeAreaView style={styles.flatListContainer}>
        <FlatList
          data={nftCollection}
          numColumns={2}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return (
              <Box style={styles.inner}>
                <Pressable onPress={() => seeNftDetail(item)}>
                  <Image
                    source={{
                      uri: item.image_original_url,
                    }}
                    style={styles.image}
                  />
                </Pressable>
                <StarFavorite nftAsset={item} activeWalletId={activeWalletId} />
              </Box>
            )
          }}
        />
      </SafeAreaView>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <ScrollView>
        <Box style={styles.headerContainer}>
          <NftHeader
            blackText={checkIfCollectionNameExists(
              nftCollection.collection.name,
            ).toUpperCase()}
            greyText={`${nftCollection.length} ${labelTranslateFn('nft.nfts')}`}
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
