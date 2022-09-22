import { setupWallet } from '@liquality/wallet-core'
import defaultOptions from '@liquality/wallet-core/dist/src/walletOptions/defaultOptions'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useCallback, useState } from 'react'
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native'
import { useRecoilValue } from 'recoil'
import { Fonts } from '../../../assets'
import { networkState } from '../../../atoms'
import GradientBackground from '../../../components/gradient-background'
import NftHeader from '../../../components/NFT/nft-header'
import { getAllEnabledAccounts, updateNFTs } from '../../../store/store'
import { Box, Button, palette } from '../../../theme'
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
  const [showBasic, setShowBasic] = useState<boolean[]>(false)

  const { activeWalletId } = wallet.state

  const fetchAllNfts = async () => {
    console.log(wallet.getters.allNftCollections, 'getters all nft collec')
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
      console.log(allNfts, 'allNfts')
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

  const renderNftArray = () => {
    let rows = []
    console.log(iterableNftArray.length, 'iterable length?s')
    if (iterableNftArray.length !== 0) {
      rows = iterableNftArray.map((nftItem, index) => {
        if (nftItem[0].collection.name === 'OpenSea Collections') {
          console.log(nftItem[0], 'name of eachd row')
        }
        return (
          <ScrollView key={index} horizontal={true}>
            <Box
              flex={0.1}
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="s">
              <Text>{nftItem[0].collection.name}</Text>

              <Pressable onPress={() => seeNftDetail(nftItem[0])}>
                <Image
                  source={{
                    uri: nftItem[0].image_thumbnail_url,
                  }}
                  /*                   source={require('../../../assets/icons/nft_thumbnail.png')}
                   */ style={{ width: 150, height: 100 }}
                />
              </Pressable>
            </Box>
          </ScrollView>
        )
      })
    } else {
      return <Text>No NFTs to show</Text>
    }

    return rows
  }

  return (
    /*    <Box style={[styles.container, styles.fragmentContainer]}>
      <NftHeader></NftHeader>

      <Text style={[styles.label, styles.headerLabel]}>NFT SCreen</Text>

      {renderNftArray()}
    </Box> */

    <Box flex={1}>
      <ScrollView>
        <Box style={styles.overviewBlock}>
          <NftHeader
            width={Dimensions.get('screen').width}
            height={225}></NftHeader>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
        <Box height={225}>
          <Text>halo</Text>
        </Box>
      </ScrollView>
    </Box>
    /* 
<Box flex={1}>
      <Box style={styles.container}>
        <Box style={styles.block}>
          <Box style={styles.tabsBlock}>
            <Pressable
              style={[styles.tabHeader, showBasic && styles.headerFocused]}
              onPress={() => setShowBasic(!showBasic)}>
              <Text
                style={[
                  styles.headerText,
                  showBasic && styles.headerTextFocused,
                ]}>
                BASIC
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabHeader, !showBasic && styles.headerFocused]}
              onPress={() => setShowBasic(!showBasic)}>
              <Text style={[styles.headerText]}>CUSTOMIZE</Text>
            </Pressable>
          </Box>
          <Box style={styles.rowEnd}>
            <Text style={[styles.headerText, styles.headerTextFocused]}></Text>
          </Box>
        </Box>
        <Box style={[styles.row, styles.actions]}>
          <Button
            type="secondary"
            variant="m"
            label="Cancel"
            onPress={navigation.goBack}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label="Apply"
            isBorderless={false}
            isActive={true}
          />
        </Box>
      </Box>
      </Box> */
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: palette.white,
    paddingVertical: 15,
  },
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  indicatorBackgroundColor: {
    backgroundColor: 'transparent',
  },
  fragmentContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  inputLabel: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 14,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  gasInput: {
    marginTop: 5,
    borderBottomColor: palette.mediumGreen,
    borderBottomWidth: 1,
    width: '30%',
    textAlign: 'right',
    paddingBottom: 0,
    color: palette.black2,
  },
  actions: {
    justifyContent: 'space-around',
  },
  tabsBlock: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  tabHeader: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.gray,
  },
  headerFocused: {
    borderBottomWidth: 1,
    borderBottomColor: palette.black2,
  },
  headerText: {
    fontFamily: Fonts.Regular,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: palette.gray,
  },
  headerTextFocused: {
    color: palette.black2,
  },
  fiatFast: {
    color: palette.green,
  },
})

export default ShowAllNftsScreen
