import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { AccountType, RootStackParamList } from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import {
  accountListState,
  accountsIdsState,
  networkState,
  accountsIdsForMainnetState,
} from '../../../atoms'
import { palette, TextInput } from '../../../theme'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { AppIcons, Fonts } from '../../../assets'

const { SearchIcon } = AppIcons

type AssetChooserProps = NativeStackScreenProps<
  RootStackParamList,
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
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  sendInput: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 14,
    height: 14,
    width: '90%',
    color: palette.seedInputColor,
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 10,
    borderBottomColor: palette.mediumGreen,
    borderBottomWidth: 1,
  },
})

export default AssetChooserScreen
