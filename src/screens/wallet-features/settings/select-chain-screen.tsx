import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useRecoilValue } from 'recoil'
import {
  accountsIdsState,
  networkState,
  accountsIdsForMainnetState,
} from '../../../atoms'
import { Box } from '../../../theme'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { FlatList, StyleSheet } from 'react-native'
import ChainRow from './chain-row'
import { scale } from 'react-native-size-matters'

type SelectChainScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SelectChainScreen'
>

const SelectChainScreen: React.FC<SelectChainScreenProps> = () => {
  const network = useRecoilValue(networkState)
  const accountIds = useRecoilValue(
    Network.Testnet === network ? accountsIdsState : accountsIdsForMainnetState,
  )

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    return <ChainRow item={item} />
  }

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <FlatList
        data={accountIds}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        keyExtractor={(item, index) => `${item.id}+${index}`}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: scale(20),
  },
})

export default SelectChainScreen
