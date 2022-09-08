import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { useRecoilValue } from 'recoil'
import {
  accountListState,
  accountsIdsState,
  networkState,
} from '../../../atoms'
import { updateNFTs } from '../../../store/store'
import { RootTabParamList } from '../../../types'
type ShowAllNFTsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'ShowAllNFTsScreen'
>
const wallet = setupWallet({
  ...defaultOptions,
})
const ShowAllNFTsScreen = ({ route }: ShowAllNFTsScreenProps) => {
  const activeNetwork = useRecoilValue(networkState)
  const [allNftData, setAllNftData] = useState({})
  const { activeWalletId } = wallet.state
  const enabledAccountsToSendIn = wallet.getters.accountsData
  const accountIdsToSendIn = enabledAccountsToSendIn.map((account) => {
    return account.id
  })

  const fetchAllNfts = async () => {
    console.log(wallet.getters.allNftCollections, 'all NFT collections')
    return wallet.getters.allNftCollections
  }

  useEffect(() => {
    async function fetchData() {
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      let allNfts = await fetchAllNfts()
      setAllNftData(allNfts)
    }
    fetchData()
  }, [activeNetwork, activeWalletId])

  if (allNftData.Bogdanoffs) {
    var tokenUri = allNftData.Bogdanoffs[0].image_thumbnail_url
    var newImgUrl = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
    var nftName = allNftData.Bogdanoffs[0].name
    var nftDescription = allNftData.Bogdanoffs[0].description
  }

  let hej = [
    {
      accountId: '7afb3501-68cd-441c-a305-7b7e0ff35720',
      amount: '1',
      asset_contract: {
        address: '0x726d6715f7de6a472c667bf45a918b1557c1afbc',
        name: 'Bogdanoffs',
        symbol: 'Boggy',
      },
      collection: { name: 'Bogdanoffs' },
      description:
        'Igor Youriévitch Bogdanoff (French pronunciation: ​[iɡɔʁ juʁi.evitʃ bɔɡdanɔf]; 29 August 1949 – 3 January 2022) and Grégoire "Grichka" Youriévitch Bogdanoff (French: [ɡʁeɡwaʁ ɡʁiʃka]; 29 August 1949 – 28 December 2021) were French twin television presenters,[1] producers, and essayists who, from the 1970s on, presented various subjects in science fiction, popular science, and cosmology. They were involved in a number of controversies, most notably the Bogdanov affair, in which the brothers were alleged to have written nonsensical advanced physics papers that were nonetheless published in reputable scientific journals.',
      external_link: undefined,
      image_original_url:
        'ipfs://QmcrHhNhwXDwqJAyYuQdwb65MdVuZ88kjvycXyxoZhobzg',
      image_preview_url:
        'ipfs://QmcrHhNhwXDwqJAyYuQdwb65MdVuZ88kjvycXyxoZhobzg',
      image_thumbnail_url:
        'ipfs://QmcrHhNhwXDwqJAyYuQdwb65MdVuZ88kjvycXyxoZhobzg',
      name: 'Bogdanoff #68',
      standard: 'ERC721',
      starred: false,
      token_id: '68',
    },
  ]

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>NFT SCreen</Text>
      <Text>{nftName}</Text>
      <Text>{nftDescription}</Text>

      <Image
        source={{
          uri: newImgUrl,
        }}
        style={{ width: 150, height: 100 }}
      />
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
  checkmark: {
    width: 102,
    height: 102,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col: {
    paddingLeft: 5,
    borderColor: '#d9dfe5',
    borderWidth: 1,
    width: '33%',
  },
  middleCol: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    width: '33%',
  },

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },

  headerLabel: {
    marginVertical: 10,
  },
  preset: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 18,
  },
  speed: {
    textTransform: 'capitalize',
  },
  fiat: {
    fontSize: 12,
    marginTop: 5,
  },
  fiatFast: {
    color: '#088513',
  },
  fiatSlow: {
    color: '#ff007a',
  },
  amount: {
    fontSize: 16,
  },
  selected: {
    backgroundColor: '#F0F7F9',
  },
})

export default ShowAllNFTsScreen
