import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  TextInput,
} from 'react-native'

import { RootStackParamList } from '../types'
import { StackScreenProps } from '@react-navigation/stack'

type PasswordCreationProps = StackScreenProps<
  RootStackParamList,
  'PasswordCreationScreen'
>

interface CustomUseInputStateReturnType<T> {
  value: T
  onChangeText:
    | Dispatch<SetStateAction<T>>
    | Dispatch<SetStateAction<T | undefined>>
  reset: Dispatch<SetStateAction<T>>
}

const useInputState = (
  initialValue: string,
): CustomUseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue, reset: setValue }
}

const PasswordCreationScreen = ({ navigation }: PasswordCreationProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const passwordConfirmationInput = useInputState('')
  const [error, setError] = useState('')

  const resetInput = () => {
    if (!!error && !!passwordInput.value) {
      setError('')
      passwordInput.reset('')
      passwordConfirmationInput.reset('')
    }
  }

  const arePasswordsValid = () => {
    const isError =
      !!passwordConfirmationInput.value &&
      !!passwordInput.value &&
      passwordInput.value === passwordConfirmationInput.value &&
      passwordInput.value.trim().length >= PASSWORD_LENGTH
    if (!isError) {
      setError("Passwords don't match")
    }
    return isError
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <View style={styles.header}>
        <Image
          style={styles.headerLogo}
          source={require('../assets/icons/logo-small.png')}
        />
        <Text style={styles.headerText}>liquality</Text>
        <Text style={styles.headerText}>Wallet</Text>
      </View>
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Create Password</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>
            CHOOSE PASSWORD (at least 8 characters){' '}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={passwordInput.onChangeText}
            onFocus={resetInput}
            value={passwordInput.value}
            secureTextEntry
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            style={styles.input}
            onChangeText={passwordConfirmationInput.onChangeText}
            onFocus={resetInput}
            value={passwordConfirmationInput.value}
            secureTextEntry
            autoCorrect={false}
          />
        </View>
        {!!error && <Text style={styles.error}>Passwords don't match</Text>}
        {!!error && (
          <Text style={styles.errorHint}>
            Passwords must be at least 8 characters
          </Text>
        )}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={() => navigation.navigate('Entry')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.nextBtn]}
          onPress={() =>
            arePasswordsValid() &&
            navigation.navigate('WalletBackupScreen', {
              password: passwordInput.value,
            })
          }>
          <Text style={styles.nextText}>Next</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'orange',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 84,
    height: 30,
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 27,
  },
  prompt: {
    marginTop: 62,
    alignItems: 'center',
  },
  promptText: {
    color: '#fff',
    fontSize: 28,
  },
  inputs: {
    marginHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 30,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  actions: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#F8FAFF',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    width: 152,
    height: 36,
  },
  cancelBtn: {
    backgroundColor: '#F8FAFF',
    borderColor: '#9D4DFA',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9D4DFA',
  },
  nextBtn: {
    backgroundColor: '#9D4DFA',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    marginLeft: 10,
  },
  nextText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFF',
  },
  error: {
    color: '#F12274',
    fontSize: 12,
    backgroundColor: '#FFF',
    textAlignVertical: 'center',
    marginTop: 5,
    paddingLeft: 5,
    paddingVertical: 5,
    height: 25,
  },
  errorHint: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 20,
  },
})
export default PasswordCreationScreen
