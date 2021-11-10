import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import React, { FC } from 'react'

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
    fontFamily: 'Montserrat-Light',
    color: '#F12274',
    fontSize: 12,
    backgroundColor: '#FFF',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingVertical: 5,
    height: 25,
  },
})

export default Error
