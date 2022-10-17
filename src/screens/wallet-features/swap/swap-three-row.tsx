import * as React from 'react'
import { Box, Text } from '../../../theme'
import { scale } from 'react-native-size-matters'

type SwapRowProps = {
  title: string
  subTitle: string
  today: string
  then: string
}

const SwapThreeRow = ({ title, subTitle, today, then }: SwapRowProps) => {
  return (
    <>
      <Text variant={'listText'} color="greyMeta">
        {title}
      </Text>
      <Text color={'darkGrey'} variant="swapSubTitle">
        {subTitle}
      </Text>
      <Box flexDirection={'row'} alignItems="center">
        <Text variant="swapSubTitle" color={'darkGrey'}>
          {today}
        </Text>
        <Box
          alignSelf={'flex-start'}
          width={1}
          marginHorizontal="m"
          height={scale(15)}
          backgroundColor="inactiveText"
        />
        <Text variant="swapSubTitle" color={'darkGrey'}>
          {then}
        </Text>
      </Box>
    </>
  )
}

export default SwapThreeRow
