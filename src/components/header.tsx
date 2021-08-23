import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.header} testID="header-view">
      <Text style={styles.headerTitle}>Liquality</Text>
      <View style={styles.subHeader}>
        <Pressable
          style={styles.headerIcon}
          onPress={() => Alert.alert('Notification')}>
          <Image source={require('../assets/icons/bell.png')} />
        </Pressable>
        <Pressable style={styles.headerIcon} onPress={() => Alert.alert('Box')}>
          <Image source={require('../assets/icons/box.png')} />
        </Pressable>
        <Pressable
          style={styles.headerIcon}
          onPress={() => Alert.alert('Settings')}>
          <Image source={require('../assets/icons/settings.png')} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 15,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerIcon: {
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
})

export default Header
