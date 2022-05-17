import React, { FC } from 'react'
import { StyleSheet } from 'react-native'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Box from '../../theme/box'
import Text from '../../theme/text'

type WarningProps = {
  text1: string
  text2: string
  icon: IconDefinition
}

const Warning: FC<WarningProps> = (props) => {
  const { text1, text2, icon } = props

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-end"
      marginVertical="m"
      paddingHorizontal="xl">
      <FontAwesomeIcon
        icon={icon}
        size={15}
        color="#9C55F6"
        style={styles.icon}
      />
      <Text variant="warningBold">
        {text1} <Text variant="warningLight">{text2}</Text>
      </Text>
    </Box>
  )
}

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'flex-start',
    marginRight: 5,
  },
})

export default Warning
