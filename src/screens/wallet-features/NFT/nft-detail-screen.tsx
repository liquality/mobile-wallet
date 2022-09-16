import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { Button, palette } from '../../../theme'

import { RootStackParamList } from '../../../types'

type ShowAllNftsScreenProps = NativeStackScreenProps<
  RootStackParamList,
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
      <Button
        type="primary"
        variant="l"
        label={'Send NFT'}
        isBorderless={false}
        isActive={true}
        onPress={navigateToSendNftScreen}
      />

      <Pressable onPress={navigateToSendNftScreen}>
        <Image
          /*   
          source={{
            uri: nftItem.image_thumbnail_url,
          }} 
                //Hardcoded icon for now since i'm waiting for this PR 
                (https://github.com/liquality/wallet-core/pull/166) to be merged so I dont have to handle
                different URLs and manipulating strings to https in frontend code
          */
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
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },
})

export default NftDetailScreen
