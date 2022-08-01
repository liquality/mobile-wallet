import React, { FC } from 'react'
import Box from '../../theme/box'
import Text from '../../theme/text'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'

type WarningProps = {
  text1: string
  text2: string
  children: React.ReactElement
  tx1?: TxKeyPath
  txOptions1?: i18n.TranslateOptions
  tx2?: TxKeyPath
  txOptions2?: i18n.TranslateOptions
}

const Warning: FC<WarningProps> = (props) => {
  const { tx1, tx2, txOptions1, txOptions2, text1, text2, children } = props

  const i18nText1 = tx1 && translate(tx1, txOptions1)
  const content1 = i18nText1 || text1
  const i18nText2 = tx2 && translate(tx2, txOptions2)
  const content2 = i18nText2 || text2

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-end"
      marginVertical="m"
      paddingHorizontal="xl">
      {children}
      <Text variant="warningBold">
        {content1} <Text variant="warningLight">{content2}</Text>
      </Text>
    </Box>
  )
}

export default Warning
