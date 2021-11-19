import React, { FC } from 'react'
import { StyleSheet, Text } from 'react-native'

type LabelProps = {
  text: string
  variant: 'light' | 'strong'
}
const Label: FC<LabelProps> = (props) => {
  const { text, variant } = props
  const styles = StyleSheet.create({
    font: {
      fontFamily: 'Montserrat-Regular',
    },
    light: {
      color: '#646F85',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 18,
    },
    strong: {
      fontWeight: '700',
      fontSize: 12,
      lineHeight: 18,
    },
    spacing: {
      marginVertical: 5,
      marginRight: 5,
    },
  })

  return (
    <Text style={[styles.font, styles[variant], styles.spacing]}>{text}</Text>
  )
}

export default Label
