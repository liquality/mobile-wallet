import { AssetDataElementType } from '../../types'
import React, { FC, useCallback } from 'react'
import { useInputState } from '../../hooks'
import { Pressable, StyleSheet, TextInput, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faTimes } from '@fortawesome/pro-light-svg-icons'

type SearchBoxPropsType = {
  updateData: (...args: any) => void
  assets: AssetDataElementType[]
}

const SearchBox: FC<SearchBoxPropsType> = (props) => {
  const { updateData, assets } = props
  const searchInput = useInputState('')

  const filterByTerm = useCallback((): void => {
    const term = searchInput.value

    if (term.length === 0 || !assets) {
      updateData(assets || ([] as AssetDataElementType[]))
      return
    }

    const filteredResults: AssetDataElementType[] = assets
      .map((item) => {
        const subs = item.assets?.filter(
          (sub) => sub.name.toLowerCase().indexOf(term.toLowerCase()) >= 0,
        )
        if (subs && subs.length > 0) {
          return {
            ...item,
          }
        } else {
          return {} as AssetDataElementType
        }
      })
      .filter((item) => item.name)

    updateData(filteredResults || [])
  }, [assets, searchInput.value, updateData])

  const handleClearBtnPress = () => {
    searchInput.onChangeText('')
  }

  return (
    <View style={styles.searchBox}>
      <FontAwesomeIcon icon={faSearch} style={styles.icon} />
      <TextInput
        style={styles.sendInput}
        placeholder={'Search for a Currency'}
        keyboardType={'numeric'}
        onChangeText={searchInput.onChangeText}
        onEndEditing={filterByTerm}
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
