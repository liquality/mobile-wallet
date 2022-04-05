import React, { useCallback, useState } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import { faCheck } from '@fortawesome/pro-solid-svg-icons'

import { AssetDataElementType } from '../../types'
import { capitalizeFirstLetter } from '../../utils'
import SectionTitle from './section-title'
import { useWalletState } from '../../hooks'
import AssetIcon from '../asset-icon'
import { withNavigation } from '@react-navigation/compat'

const getItemsFromAssets = (assets: Array<AssetDataElementType>): any[] => {
  if (assets.length < 6) {
    return assets
  }

  return [...assets.slice(0, 4), { id: 'more' }]
}

const AssetToggles = ({ navigation }: { navigation: any }) => {
  const { assets } = useWalletState()
  const items = getItemsFromAssets([...assets, ...assets])

  const handleMoreBtnPress = useCallback(() => {
    navigation.navigate('AssetManagementScreen', {
      screenTitle: 'Select asset',
    })
  }, [navigation])

  const [assetIds, setAssetIds] = useState<string[]>([])
  const renderItem = useCallback(
    (item: AssetDataElementType) => {
      const assetId = item.id
      const isSelected = assetIds.includes(assetId)
      return (
        <Pressable
          style={styles.button}
          onPress={() => {
            if (assetId === 'more') {
              handleMoreBtnPress()
              return
            }

            setAssetIds(
              isSelected
                ? assetIds.filter((type) => type !== assetId)
                : [...new Set([...assetIds, assetId])],
            )
          }}>
          <View style={styles.iconContainer}>
            {assetId === 'more' ? (
              <View style={styles.more} />
            ) : (
              <AssetIcon chain={item.chain} size={32} />
            )}
            {isSelected && (
              <FontAwesomeIcon
                style={styles.check}
                size={20}
                icon={faCheck}
                color={'#2CD2CF'}
              />
            )}
          </View>
          <Text style={styles.label}>
            {capitalizeFirstLetter(assetId.toUpperCase())}
          </Text>
        </Pressable>
      )
    },
    [assetIds, handleMoreBtnPress],
  )

  return (
    <View style={styles.container}>
      <SectionTitle title="ASSETS" />
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

export default withNavigation(AssetToggles)
