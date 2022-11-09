import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet } from 'react-native'
import { getAllAssets, getAsset } from '@liquality/cryptoassets'
import { useRecoilValue } from 'recoil'
import { networkState } from '../atoms'
import { Box, Text } from '../theme'
import { scale } from 'react-native-size-matters'
import { Asset } from '@chainify/types'
import AccountRow from './account-row'
import { useHeaderHeight } from '@react-navigation/elements'
import { SCREEN_HEIGHT } from '../utils'

const horizontalContentHeight = 60

type AccountManagementProps = {
  enabledAssets: string[] | undefined
  accounts: { id: string; name: string }[]
}

interface CustomAsset extends Asset {
  id: string
}

const EmptyComponent = () => {
  const headerHeight = useHeaderHeight()
  return (
    <Box
      height={
        SCREEN_HEIGHT - headerHeight - 2 * horizontalContentHeight // textinput height
      }
      justifyContent="center"
      alignItems={'center'}
      width={'95%'}>
      <Text color={'textColor'} variant="h3" tx="hmm" />
      <Text color={'textColor'} variant="h3" tx="cantFndTkn" />
    </Box>
  )
}

const AccountManagement = ({
  enabledAssets,
  accounts,
}: AccountManagementProps) => {
  const [assets, setAssets] = useState<CustomAsset[]>([])
  const activeNetwork = useRecoilValue(networkState)

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your wallet')
      return
    }

    //TODO we still need to handle custom tokens
    let myAssets: Asset[] = []

    if (enabledAssets) {
      myAssets =
        enabledAssets.reduce((assetList: Asset[], asset) => {
          if (getAllAssets().testnet.hasOwnProperty(asset)) {
            assetList.push({
              ...getAsset(activeNetwork, asset),
              contractAddress: getAsset(activeNetwork, asset).contractAddress,
            })
          }
          return assetList
        }, []) || []
    } else {
      myAssets = Object.keys(getAllAssets().mainnet).map((key) =>
        getAsset(activeNetwork, key),
      )
    }

    let tempAssets: Array<CustomAsset> = []
    for (let assetItem of myAssets) {
      accounts.forEach((accItem) => {
        if (assetItem.code === accItem.name) {
          tempAssets.push({ ...assetItem, id: accItem.id })
        }
      })
    }

    setAssets([...tempAssets])
  }, [accounts, activeNetwork, enabledAssets])

  const renderAsset = useCallback(({ item }: { item: CustomAsset }) => {
    return <AccountRow assetItems={item} />
  }, [])

  return (
    <Box
      flex={1}
      backgroundColor={'mainBackground'}
      paddingHorizontal="screenPadding">
      <FlatList
        data={assets}
        contentContainerStyle={styles.contentContainerVerStyle}
        renderItem={renderAsset}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyComponent}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  contentContainerVerStyle: {
    paddingBottom: scale(10),
  },
})

export default AccountManagement
