import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faTimes } from '@fortawesome/pro-light-svg-icons'
import Fuse from 'fuse.js'
import { useInputState } from '../../hooks'

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
      <FontAwesomeIcon icon={faSearch} style={styles.icon} />
      <TextInput
        style={styles.sendInput}
        placeholder={'Search for a Currency'}
        keyboardType={'numeric'}
        onChangeText={searchInput.onChangeText}
        onEndEditing={filterItems}
        value={searchInput.value}
        autoCorrect={false}
        returnKeyType="done"
      />
      {searchInput.value.length > 0 && (
        <Pressable style={styles.clearBtn} onPress={handleClearBtnPress}>
          <FontAwesomeIcon icon={faTimes} color={'#646F85'} />
          <Text style={styles.clearBtnText}>Reset</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  sendInput: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 14,
    height: 14,
    width: '80%',
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  clearBtnText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 13,
    color: '#646F85',
    lineHeight: 14,
  },
  icon: {
    marginRight: 5,
  },
})

export default SearchBox