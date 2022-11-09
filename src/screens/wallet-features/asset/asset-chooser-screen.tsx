import React, { useCallback, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { MainStackParamList } from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import { accountListState, sortedAccountsIdsState } from '../../../atoms'
import { Box, faceliftPalette, TextInput } from '../../../theme'
import { AppIcons } from '../../../assets'
import Fuse from 'fuse.js'

const { SearchIcon } = AppIcons

const options = {
  includeScore: true,
  keys: ['name', 'code', 'assets.name', 'assets.code'],
}

type AssetChooserProps = NativeStackScreenProps<
  MainStackParamList,
  'AssetChooserScreen'
>

const AssetChooserScreen: React.FC<AssetChooserProps> = () => {
  const accountIds = useRecoilValue(sortedAccountsIdsState)
  const accountList = useRecoilValue(accountListState)
  const searchInput = useInputState('')
  const [data, setData] =
    useState<Array<{ id: string; name: string }>>(accountIds)

  const filterItems = useCallback(
    (term: string) => {
      if (term.length === 0) {
        searchInput.onChangeText(term)
        setData(accountIds)
        return
      }
      const fuse = new Fuse(accountList, options)
      const rawData = fuse.search(term)
      const results = rawData.map((result) => ({
        id: result.item.id || '',
        name: result.item.code || '',
      }))
      if (results.length) {
        setData(results)
      }
      searchInput.onChangeText(term)
    },
    [accountIds, accountList, searchInput],
  )

  return (
    <Box flex={1} backgroundColor="mainBackground" paddingHorizontal={'xl'}>
      <Box flexDirection={'row'} paddingVertical={'m'} alignItems="center">
        <SearchIcon />
        <Box paddingLeft={'m'} width={'98%'}>
          <TextInput
            variant={'searchBoxInput'}
            placeholderTx={'assetChooserScreen.searchCurrency'}
            keyboardType={'ascii-capable'}
            onChangeText={(text) => filterItems(text)}
            value={searchInput.value}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            returnKeyType="done"
            cursorColor={faceliftPalette.greyMeta}
          />
        </Box>
      </Box>
      <AssetFlatList accounts={data} />
    </Box>
  )
}

export default AssetChooserScreen
