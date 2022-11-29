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
const CombinedChainAssetIcons = (props: CombinedChainAssetIconsProps) => {
  const { code, chain, account, scaleMultiplier = 1 } = props
  return (
    <Box flexDirection={'row'} alignItems={'flex-end'}>
      {chain ? <AssetIcon chain={chain} size={scale(24)} /> : null}
      {account ? <AssetIcon account={account} size={scale(24)} /> : null}
      <AssetIcon
        asset={code}
        size={scale(24)}
        styles={{ left: -7 * scaleMultiplier }}
      />
    </Box>
  )
}

export default memo(CombinedChainAssetIcons)
