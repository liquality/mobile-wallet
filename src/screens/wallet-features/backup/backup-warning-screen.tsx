import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import { Text, Button, palette } from '../../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'
import { AppIcons, Fonts } from '../../../assets'

const { Eye } = AppIcons

const BackupWarningScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, 'BackupWarningScreen'>
> = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const handleBackupSeedBtnPress = useCallback(() => {
    navigation.navigate('BackupLoginScreen', {
      backupSeed: true,
      screenTitle: labelTranslateFn('backupWarningScreen.signIn')!,
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <Text
        style={styles.warningBackupSeedTitle}
        tx="backupWarningScreen.showSeedPhrase"
      />
      <Text
        style={styles.warningBackupSeedSubtitle}
        tx="backupWarningScreen.anyoneWhoSeed"
      />
      <View style={styles.eyeIcon}>
        <Eye />
        <Text
          style={styles.warningBackupSeedNoCamera}
          tx="backupWarningScreen.viewItPrivate"
        />
      </View>
      <View style={styles.actionBlock}>
        <Button
          style={styles.btn}
          type="secondary"
          variant="m"
          label={{ tx: 'common.cancel' }}
          onPress={() => {
            navigation.navigate('SettingsScreen', {})
          }}
          isBorderless={false}
          isActive={true}
        />
        <Button
          type="primary"
          variant="m"
          label={{ tx: 'backupWarningScreen.iHavePrivacy' }}
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
    backgroundColor: palette.white,
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
    fontFamily: Fonts.Regular,
    color: 'black',
    fontWeight: '600',
    fontSize: 35,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  warningBackupSeedSubtitle: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 70,
  },
  warningBackupSeedNoCamera: {
    fontFamily: Fonts.Regular,
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 70,
    width: '70%',
  },
})

export default BackupWarningScreen
