import * as React from 'react'
import { createText } from '@shopify/restyle'
import { Theme } from './'
import { TxKeyPath, translate } from '../i18n'
import i18n from 'i18n-js'

const RnText = createText<Theme>()

type TextProps = React.ComponentProps<typeof RnText> & {
  tx?: TxKeyPath
  txOptions?: i18n.TranslateOptions
}

export function Text(props: TextProps) {
  const { tx, txOptions, children, style: styleOverride, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || children

  return (
    <RnText {...rest} style={styleOverride}>
      {content}
    </RnText>
  )
}

export default Text
