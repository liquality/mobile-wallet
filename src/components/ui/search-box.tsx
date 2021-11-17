import React, { useCallback } from 'react'
import { useInputState } from '../../hooks'
import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faTimes } from '@fortawesome/pro-light-svg-icons'

type SearchBoxPropsType<T> = {
  updateData: (...args: any) => void
  items: T[]
  isTwoLevelSearch: boolean
}

const SearchBox = <T extends { code: string; name: string; items?: T[] }>(
  props: SearchBoxPropsType<T>,
) => {
  const { updateData, items, isTwoLevelSearch } = props
  const searchInput = useInputState('')

  const filterOneLevelItems = useCallback(() => {
    const term = searchInput.value
    if (term.length === 0 || !items) {
      updateData(items || ([] as T[]))
      return
    }

    //TODO maybe more efficient to use regex
    const filteredResults: T[] = items.filter(
      (item) =>
        item.name.toLowerCase().indexOf(term.toLowerCase()) >= 0 ||
        item.code.toLowerCase().indexOf(term.toLowerCase()) >= 0,
    )

    updateData(filteredResults)
  }, [items, searchInput.value, updateData])

  const filterTwoLevelItems = useCallback((): void => {
    const term = searchInput.value

    if (term.length === 0 || !items) {
      updateData(items || ([] as T[]))
      return
    }

    const filteredResults: T[] = items
      .map((item) => {
        const subs = item.items?.filter(
          (sub) => sub.name.toLowerCase().indexOf(term.toLowerCase()) >= 0,
        )
        if (subs && subs.length > 0) {
          return {
            ...item,
          }
        } else {
          return {} as T
        }
      })
      .filter((item) => item.name)

    updateData(filteredResults || [])
  }, [items, searchInput.value, updateData])

  const filterItems = useCallback(() => {
    if (isTwoLevelSearch) {
      filterTwoLevelItems()
    } else {
      filterOneLevelItems()
    }
  }, [filterOneLevelItems, filterTwoLevelItems, isTwoLevelSearch])

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
      <Pressable style={styles.clearBtn} onPress={handleClearBtnPress}>
        <FontAwesomeIcon icon={faTimes} color={'#646F85'} />
        <Text style={styles.clearBtnText}>Reset</Text>
      </Pressable>
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
