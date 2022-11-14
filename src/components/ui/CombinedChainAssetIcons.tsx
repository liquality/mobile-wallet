import AssetIcon from '../asset-icon'
import { scale } from 'react-native-size-matters'
import { Box } from '../../theme'
import React, { memo } from 'react'
import { ChainId } from '@chainify/types'

type CombinedChainAssetIconsProps = {
  code: string
  chain: ChainId
  scaleMultiplier?: number
}
const CombinedChainAssetIcons = (props: CombinedChainAssetIconsProps) => {
  const { code, chain, scaleMultiplier = 1 } = props
  return (
    <Box flexDirection={'row'} alignItems={'flex-end'}>
      <AssetIcon asset={code} size={scale(scaleMultiplier * 30)} />
      <AssetIcon
        chain={chain}
        size={scale(scaleMultiplier * 15)}
        styles={{ left: -10 * scaleMultiplier }}
      />
    </Box>
  )
}

export default memo(CombinedChainAssetIcons)
