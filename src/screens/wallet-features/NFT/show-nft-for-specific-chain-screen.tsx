import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
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
const ShowNFTForSpecificChainScreen = ({ route }: ShowAllNFTsScreenProps) => {
  const accountIds = useRecoilValue(accountsIdsState)
  const activeNetwork = useRecoilValue(networkState)
  const accounts = useRecoilValue(accountListState)
  const { activeWalletId } = wallet.state
  console.log(accounts, 'FULL STATE ACCOUNTS')
  const accountIdsToSendIn = accounts.map((account) => {
    return account.id
  })

  const fetchAllNfts = () => {
    const hej = wallet.getters.allNftCollections
    const specificNft = wallet.getters.accountNftCollections(
      route.params.currentAccount.id,
    )
    console.log(specificNft, 'Specific NFT')
    console.log(hej, 'ALL NFTS')
  }

  useEffect(() => {
    async function fetchData() {
      let Obj = {
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      }

      await updateNFTs(Obj)
      fetchAllNfts()
    }
    fetchData()
  }, [accountIdsToSendIn, activeNetwork, activeWalletId]) // Or [] if effect doesn't need props or state

  return (
    <View style={[styles.container, styles.fragmentContainer]}>
      <Text style={[styles.label, styles.headerLabel]}>
        Specific CHAIN NFT SCreen
      </Text>
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

export default ShowNFTForSpecificChainScreen
