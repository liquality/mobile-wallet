import * as React from 'react'
import { scale } from 'react-native-size-matters'
import { Box, Text } from '../../../theme'

type SwapPartitionRowProps = {
  title: string
  subTitle: string
  leftSubTitle?: string
  showParitionLine?: boolean
  customView?: React.ReactElement
}

const SwapPartitionRow = ({
  title,
  subTitle,
  leftSubTitle,
  showParitionLine = true,
  customView: CV,
}: SwapPartitionRowProps) => {
  return (
    <>
      <Text variant={'listText'} color="greyMeta">
        {title}
      </Text>
      <Box flexDirection={'row'}>
        {showParitionLine ? (
          <Text variant={'swapSubTitle'} color={'darkGrey'}>
            {leftSubTitle}
          </Text>
        ) : null}
        {showParitionLine ? (
          <Box
            alignSelf={'flex-start'}
            width={1}
            marginHorizontal="m"
            height={scale(15)}
            backgroundColor="inactiveText"
          />
        ) : null}
        {CV || null}
        <Text variant={'swapSubTitle'} color={'darkGrey'}>
          {subTitle}
        </Text>
      </Box>
    </>
  )
}

export default SwapPartitionRow
