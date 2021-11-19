import React, { FC } from 'react'
import { StyleSheet, Text } from 'react-native'

type LabelProps = {
  text: string
}
const Label: FC<LabelProps> = (props) => {
  const { text } = props
  const styles = StyleSheet.create({
    font: {
      fontFamily: 'Montserrat-Regular',
    },
    default: {
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 18,
    },
    spacing: {
      marginVertical: 5,
    },
  })

  return (
    <Text style={[styles.font, styles.default, styles.spacing]}>{text}</Text>
  )
}

export default Label
