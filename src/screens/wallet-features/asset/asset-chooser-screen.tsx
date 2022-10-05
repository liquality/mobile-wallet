import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { AccountType, MainStackParamList } from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import {
  accountListState,
  accountsIdsState,
  networkState,
  accountsIdsForMainnetState,
} from '../../../atoms'
import { Box, palette, TextInput } from '../../../theme'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { AppIcons, Fonts } from '../../../assets'

const { SearchIcon } = AppIcons

type AssetChooserProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetChooserScreen'
>

const AssetChooserScreen: React.FC<AssetChooserProps> = () => {
  const network = useRecoilValue(networkState)
  const accountIds = useRecoilValue(
    Network.Testnet === network ? accountsIdsState : accountsIdsForMainnetState,
  )
  const accountList = useRecoilValue(accountListState)
  const searchInput = useInputState('')
  const [data, setData] =
    useState<Array<{ id: string; name: string }>>(accountIds)

  const filterByTerm = useCallback((): void => {
    const term = searchInput.value

    if (term.length === 0 || !accountList) {
      return setData(accountList || ([] as AccountType[]))
    }

    const filteredResults: { id: string; name: string }[] = accountList
      .filter((item) => item != null)
      .map((item) => {
        const subs = Object.values(item.assets).filter(
          (sub) => sub.name.toLowerCase().indexOf(term.toLowerCase()) >= 0,
        )
        if (subs && subs.length > 0) {
          return {
            ...item,
          }
        } else {
          return {} as AccountType
        }
      })
      .filter((item) => item.name)
      .map((item) => ({ id: item.id, name: item.name }))

    setData(filteredResults || [])
  }, [accountList, searchInput.value])

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <View style={styles.searchBox}>
        <SearchIcon />
        <TextInput
          style={styles.sendInput}
          placeholderTx={'assetChooserScreen.searchCurrency'}
          keyboardType={'ascii-capable'}
          onChangeText={searchInput.onChangeText}
          onEndEditing={filterByTerm}
          value={searchInput.value}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
        />
      </View>
      <AssetFlatList accounts={data} />
    </Box>
  )
}

const styles = StyleSheet.create({
  sendInput: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: 17,
    textAlign: 'left',
    height: 40,
    width: '90%',
    color: palette.seedInputColor,
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: palette.mediumGreen,
    borderBottomWidth: 1,
  },
})

export default AssetChooserScreen
