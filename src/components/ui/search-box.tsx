import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Fuse from 'fuse.js'
import { useInputState } from '../../hooks'
import { palette, Text, TextInput } from '../../theme'
import { AppIcons, Fonts } from '../../assets'

const { SearchIcon, TimesIcon } = AppIcons

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

  const handleClearBtnPress = () => {
    searchInput.onChangeText('')
    updateData(items)
  }

  return (
    <View style={styles.searchBox}>
      <SearchIcon style={styles.icon} />
      <TextInput
        style={styles.sendInput}
        placeholderTx="searchForCurrency"
        keyboardType={'numeric'}
        onChangeText={searchInput.onChangeText}
        onEndEditing={filterItems}
        value={searchInput.value}
        autoCorrect={false}
        returnKeyType="done"
      />
      {searchInput.value.length > 0 && (
        <Pressable style={styles.clearBtn} onPress={handleClearBtnPress}>
          <TimesIcon fill={palette.darkGray} />
          <Text style={styles.clearBtnText} tx="common.reset" />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sendInput: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 14,
    height: 14,
    width: '80%',
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  clearBtnText: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 13,
    color: palette.darkGray,
    lineHeight: 14,
  },
  icon: {
    marginRight: 5,
  },
})

export default SearchBox
