import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useCallback, useState } from 'react'
import {
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import { Box, Button, palette } from '../../../theme'
import BottomDrawer from 'react-native-bottom-drawer-view'
import { RootStackParamList } from '../../../types'

type NftDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>

const wallet = setupWallet({
  ...defaultOptions,
})
const NftDetailScreen = ({ navigation, route }: NftDetailScreenProps) => {
  const { nftItem, accountIdsToSendIn } = route.params
  const activeNetwork = useRecoilValue(networkState)

  const [imgError, setImgError] = useState<boolean>(false)

  const checkImgUrlExists = (imgUrl: string) => {
    return !imgError && imgUrl
      ? { uri: imgUrl }
      : require('../../../assets/icons/nft_thumbnail.png')
  }

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

  const renderContent = () => {
    return (
      <Box style={styles.drawerContainer}>
        <Text style={styles.drawerClosedText}>
          {nftItem.name} #{nftItem?.token_id}
        </Text>
      </Box>
    )
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <Box style={styles.headerContainer}>
        <Image
          source={checkImgUrlExists(nftItem.image_original_url)}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      </Box>
      <BottomDrawer
        containerHeight={300}
        offset={120}
        startUp={false}
        roundedEdges={false}
        backgroundColor={'rgba(255, 255, 255, 0.77)'}>
        {renderContent()}
        <Button
          type="primary"
          variant="l"
          label={'Send NFT'}
          isBorderless={false}
          isActive={true}
          onPress={navigateToSendNftScreen}
        />
        <ScrollView horizontal={true}>
          <TouchableOpacity>
            <Box style={styles.drawerContainer} />
          </TouchableOpacity>
        </ScrollView>
      </BottomDrawer>
    </Box>
  )
}

const styles = StyleSheet.create({
  drawerContainer: { padding: 35 },

  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: palette.white,
  },

  headerContainer: {
    marginBottom: 20,
  },

  image: {
    width: Dimensions.get('screen').width,
    resizeMode: 'contain',
    aspectRatio: 1,
  },

  drawerClosedText: {
    fontFamily: 'Anek Kannada',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,

    letterSpacing: 0.5,

    color: '#000000',
  },
})

export default NftDetailScreen
