import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
import {
  getAllEnabledAccounts,
  getNftsForAccount,
  updateNFTs,
} from '../../../store/store'
import { RootStackParamList } from '../../../types'
type ShowAllNftsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NftDetailScreen'
>
const wallet = setupWallet({
  ...defaultOptions,
})
const NftForSpecificChainScreen = ({ route }: ShowAllNftsScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state
  const [, setChainSpecificNfts] = useState({})
  const [iterableNftArray, setIterableNftArray] = useState([])
  const { currentAccount } = route.params

  useEffect(() => {
    async function fetchData() {
      const enabledAccountsToSendIn = await getAllEnabledAccounts()
      const accountIdsToSendIn = enabledAccountsToSendIn.map((account) => {
        return account.id
      })
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      let nfts = await getNftsForAccount(currentAccount.id)
      setChainSpecificNfts(nfts)
      //Manipulate NFT object to be iterable
      let wholeNftArr = Object.values(nfts).map((val) => {
        return val
      })
      setIterableNftArray(wholeNftArr)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

  const renderNftArray = () => {
    let rows = []
    if (iterableNftArray) {
      rows = iterableNftArray.map((nftItem, index) => {
        return (
          <View
            key={index}
            style={[styles.container, styles.fragmentContainer]}>
            <Text style={[styles.label, styles.headerLabel]}>NFT SCreen</Text>
            <Text>{nftItem[0].collection.name}</Text>
            <Text>{nftItem[0].description}</Text>

            <Image
              /*         source={{
            uri: nftItem[0].image_thumbnail_url,
          }} 
                //Hardcoded icon for now since i'm waiting for this PR 
                (https://github.com/liquality/wallet-core/pull/166) to be merged so I dont have to handle
                different URLs and manipulating strings to https in frontend code
          */
              source={require('../../../assets/icons/nft_thumbnail.png')}
              style={{ width: 150, height: 100 }}
            />
          </View>
        )
      })
    } else {
      return <Text>No data available</Text>
    }

    return rows
  }

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>
        Specific CHAIN NFT SCreen
      </Text>
      {renderNftArray()}
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

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },

  headerLabel: {
    marginVertical: 10,
  },
})

export default NftForSpecificChainScreen
