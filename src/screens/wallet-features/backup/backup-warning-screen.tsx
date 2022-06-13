import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Eye from '../../../assets/icons/eye.svg'
import Button from '../../../theme/button'

const BackupWarningScreen = ({}) => {
  const navigation = useNavigation()

  const handleBackupSeedBtnPress = useCallback(() => {
    navigation.navigate('BackupLoginScreen', {
      backupSeed: true,
      screenTitle: 'Sign in',
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Text style={styles.warningBackupSeedTitle}>Show Seed Phrase?</Text>
      <Text style={styles.warningBackupSeedSubtitle}>
        Anyone who has this seed phrase can steal your funds.
      </Text>
      <View style={styles.eyeIcon}>
        <Eye />
        <Text style={styles.warningBackupSeedNoCamera}>
          View it in private without any cameras around.
        </Text>
      </View>
      <View style={styles.actionBlock}>
        <Button
          style={styles.btn}
          type="secondary"
          variant="m"
          label="Cancel"
          onPress={navigation.goBack}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label="I have privacy"
          onPress={handleBackupSeedBtnPress}
          isBorderless={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  eyeIcon: {
    alignItems: 'center',
  },
  btn: {
    marginRight: 30,
    marginLeft: 30,
  },
  actionBlock: {
    flex: 1.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
  },
  warningBackupSeedTitle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 35,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  warningBackupSeedSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 70,
  },
  warningBackupSeedNoCamera: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 70,
    width: '70%',
  },
})

export default BackupWarningScreen
