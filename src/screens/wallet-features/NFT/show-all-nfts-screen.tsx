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
import { Fonts } from '../../../assets'
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
  const [numberOfAccountsWithNfts, setNumberOfAccountsWithNfts] =
    useState<number>(0)
  const [numberOfNfts, setNumberOfNfts] = useState<number>(0)

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

      //Set nr of accounts with nfts
      let numberOfNftsInAccs = await calculateNrOfAccsWithNfts(
        enabledAccountsToSendIn,
      )
      setNumberOfAccountsWithNfts(numberOfNftsInAccs)
      let totalAmountOfNfts = Object.values(allNfts).reduce(
        (acc, nft) => acc + nft.length,
        0,
      )
      setNumberOfNfts(totalAmountOfNfts)
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

  const calculateNrOfAccsWithNfts = async (accountsData) => {
    return accountsData.filter(
      (account) => account.nfts && account.nfts.length > 0,
    ).length
  }

  const renderTabBar = () => {
    return (
      <Box flex="1" flexDirection="row" padding={'m'}>
        <Box marginRight={'l'}>
          <Pressable
            style={[styles.tabText, showNfts && styles.tabBarFocused]}
            onPress={() => setShowNfts(!showNfts)}>
            <Text
              style={[styles.tabText, showNfts && styles.headerTextFocused]}>
              Nfts
            </Text>
          </Pressable>
        </Box>
        <Pressable
          style={[styles.tabText, !showNfts && styles.tabBarFocused]}
          onPress={() => setShowNfts(!showNfts)}>
          <Text style={[styles.tabText]}>Activity</Text>
        </Pressable>
      </Box>
    )
  }

  console.log(numberOfAccountsWithNfts, 'NR OF ACCS')
  return (
    <Box flex={1}>
      <ScrollView>
        <Box style={styles.overviewBlock}>
          <NftHeader
            blackText={`${numberOfNfts} NFTS`}
            greyText={`${numberOfAccountsWithNfts} ACCOUNTS`}
            width={Dimensions.get('screen').width}
            height={225}></NftHeader>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
        <Box styles={styles.container} margin={'m'}>
          {renderTabBar()}
          {showNfts ? (
            <NftImageView
              accountIdsToSendIn={accountIdsToSendIn}
              iterableNftArray={iterableNftArray}
              seeNftDetail={seeNftDetail}
              activeWalletId={activeWalletId}
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
    fontFamily: Fonts.Regular,
    fontStyle: 'normal',
    fontWeight: '400',
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
  },

  tabBarFocused: {
    borderBottomStyle: 'inset',
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
