import AssetIcon from '../asset-icon'
import { scale } from 'react-native-size-matters'
import { Box } from '../../theme'
import React, { memo } from 'react'
import { ChainId } from '@chainify/types'

type CombinedChainAssetIconsProps = {
  code: string
  chain: ChainId
}
const CombinedChainAssetIcons = (props: CombinedChainAssetIconsProps) => {
  const { code, chain } = props
  return (
    <Box flexDirection={'row'} alignItems={'flex-end'}>
      <AssetIcon asset={code} size={scale(30)} />
      <AssetIcon chain={chain} size={scale(15)} styles={{ left: -10 }} />
    </Box>
  )
}

export default memo(CombinedChainAssetIcons)
