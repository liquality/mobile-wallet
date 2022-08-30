import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import Eye from '../../../assets/icons/eye.svg'
import Button from '../../../theme/button'
import Text from '../../../theme/text'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types'
import { labelTranslateFn } from '../../../utils'

const BackupWarningScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'BackupWarningScreen'>
> = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const handleBackupSeedBtnPress = useCallback(() => {
    // navigation.navigate('BackupLoginScreen', {
    //   backupSeed: true,
    //   screenTitle: labelTranslateFn('backupWarningScreen.signIn')!,
    // })
    console.log('U PRESSED')
  }, [navigation])

  return (
    <View style={styles.container}>
      <Text
        style={styles.warningBackupSeedTitle}
        tx="backupWarningScreen.showSeedPhrase"
      />

      <Button
        type="primary"
        variant="m"
        label="I got it"
        onPress={handleBackupSeedBtnPress}
        isBorderless={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(192,192,192,0.6)',
    padding: 15,
    position: 'absolute',
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
})

export default BackupWarningScreen
