import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ProgressCircle = ({
  size,
  completed,
  color = '#D5D8DD',
  secondaryColor = '#2CD2CF',
}: {
  size: number
  completed: 1 | 2 | 3
  color: string
  secondaryColor: string
}): React.ReactElement => {
  const { progressCircle, text } = StyleSheet.create({
    progressCircle: {
      width: size,
      height: size,
      borderWidth: 1,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: color,
      borderLeftColor: completed >= 1 ? secondaryColor : color,
      borderBottomColor: completed >= 2 ? secondaryColor : color,
      borderRightColor: completed >= 3 ? secondaryColor : color,
      borderTopColor: completed >= 3 ? secondaryColor : color,
    },
    text: {
      fontSize: 11,
      fontWeight: '500',
      fontFamily: 'Montserrat-Regular',
      textAlign: 'center',
    },
  })

  return (
    <View style={progressCircle}>
      <Text style={text}>{completed}/3</Text>
    </View>
  )
}

export default ProgressCircle
