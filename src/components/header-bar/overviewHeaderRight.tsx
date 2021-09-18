import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'

const OverviewHeaderRight = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.connectDappBtn}>
        <FontAwesomeIcon icon={faCircle} size={24} />
      </Pressable>
      <Pressable style={styles.menuBtn}>
        <FontAwesomeIcon icon={faEllipsisV} size={24} />
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
    // borderWidth: 1,
  },
})

export default OverviewHeaderRight
