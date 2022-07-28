import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { assets as cryptoassets } from '@liquality/cryptoassets'

import { capitalizeFirstLetter } from '../../utils'
import SectionTitle from './section-title'
import AssetIcon from '../asset-icon'
import { useNavigation } from '@react-navigation/native'
import SwapCheck from '../../assets/icons/swap-check.svg'
import { useRecoilValue } from 'recoil'
import { enabledAssetsState } from '../../atoms'

const getItemsFromAssets = (assets: Array<string>): any[] => {
  if (assets.length < 6) {
    return assets
  }

  return [...assets.slice(0, 4), 'more']
}

const AssetToggles: FC<{
  value: string[]
  onChange: (assets: string[]) => void
}> = ({ value, onChange }) => {
  const assetCodes = useRecoilValue(enabledAssetsState)
  const items = getItemsFromAssets([...assetCodes, ...assetCodes])
  const navigation = useNavigation()

  const handleMoreBtnPress = useCallback(() => {
    navigation.navigate('AssetToggleScreen', {
      screenTitle: 'Select asset',
      selectedAssetCodes: value,
      onSelectAssetCodes: onChange,
    })
  }, [navigation, value, onChange])

  const renderItem = useCallback(
    (assetCode: string) => {
      const isSelected = value.includes(assetCode)
      return (
        <Pressable
          style={styles.button}
          onPress={() => {
            if (assetCode === 'more') {
              handleMoreBtnPress()
              return
            }

            onChange(
              isSelected
                ? value.filter((type) => type !== assetCode)
                : [...new Set([...value, assetCode])],
            )
          }}>
          <View style={styles.iconContainer}>
            {assetCode === 'more' ? (
              <View style={styles.more} />
            ) : (
              <AssetIcon chain={cryptoassets[assetCode].chain} size={32} />
            )}
            {isSelected && (
              <SwapCheck style={styles.check} width={20} height={20} />
            )}
          </View>
          <Text style={styles.label}>
            {capitalizeFirstLetter(assetCode.toUpperCase())}
          </Text>
        </Pressable>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assetCodes, handleMoreBtnPress],
  )

  return (
    <View style={styles.container}>
      <SectionTitle tx="common.assets" />
      <View style={styles.content}>{items.map(renderItem)}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    marginRight: 7,
    marginTop: 12,
  },
  label: {
    marginTop: 6,
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    fontSize: 13,
  },
  more: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D421EB',
  },
  iconContainer: {
    width: 68,
    alignItems: 'center',
  },
  check: {
    position: 'absolute',
    right: 0,
    bottom: -3,
  },
})

export default AssetToggles
