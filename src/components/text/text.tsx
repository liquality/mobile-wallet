import * as React from 'react'
import { Text as ReactNativeText } from 'react-native'
import { TextProps } from './text.props'
import { translate } from '../../i18n'
import { langSelected as LS } from '../../../src/atoms'
import { useRecoilValue } from 'recoil'
import i18n from 'i18n-js'

export function Text(props: TextProps) {
  const { tx, txOptions, text, children, style: styleOverride, ...rest } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  return (
    <ReactNativeText {...rest} style={styleOverride}>
      {content}
    </ReactNativeText>
  )
}
