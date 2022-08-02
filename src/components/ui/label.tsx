import React, { FC } from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'
import { TxKeyPath, translate } from '../../i18n'
import i18n from 'i18n-js'

type LabelProps = {
  text: string | { tx: TxKeyPath }
  variant: 'light' | 'strong'
  txOptions?: i18n.TranslateOptions
}

const light: TextStyle = {
  color: '#646F85',
  fontWeight: '400',
  fontSize: 12,
  lineHeight: 18,
}

const strong: TextStyle = {
  fontWeight: '700',
  fontSize: 12,
  lineHeight: 18,
}

const Label: FC<LabelProps> = (props) => {
  const { txOptions, text, variant } = props
  let content
  if (typeof text !== 'string') {
    const { tx } = text
    content = tx && translate(tx, txOptions)
  } else {
    content = text
  }

  const styleOverride = variant === 'light' ? light : strong

  return (
    <Text style={[styles.font, styleOverride, styles.spacing]}>{content}</Text>
  )
}

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Montserrat-Regular',
  },
  spacing: {
    marginVertical: 5,
    marginRight: 5,
  },
})

export default Label
