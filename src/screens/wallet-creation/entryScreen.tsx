import React, { useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import { ThemeContext } from '../../theme'
import Header from '../header'

type EntryProps = StackScreenProps<RootStackParamList, 'Entry'>

const Entry = ({ navigation }: EntryProps) => {
  const theme = useContext(ThemeContext)

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
      <Header width={135} height={83} style={styles.header} showText={false} />
      <View style={styles.description}>
        <Text style={styles.description1}>one</Text>
        <Text style={styles.description2}>wallet</Text>
        <Text style={styles.description1}>all chains</Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password? </Text>
          <Text
            style={styles.forgotPasswordText}
            onPress={() => navigation.navigate('WalletImportNavigator')}>
            Import with seed phrase
          </Text>
        </View>
        <Pressable
          style={[styles.createBtn, styles.createBtn]}
          onPress={() => navigation.navigate('TermsScreen')}>
          <Text style={[theme.buttonText, styles.createText]}>
            Create a new Wallet
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flex: 0.3,
  },
  description: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  description1: {
    fontFamily: 'Montserrat-Light',
    color: '#FFFFFF',
    fontSize: 24,
  },
  description2: {
    fontFamily: 'MontserratAlternates-Light',
    color: '#FFFFFF',
    fontSize: 55,
    marginVertical: 15,
  },
  actionContainer: {
    flex: 0.3,
    width: '90%',
    justifyContent: 'flex-end',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  createBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    height: 36,
    backgroundColor: '#9D4DFA',
    borderColor: '#9D4DFA',
    marginVertical: 20,
  },
  createText: {
    color: '#FFFFFF',
  },
})
export default Entry
