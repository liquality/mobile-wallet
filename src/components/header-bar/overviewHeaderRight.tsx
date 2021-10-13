import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons'
import { faCircle } from '@fortawesome/pro-duotone-svg-icons'

const OverviewHeaderRight = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.connectDappBtn}>
        <FontAwesomeIcon
          secondaryColor={'#007AFF'}
          color={'#D5D8DD'}
          icon={faCircle}
          size={25}
        />
      </Pressable>
      <Pressable style={styles.menuBtn}>
        <FontAwesomeIcon icon={faEllipsisV} size={25} />
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
  connectDappBtn: {
    marginRight: 25,
  },
  menuBtn: {
    marginRight: 20,
  },
})

export default OverviewHeaderRight
