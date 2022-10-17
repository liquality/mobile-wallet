import * as React from 'react'
import { Text } from '../../../theme'

type SwapRowProps = {
  title: string
  subTitle: string
}

const SwapRow = ({ title, subTitle }: SwapRowProps) => {
  return (
    <>
      <Text variant={'listText'} color="greyMeta">
        {title}
      </Text>
      <Text variant={'termsBody'} color={'greyBlack'}>
        {subTitle}
      </Text>
    </>
  )
}

export default SwapRow
