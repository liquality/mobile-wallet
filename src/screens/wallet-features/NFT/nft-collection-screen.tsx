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
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import NftHeader from '../../../components/NFT/nft-header'
import { Box, Button, palette } from '../../../theme'

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

  const { activeWalletId } = wallet.state

  console.log(route.params, 'collection parmas')
  useEffect(() => {}, [])

  return (
    <Box flex={1}>
      <ScrollView>
        <Box style={styles.overviewBlock}>
          <NftHeader
            screenType={'collection'}
            width={Dimensions.get('screen').width}
            height={225}></NftHeader>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
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
})

export default NftCollectionScreen
