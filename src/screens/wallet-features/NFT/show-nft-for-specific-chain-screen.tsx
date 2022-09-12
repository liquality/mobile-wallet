import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../../atoms'
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
  const activeNetwork = useRecoilValue(networkState)
  const { activeWalletId } = wallet.state

  const enabledAccountsToSendIn = wallet.getters.accountsData
  const accountIdsToSendIn = enabledAccountsToSendIn.map((account) => {
    return account.id
  })

  const fetchAllNfts = () => {
    const specificNft = wallet.getters.accountNftCollections(
      route.params.currentAccount.id,
    )
  }

  useEffect(() => {
    async function fetchData() {
      await updateNFTs({
        walletId: activeWalletId,
        network: activeNetwork,
        accountIds: accountIdsToSendIn,
      })
      fetchAllNfts()
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNetwork, activeWalletId])

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

  label: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 12,
  },

  headerLabel: {
    marginVertical: 10,
  },
})

export default ShowNFTForSpecificChainScreen
