import React, { FC } from 'react'
import { FlatList } from 'react-native'
import { AssetDataElementType, StackPayload } from '../../types'
import WrappedRow from './wrapped-row'

type AssetFlatListPropsType = {
  assets: Array<AssetDataElementType>
  onAssetSelected: (params: StackPayload) => void
}

const AssetFlatList: FC<AssetFlatListPropsType> = (props) => {
  const { assets, onAssetSelected } = props

  const renderAsset = ({ item }: { item: AssetDataElementType }) => {
    return <WrappedRow item={item} onAssetSelected={onAssetSelected} />
  }

  return (
    <FlatList
      data={assets}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

export default React.memo(AssetFlatList)
