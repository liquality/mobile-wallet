import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/pro-light-svg-icons'

const OverviewHeaderRight = ({
  onPress,
}: {
  onPress: () => void
}): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.menuBtn} onPress={onPress}>
        <FontAwesomeIcon icon={faBars} size={25} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtn: {
    marginRight: 20,
  },
})

export default OverviewHeaderRight
