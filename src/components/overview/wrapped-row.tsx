import React, { FC, Fragment, memo, useCallback, useState } from 'react'
import { AssetDataElementType, StackPayload } from '../../types'
import { v4 as uuidv4 } from 'uuid'
import Row from './row'
import SubRow from './sub-row'

const WrappedRow: FC<{
  item: AssetDataElementType
  onAssetSelected: (params: StackPayload) => void
}> = (props) => {
  const { item, onAssetSelected } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const isNested = item.assets && item.assets.length > 0 && item.code !== 'BTC'

  const toggleRow = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  return (
    <Fragment key={uuidv4()}>
      <Row
        key={uuidv4()}
        item={item}
        toggleRow={toggleRow}
        onAssetSelected={onAssetSelected}
        isNested={!!isNested}
        isExpanded={isExpanded}
      />
      {isNested &&
        isExpanded &&
        item.assets?.map((subItem) => {
          return (
            <SubRow
              key={uuidv4()}
              parentItem={item}
              item={subItem}
              onAssetSelected={onAssetSelected}
            />
          )
        })}
    </Fragment>
  )
}

export default memo(WrappedRow)
