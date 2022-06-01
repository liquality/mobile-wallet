import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Eye from '../../../assets/icons/eye.svg'
import Button from '../../../theme/button'

const BackupWarningScreen = ({}) => {
  const navigation = useNavigation()

  const handleBackupSeedBtnPress = () => {
    navigation.navigate('BackupLoginScreen', {
      backupSeed: true,
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.warningBackupSeedTitle}>Show Seed Phrase?</Text>
      <Text style={styles.warningBackupSeedSubtitle}>
        Anyone who has this seed phrase can steal your funds.
      </Text>
      <Eye />

      <Text style={styles.warningBackupSeedNoCamera}>
        View it in private without any cameras around.
      </Text>
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
    alignItems: 'center',
    padding: 15,
  },
  btn: {
    marginRight: 30,
    marginLeft: 30,
  },
  actionBlock: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  warningBackupSeedTitle: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontWeight: '600',
    fontSize: 35,
    textAlign: 'center',
    marginVertical: 'l',
    marginTop: 20,
    marginBottom: 10,
  },
  warningBackupSeedSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 'l',
    marginBottom: 70,
  },
  warningBackupSeedNoCamera: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 'l',
    marginTop: 70,
    width: '70%',
  },
})

export default BackupWarningScreen
