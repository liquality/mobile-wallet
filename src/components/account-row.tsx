import React from 'react'
import AssetIcon from './asset-icon'
import Switch from './ui/switch'
import { Box, Text } from '../theme'
import { Asset } from '@chainify/types'

interface CustomAsset extends Asset {
  id: string
}

const AccountRow = ({ assetItems }: { assetItems: CustomAsset }) => {
  const { name, code, chain, id } = assetItems

  return (
    <Box flexDirection={'row'} alignItems="center" marginTop={'mxxl'} key={id}>
      <AssetIcon chain={chain} asset={code} />
      <Box flex={1} marginLeft="m">
        <Text variant={'h6'} color="darkGrey" fontWeight={'500'}>
          {name}
        </Text>
      </Box>
      <Box paddingRight={'s'}>
        <Switch asset={code} />
      </Box>
    </Box>
  )
}

export default AccountRow
