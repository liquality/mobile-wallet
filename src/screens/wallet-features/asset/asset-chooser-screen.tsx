import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, StyleSheet, TextInput, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/pro-light-svg-icons'

import {
  ActionEnum,
  AssetDataElementType,
  RootStackParamList,
  StackPayload,
  SwapAssetPairType,
} from '../../../types'
import AssetFlatList from '../../../components/overview/asset-flat-list'
import { useInputState, useWalletState } from '../../../hooks'

type AssetChooserProps = NativeStackScreenProps<
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
        if (route.params.action === ActionEnum.SWAP) {
          //if swapAssetPair is falsy then the user is either coming from the overview or the asset screen, otherwise, the user is coming from the swap screen
          if (!route.params.swapAssetPair) {
            const fromAsset = params.assetData
            let toAsset = params.assetData

            if (fromAsset?.code === 'ETH') {
              toAsset = assets.filter((item) => item.code === 'BTC')[0]
            } else {
              toAsset = assets.filter((item) => item.code === 'ETH')[0]
            }
            navigation.navigate(screenMap[route.params.action], {
              swapAssetPair: {
                fromAsset,
                toAsset,
              },
              screenTitle: `${route.params.action} ${params.assetData?.code}`,
            })
          } else {
            const swapAssetPair: SwapAssetPairType = route.params.swapAssetPair
            if (!route.params.swapAssetPair.toAsset) {
              swapAssetPair.toAsset = params.assetData
            } else {
              swapAssetPair.fromAsset = params.assetData
            }
            navigation.navigate(screenMap[route.params.action], {
              swapAssetPair,
              screenTitle: `${route.params.action} ${params.assetData?.code}`,
            })
          }
        } else {
          navigation.navigate(screenMap[route.params.action], {
            assetData: params.assetData,
            screenTitle: `${route.params.action} ${params.assetData?.code}`,
          })
        }
      }
    },
    [
      assets,
      navigation,
      route.params.action,
      route.params.swapAssetPair,
      screenMap,
    ],
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
          keyboardType={'ascii-capable'}
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
