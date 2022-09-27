import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { Button, palette } from '../../../theme'

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

  console.log(route.params, 'paramoos')
  const { activeWalletId } = wallet.state

  useEffect(() => {}, [])

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text>COLLECTION SCREEN</Text>
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

export default NftCollectionScreen
