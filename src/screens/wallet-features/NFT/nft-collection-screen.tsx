import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback } from 'react'
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

const wallet = setupWallet({
  ...defaultOptions,
})
const NftCollectionScreen = ({
  navigation,
  route,
}: NftCollectionScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)

  const { nftCollection, accountIdsToSendIn } = route.params
  const { activeWalletId } = wallet.state

  const seeNftDetail = useCallback(
    (nftItem, e) => {
      //e.preventDefault()
      console.log('SEE NFT DETAIL!!')
      navigation.navigate('NftDetailScreen', {
        screenTitle: 'NFT Detail',
        nftItem: nftItem,
        accountIdsToSendIn: accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  console.log(nftCollection, 'collection parmas')
  useEffect(() => {}, [])

  const renderCollectionGrid = () => {
    let rows = []
    if (nftCollection) {
      rows = nftCollection.map((nftItem, index) => {
        console.log(nftItem, 'nftitem')
        return (
          <Box key={index} style={{}}>
            <Pressable
              style={styles.pressable}
              onPress={() => seeNftDetail(nftItem)}>
              <Image
                source={{
                  uri: nftItem.image_thumbnail_url,
                }}
                style={{
                  width: Dimensions.get('screen').width / 3,
                  height: Dimensions.get('screen').width / 3,
                }}
              />
            </Pressable>
          </Box>
        )
      })
    } else {
      return <Text>No data available</Text>
    }

    return rows
  }

  const renderFlatList = () => {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={nftCollection}
          renderItem={renderCollectionGrid}
          numColumns={2}
          /*  keyExtractor={(item) => item.id}
          extraData={selectedId} */
        />
      </SafeAreaView>
    )
  }

  return (
    <Box flex={1}>
      <ScrollView>
        <Box style={styles.overviewBlock}>
          <NftHeader
            blackText={'collection name'}
            greyText={'x nfts in this collec'}
            width={Dimensions.get('screen').width}
            height={225}></NftHeader>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
        {renderFlatList()}
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
    paddingVertical: 10,
  },

  tabBarFocused: {
    borderBottomWidth: 2,
    lineHeight: '1em',

    color: palette.purplePrimary,
    borderBottomColor: palette.purplePrimary,
  },

  headerTextFocused: {
    color: palette.black2,
  },
  pressable: { position: 'relative' },
})

export default NftCollectionScreen
