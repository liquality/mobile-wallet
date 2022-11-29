import AssetIcon from '../asset-icon'
import { scale } from 'react-native-size-matters'
import { Box } from '../../theme'
import React, { memo } from 'react'
import { ChainId } from '@chainify/types'

type CombinedChainAssetIconsProps = {
  code: string
  chain?: ChainId
  account?: string
  scaleMultiplier?: number
}

const ChainOverAssetIcon = (props: CombinedChainAssetIconsProps) => {
  const { code, chain, scaleMultiplier = 1 } = props
  return (
    <Box
      flexDirection={'row'}
      alignItems={'flex-end'}
      justifyContent={'flex-end'}>
      <AssetIcon asset={code} size={scale(38)} />
      {chain ? (
        <AssetIcon
          chain={chain}
          size={scale(20)}
          styles={{ left: -11 * scaleMultiplier }}
        />
      ) : null}
    </Box>
  )
}

export default memo(ChainOverAssetIcon)
