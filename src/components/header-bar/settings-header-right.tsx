import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { AppIcons } from '../../assets'

const { SignOut } = AppIcons

type SettingsHeaderRightPropsType = {
  navigate: (screen: string) => void
}

const SettingsHeaderRight: React.FC<SettingsHeaderRightPropsType> = (props) => {
  return (
    <Pressable
      style={styles.signOutBtn}
      onPress={() => props.navigate('LoginScreen')}>
      <SignOut width={40} height={40} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  signOutBtn: {
    marginRight: 20,
  },
})

export default SettingsHeaderRight
