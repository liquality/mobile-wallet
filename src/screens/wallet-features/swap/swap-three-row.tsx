import * as React from 'react'
import { Text } from '../../../theme'

type SwapRowProps = {
  title: string
  subTitle: string
  today: string
}

const SwapThreeRow = ({ title, subTitle, today }: SwapRowProps) => {
  return (
    <>
      <Text variant={'listText'} color="greyMeta">
        {title}
      </Text>
      <Text color={'darkGrey'} variant="swapSubTitle">
        {subTitle}
      </Text>
      <Text variant="swapSubTitle" color={'darkGrey'}>
        {today}
      </Text>
    </>
  )
}

export default SwapThreeRow
