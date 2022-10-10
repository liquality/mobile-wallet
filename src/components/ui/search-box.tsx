import React, { Dispatch, SetStateAction, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useInputState } from '../../hooks'
import { Box, faceliftPalette, TextInput } from '../../theme'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/core'
import { TouchableOpacity } from 'react-native-gesture-handler'

const { ChevronLeft } = AppIcons

type SearchBoxPropsType<T> = {
  updateData: Dispatch<SetStateAction<T[]>>
  items: T[]
}

const options = {
  includeScore: true,
  keys: ['name', 'code', 'assets.name', 'assets.code'],
}

const SearchBox = <T extends { code: string; name: string; items?: T[] }>(
  props: SearchBoxPropsType<T>,
) => {
  const { updateData, items } = props
  const searchInput = useInputState('')
  const navigation = useNavigation()

  const filterItems = useCallback(() => {
    const term = searchInput.value

    if (term.length === 0 || !items) {
      updateData(items || ([] as T[]))
      return
    }
    const fuse = new Fuse(items, options)
    const results = fuse.search<T>(term)
    updateData(results.map((result) => result.item))
  }, [items, searchInput.value, updateData])

  return (
    <Box flexDirection={'row'} alignItems="center" height={scale(46)}>
      <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
        <ChevronLeft width={scale(15)} height={scale(15)} />
      </TouchableOpacity>
      <Box marginLeft={'m'}>
        <TextInput
          variant={'searchBoxInput'}
          placeholderTx="searchAsset"
          onChangeText={searchInput.onChangeText}
          onEndEditing={filterItems}
          value={searchInput.value}
          autoCorrect={false}
          returnKeyType="done"
          cursorColor={faceliftPalette.greyMeta}
          maxLength={30}
        />
      </Box>
    </Box>
  )
}

export default SearchBox
