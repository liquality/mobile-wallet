import * as React from 'react'
import { createText } from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { TxKeyPath, translate } from '../i18n'
import i18n from 'i18n-js'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'

const RnText = createText<Theme>()

type TextProps = React.ComponentProps<typeof RnText> & {
  tx?: TxKeyPath
  txOptions?: i18n.TranslateOptions
}

export const Text = (props: TextProps) => {
  const { tx, txOptions, children, style: styleOverride, ...rest } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || children

  return (
    <RnText allowFontScaling={false} {...rest} style={styleOverride}>
      {content}
    </RnText>
  )
}
