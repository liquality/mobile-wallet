import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSignOut } from '@fortawesome/pro-light-svg-icons'
import { Pressable, StyleSheet } from 'react-native'
import React from 'react'

const SettingsHeaderRight: React.FC<{
  navigate: (screen: string) => void
}> = (props) => {
  return (
    <Pressable
      style={styles.signOutBtn}
      onPress={() => props.navigate('LoginScreen')}>
      <FontAwesomeIcon
        icon={faSignOut}
        size={20}
        color={'#5F5F5F'}
        style={styles.icon}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginVertical: 5,
  },
  signOutBtn: {
    marginRight: 20,
  },
})

export default SettingsHeaderRight
