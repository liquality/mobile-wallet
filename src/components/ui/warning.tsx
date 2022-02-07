import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

type WarningProps = {
  text1: string
  text2: string
  icon: IconDefinition
}

const Warning: FC<WarningProps> = (props) => {
  const { text1, text2, icon } = props

  return (
    <View style={styles.container}>
      <FontAwesomeIcon
        icon={icon}
        size={15}
        color="#9C55F6"
        style={styles.icon}
      />
      <Text style={styles.warning}>
        {text1} <Text style={styles.text2}>{text2}</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  warning: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 16,
  },
  text2: {
    fontWeight: '300',
    paddingLeft: 5,
  },
  icon: {
    alignSelf: 'flex-start',
    marginRight: 5,
  },
})

export default Warning
