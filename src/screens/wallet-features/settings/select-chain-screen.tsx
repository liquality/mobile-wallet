import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { useRecoilValue } from 'recoil'
import { sortedAccountsIdsState } from '../../../atoms'
import { Box } from '../../../theme'
import { FlatList, StyleSheet } from 'react-native'
import ChainRow from './chain-row'
import { scale } from 'react-native-size-matters'

type SelectChainScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SelectChainScreen'
>

const SelectChainScreen: React.FC<SelectChainScreenProps> = () => {
  const accountIds = useRecoilValue(sortedAccountsIdsState)

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
