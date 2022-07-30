import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import SearchIcon from '../../../assets/icons/search.svg'

import { AccountType, RootStackParamList } from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import { accountListState, accountsIdsState } from '../../../atoms'
import TextInput from '../../../theme/textInput'
import _ from 'lodash'

type AssetChooserProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetChooserScreen'
>

const AssetChooserScreen: React.FC<AssetChooserProps> = () => {
  const accountIds = useRecoilValue(accountsIdsState)
  const accountList = useRecoilValue(accountListState)
  const searchInput = useInputState('')
  const [data, setData] =
    useState<Array<{ id: string; name: string }>>(accountIds)

  const debounceHandler = _.debounce((text: string): void => {
    const term = text
    if (term.length === 0 || !accountList) {
      return setData(accountIds || ([] as AccountType[]))
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
  }, 800)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterByTerm = useCallback(debounceHandler, [])

  const onChangeText = (text: string) => {
    filterByTerm(text)
    searchInput.onChangeText(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <SearchIcon />
        <TextInput
          style={styles.sendInput}
          placeholderTx={'assetChooserScreen.searchCurrency'}
          keyboardType={'ascii-capable'}
          onChangeText={onChangeText}
          value={searchInput.value}
          autoCorrect={false}
          placeholderTextColor="#747E8DB2"
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
    color: '#000',
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
