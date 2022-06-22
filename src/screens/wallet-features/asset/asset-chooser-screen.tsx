import React, { useCallback, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import SearchIcon from '../../../assets/icons/search.svg'

import { AccountType, RootStackParamList } from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import { accountListState, enabledAccountsIdsState } from '../../../atoms'

type AssetChooserProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetChooserScreen'
>

const AssetChooserScreen: React.FC<AssetChooserProps> = () => {
  const accountIds = useRecoilValue(enabledAccountsIdsState)
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
          placeholder={'Search for a Currency'}
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
    backgroundColor: '#FFF',
  },
  sendInput: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 14,
    height: 14,
    width: '90%',
    color: '#747E8DB2',
  },
  searchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 10,
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
})

export default AssetChooserScreen
