import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import Button from '../../../theme/button'
import { RootStackParamList } from '../../../types'
import Eye from '../../../assets/icons/eye.svg'

type BackupSeedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BackupSeedScreen'
>

const BackupSeedScreen = ({ navigation }: BackupSeedScreenProps) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.headerBackground}
        source={require('../../../assets/bg/bg.png')}>
        <View style={styles.eyeIcon}>
          <Eye width={150} height={150} />
        </View>
        <Text style={styles.headerTitle}>Your Seed Phrase</Text>
        <Text style={styles.headerSubtitle}>
          Write it down, verify it and store it securely. {'\n'} It is the only
          way to restore your wallet.
        </Text>
      </ImageBackground>
      <View style={styles.actionBlock}>
        <Button
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
          label="I saved the seed"
          onPress={async () => {
            navigation.navigate('MainNavigator')
          }}
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
  },
  eyeIcon: {
    marginTop: 10,
    alignItems: 'center',
  },
  headerBackground: {
    justifyContent: 'center',
    width: '100%',
    height: 255,
    alignItems: 'center',
    paddingBottom: 10,
  },
  actionBlock: {
    flex: 0.95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 15,
  },
  headerTitle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 28,
    color: '#FFF',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 5,
    lineHeight: 28,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
    padding: 15,
    lineHeight: 25,
  },
})
export default BackupSeedScreen
