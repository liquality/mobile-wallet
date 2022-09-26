import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback, useState } from 'react'
import {
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import NftHeader from '../../../components/NFT/nft-header'
import NftImageView from '../../../components/NFT/nft-image-view'
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
  const [showNfts, setShowNfts] = useState<boolean>(true)

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
        accountIds: accIds,
      })
      let allNfts = await fetchAllNfts()
      setAllNftData(allNfts)
      let wholeNftArr = Object.values(allNfts).map((val) => {
        return val
      })
      setIterableNftArray(wholeNftArr)
    }
    fetchData()
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

  const renderTabBar = () => {
    return (
      <Box flex="1" flexDirection="row">
        <Pressable
          style={[styles.tabText, showNfts && styles.tabBarFocused]}
          onPress={() => setShowNfts(!showNfts)}>
          <Text style={[styles.tabText, showNfts && styles.headerTextFocused]}>
            Nfts
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabText, !showNfts && styles.tabBarFocused]}
          onPress={() => setShowNfts(!showNfts)}>
          <Text style={[styles.tabText]}>Activity</Text>
        </Pressable>
      </Box>
    )
  }

  return (
    <Box flex={1}>
      <ScrollView>
        <Box style={styles.overviewBlock}>
          <NftHeader
            width={Dimensions.get('screen').width}
            height={225}></NftHeader>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
        <Box styles={styles.container}>
          {renderTabBar()}
          {showNfts ? (
            <NftImageView
              iterableNftArray={iterableNftArray}
              seeNftDetail={seeNftDetail}
            />
          ) : null}
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

export default ShowAllNftsScreen
