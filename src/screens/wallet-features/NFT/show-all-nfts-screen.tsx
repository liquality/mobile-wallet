import { setupWallet } from '@liquality/wallet-core'
import { Account } from '@liquality/wallet-core/dist/src/store/types'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback, useState } from 'react'
import { StyleSheet, ScrollView, Dimensions } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Fonts } from '../../../assets'
import { networkState } from '../../../atoms'
import NftHeader from '../../../components/NFT/nft-header'
import NftImageView from '../../../components/NFT/nft-image-view'
import NoNfts from '../../../components/NFT/no-nfts'
import NftTabBar from '../../../components/NFT/nft-tab-bar'
import {
  allNfts,
  getAllEnabledAccounts,
  updateNFTs,
} from '../../../store/store'
import { Box, palette } from '../../../theme'
import { RootTabParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'
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
      //ÄNDRA HÄR
      //let allNfts = await fetchAllNfts()
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

  const calculateNrOfAccsWithNfts = async (accountsData: Account[]) => {
    return accountsData.filter(
      (account: Account) => account.nfts && account.nfts.length > 0,
    ).length
  }

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <ScrollView>
        <Box>
          <NftHeader
            blackText={`${numberOfNfts} ${labelTranslateFn('nft.nfts')}`}
            greyText={`${numberOfAccountsWithNfts}  ${labelTranslateFn(
              'nft.accounts',
            )}`}
            width={Dimensions.get('screen').width}
            height={225}
          />
        </Box>
        {iterableNftArray.length === 0 ? (
          <NoNfts />
        ) : (
          <Box margin={'m'}>
            <NftTabBar
              leftTabText={'nft.tabBarNfts'}
              rightTabText={'nft.tabBarActivity'}
              setShowLeftTab={setShowNfts}
              showLeftTab={showNfts}
            />
            {showNfts ? (
              <NftImageView
                showAllNftsScreen={true}
                accountIdsToSendIn={accountIdsToSendIn}
                iterableNftArray={iterableNftArray}
                seeNftDetail={seeNftDetail}
                activeWalletId={activeWalletId}
              />
            ) : null}
          </Box>
        )}
      </ScrollView>
    </Box>
  )
}
const styles = StyleSheet.create({
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
    backgroundColor: palette.white,
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
