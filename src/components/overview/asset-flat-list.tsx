import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useAppSelector } from '../../hooks'
import { AssetDataElementType, StackPayload } from '../../types'
import Row from './row'
import SubRow from './sub-row'

type AssetFlatListPropsType = {
  assets: Array<AssetDataElementType>
  onAssetSelected: (params: StackPayload) => void
}

const AssetFlatList: FC<AssetFlatListPropsType> = (props) => {
  const { assets, onAssetSelected } = props
  const [data, setData] = useState<Array<AssetDataElementType>>(assets)
  const { activeNetwork } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
  }))

  const toggleRow = useCallback(
    (itemId: string) => {
      setData(
        data.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              showAssets: !item.showAssets,
              activeNetwork,
            }
          } else {
            return item
          }
        }),
      )
    },
    [activeNetwork, data],
  )

  useEffect(() => {
    setData(assets)
  }, [assets])

  const renderAsset = ({ item }: { item: AssetDataElementType }) => {
    //TODO is this logic correct?
    const isNested =
      item.assets && item.assets.length > 0 && item.code !== 'BTC'

    return (
      <Fragment>
        <Row
          key={item.id}
          item={item}
          toggleRow={toggleRow}
          onAssetSelected={onAssetSelected}
          isNested={!!isNested}
        />
        {isNested &&
          item.showAssets &&
          item.assets?.map((subItem) => {
            return (
              <SubRow
                key={`${item.id}-${subItem.id}`}
                parentItem={item}
                item={subItem}
                onAssetSelected={onAssetSelected}
              />
            )
          })}
      </Fragment>
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={renderAsset}
      keyExtractor={(item) => item.id}
    />
  )
}

export default React.memo(AssetFlatList)
