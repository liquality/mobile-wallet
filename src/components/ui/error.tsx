import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import React, { FC } from 'react'
import { Fonts } from '../../assets'
import { palette } from '../../theme'

type ErrorPropsType = {
  message: string
  style: StyleProp<TextStyle>
}

const Error: FC<ErrorPropsType> = (props) => {
  const { message, style } = props
  return <Text style={[styles.error, style]}>{message}</Text>
}

const styles = StyleSheet.create({
  error: {
    fontFamily: Fonts.Light,
    color: palette.red,
    fontSize: 12,
    backgroundColor: palette.white,
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingVertical: 5,
    height: 25,
  },
})

export default Error
