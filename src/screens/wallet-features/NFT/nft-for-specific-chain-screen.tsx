import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Dimensions } from 'react-native'
import { useRecoilValue } from 'recoil'
import { accountInfoStateFamily, networkState } from '../../../atoms'
import NftHeader from '../../../components/NFT/nft-header'
import NftImageView from '../../../components/NFT/nft-image-view'
import NftTabBar from '../../../components/NFT/nft-tab-bar'
import {
  allNfts,
  getAllEnabledAccounts,
  updateNFTs,
} from '../../../store/store'
import { Box, palette } from '../../../theme'
import { RootStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'
type ShowAllNftsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftForSpecificChainScreen'
>
const wallet = setupWallet({
  ...defaultOptions,
})
//TODO: This screen is not fully implemented
const NftForSpecificChainScreen = ({
  navigation,
  route,
}: ShowAllNftsScreenProps) => {
  const { currentAccount } = route.params

  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [, setChainSpecificNfts] = useState({})
  const [iterableNftArray, setIterableNftArray] = useState([])
  const [accountIdsToSendIn, setAccountIdsToSendIn] = useState<string[]>([])
  const [showNfts, setShowNfts] = useState(true)
  const accountInfo = useRecoilValue(accountInfoStateFamily(currentAccount))
  const [numberOfNfts, setNumberOfNfts] = useState<number>(0)

  console.log(accountInfo, 'acc infooo')

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
      //ÄNDRA HÄR OXÅ
      //let nfts = await getNftsForAccount(currentAccount.id)
      setChainSpecificNfts(allNfts)
      //Manipulate NFT object to be iterable
      let wholeNftArr = Object.values(allNfts).map((val) => {
        return val
      })
      setIterableNftArray(wholeNftArr)
      let totalAmountOfNfts = Object.values(allNfts).reduce(
        (acc, nft) => acc + nft.length,
        0,
      )
      setNumberOfNfts(totalAmountOfNfts as number)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

  const seeNftDetail = useCallback(
    (nftItem) => {
      navigation.navigate('NftDetailScreen', {
        screenTitle: 'NFT Detail',
        nftItem,
        accountIdsToSendIn,
      })
    },
    [navigation, accountIdsToSendIn],
  )

  return (
    <Box flex={1} style={styles.overviewBlock}>
      <ScrollView>
        <Box>
          <NftHeader
            blackText={`${
              accountInfo.chain?.toUpperCase()
                ? accountInfo.chain?.toUpperCase()
                : 'ETHEREUM'
            }  `}
            greyText={`${numberOfNfts} ${labelTranslateFn('nft.nfts')}`}
            width={Dimensions.get('screen').width}
            height={225}
          />
        </Box>

        <Box margin={'m'}>
          <NftTabBar
            leftTabText={'nft.tabBarNfts'}
            rightTabText={'nft.tabBarActivity'}
            setShowLeftTab={setShowNfts}
            showLeftTab={showNfts}
          />
          {showNfts ? (
            <NftImageView
              showAllNftsScreen={false}
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
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    backgroundColor: palette.white,
  },
})

export default NftForSpecificChainScreen
