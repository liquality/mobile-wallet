import React, { FC } from 'react'
import Box from '../../theme/box'
import Text from '../../theme/text'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'
import { langSelected as LS } from '../../../src/atoms'
import { useRecoilValue } from 'recoil'

type WarningProps = {
  text1: string | { tx1: TxKeyPath }
  text2: string | { tx2: TxKeyPath }
  children: React.ReactElement
  txOptions1?: i18n.TranslateOptions
  txOptions2?: i18n.TranslateOptions
}

const Warning: FC<WarningProps> = (props) => {
  const { txOptions1, txOptions2, text1, text2, children } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  let content1
  if (typeof text1 !== 'string') {
    const { tx1 } = text1
    content1 = tx1 && translate(tx1, txOptions1)
  } else {
    content1 = text1
  }
  let content2
  if (typeof text2 !== 'string') {
    const { tx2 } = text2
    content2 = tx2 && translate(tx2, txOptions2)
  } else {
    content2 = text2
  }

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      marginVertical="m"
      paddingHorizontal="xl">
      <Box>{children}</Box>
      <Text variant="warningBold">
        {content1} <Text variant="warningLight">{content2}</Text>
      </Text>
    </Box>
  )
}

export default Warning
