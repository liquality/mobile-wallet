import React, { FC } from 'react'
import { translate, TxKeyPath } from '../../i18n'
import { Box, Card, Text } from '../../theme'
import { LARGE_TITLE_HEADER_HEIGHT } from '../../utils'
import i18n from 'i18n-js'
import { useRecoilValue } from 'recoil'
import { langSelected as LS } from '../../../src/atoms'

interface CustomHeaderBarProps {
  title: string | { tx: TxKeyPath }
  txOptions?: i18n.TranslateOptions
}

const CustomHeaderBar: FC<CustomHeaderBarProps> = (props) => {
  const { txOptions, title } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  let content
  if (typeof title !== 'string') {
    const { tx } = title
    content = tx && translate(tx, txOptions)
  } else {
    content = title
  }
  return (
    <Card
      variant={'headerCard'}
      height={LARGE_TITLE_HEADER_HEIGHT}
      paddingHorizontal="xl">
      <Box flex={1} justifyContent="flex-end">
        <Text variant={'largerHeaderTitle'} color="headerColor">
          {content}
        </Text>
      </Box>
    </Card>
  )
}

export default CustomHeaderBar
