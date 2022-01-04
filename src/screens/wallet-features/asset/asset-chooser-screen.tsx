import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View, StyleSheet, TextInput, Alert } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/pro-light-svg-icons'

import {
  ActionEnum,
  AssetDataElementType,
  RootStackParamList,
  StackPayload,
} from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState, useWalletState } from '../../../hooks'

type AssetChooserProps = StackScreenProps<
  RootStackParamList,
  'AssetChooserScreen'
>

const AssetChooserScreen: React.FC<AssetChooserProps> = (props) => {
  const { navigation, route } = props
  const searchInput = useInputState('')
  const [data, setData] = useState<Array<AssetDataElementType>>([])
  const { assets, loading } = useWalletState()
  const screenMap: Record<ActionEnum, keyof RootStackParamList> = useMemo(
    () => ({
      [ActionEnum.RECEIVE]: 'ReceiveScreen',
      [ActionEnum.SWAP]: 'SwapScreen',
      [ActionEnum.SEND]: 'SendScreen',
    }),
    [],
  )

  const filterByTerm = useCallback((): void => {
    const term = searchInput.value

    if (term.length === 0 || !assets) {
      return setData(assets || ([] as AssetDataElementType[]))
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

    setData(filteredResults || [])
  }, [assets, searchInput.value])

  const onAssetSelected = useCallback(
    (params: StackPayload) => {
      if (typeof route.params.action === 'undefined') {
        Alert.alert('Please reload your app')
      } else {
        navigation.navigate(screenMap[route.params.action], {
          assetData: params.assetData,
          screenTitle: `${route.params.action} ${params.assetData?.code}`,
        })
      }
    },
    [navigation, route.params.action, screenMap],
  )

  useEffect(() => {
    if (!loading) {
      setData(assets)
    }
  }, [assets, loading])

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FontAwesomeIcon icon={faSearch} />
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
      </View>
      <AssetFlatList assets={data} onAssetSelected={onAssetSelected} />
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
