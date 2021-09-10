import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
  TextInput,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import Logo from '../assets/icons/logo.svg'
import { RootStackParamList, UseInputStateReturnType } from '../types'
import { ThemeContext } from '../theme'

type LoginScreenProps = StackScreenProps<RootStackParamList, 'LoginScreen'>
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const PASSWORD_LENGTH = 8
  const theme = useContext(ThemeContext)
  const passwordInput = useInputState('')
  const [error, setError] = useState('')

  const onUnlock = () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError('Passwords must be at least 8 characters')
    } else {
      navigation.navigate('Entry')
    }
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <View style={styles.header}>
        <Logo width={135} height={83} />
        <Text style={styles.logoText}>liquality</Text>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.description}>
          <Text style={styles.descriptionTitle}>Wallet</Text>
          <Text style={styles.descriptionDetails}>ONE WALLET,</Text>
          <Text style={styles.descriptionDetails}>ALL CHAINS</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            onChangeText={passwordInput.onChangeText}
            onFocus={() => setError('')}
            value={passwordInput.value}
            secureTextEntry
            autoCorrect={false}
          />
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password? </Text>
          <Text
            style={styles.forgotPasswordText}
            onPress={() => Alert.alert('Import wallet flow')}>
            Import with seed phrase
          </Text>
        </View>
        <Pressable
          style={[styles.createBtn, styles.createBtn]}
          onPress={onUnlock}>
          <Text style={[theme.buttonText, styles.createText]}>Unlock</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flex: 0.3,
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 135,
    height: 83,
    marginBottom: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '300',
    lineHeight: 27,
    letterSpacing: 3,
  },
  contentWrapper: {
    flex: 0.5,
    width: '100%',
  },
  description: {
    alignItems: 'center',
  },
  descriptionTitle: {
    fontFamily: 'MontserratAlternates-Light',
    color: '#FFFFFF',
    fontSize: 55,
    marginBottom: 5,
  },
  descriptionDetails: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 5,
  },
  inputWrapper: {
    width: '90%',
    marginTop: 30,
    marginHorizontal: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    marginTop: 5,
    color: '#FFF',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  actionContainer: {
    flex: 0.2,
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
  error: {
    fontFamily: 'Montserrat-Light',
    color: '#F12274',
    fontSize: 12,
    backgroundColor: '#FFF',
    textAlignVertical: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingVertical: 5,
    marginHorizontal: 20,
    height: 25,
  },
})
export default LoginScreen
