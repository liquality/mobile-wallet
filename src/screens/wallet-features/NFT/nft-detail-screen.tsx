import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'

import { RootTabParamList } from '../../../types'
type ShowAllNftsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'NftDetailScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const NftDetailScreen = ({ navigation, route }: ShowAllNftsScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)

  const { activeWalletId } = wallet.state

  useEffect(() => {
    async function fetchData() {}
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

  const navigateToSendNftScreen = useCallback(() => {
    navigation.navigate('NftSendScreen', {
      nftItem: nftItem,
      accountIdsToSendIn: accountIdsToSendIn,
    })
  }, [accountIdsToSendIn, navigation, nftItem])

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text>NFT DETAIL SCREEN</Text>
      <Pressable onPress={() => navigateToSendNftScreen()}>
        <Text>SEND NFT</Text>
        <Image
          /*   source={{
                  uri: nftItem.image_thumbnail_url,
                }} */
          source={require('../../../assets/icons/nft_thumbnail.png')}
          style={{ width: 150, height: 100 }}
        />
      </Pressable>
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
})

export default NftDetailScreen
