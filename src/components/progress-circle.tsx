import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Check from '../assets/icons/swap-check.svg'

const ProgressCircle = ({
  size,
  completed,
  total,
  color = '#D5D8DD',
  secondaryColor = '#2CD2CF',
}: {
  size: number
  completed: 1 | 2 | 3
  total: number
  color: string
  secondaryColor: string
}): React.ReactElement => {
  const styles = StyleSheet.create({
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
      borderRightColor: completed >= total ? secondaryColor : color,
      borderTopColor: completed >= total ? secondaryColor : color,
    },
    text: {
      fontSize: 11,
      fontWeight: '500',
      fontFamily: 'Montserrat-Regular',
      textAlign: 'center',
    },
  })

  return (
    <View style={styles.progressCircle}>
      {completed === total ? (
        <Check width={20} height={20} fill={'#2CD2CF'} />
      ) : (
        <Text style={styles.text}>
          {completed}/{total}
        </Text>
      )}
    </View>
  )
}

export default ProgressCircle
