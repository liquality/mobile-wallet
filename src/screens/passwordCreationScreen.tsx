import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  TextInput,
} from 'react-native'

import { RootStackParamList } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
import { ThemeContext } from '../theme'
import ScreenHeader from './screenHeader'

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

const PasswordCreationScreen = ({
  route,
  navigation,
}: PasswordCreationProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const passwordConfirmationInput = useInputState('')
  const [error, setError] = useState('')
  const theme = useContext(ThemeContext)

  const resetInput = () => {
    if (error) {
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
      <ScreenHeader />
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Create Password</Text>
        <View style={styles.inputs}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>
              CHOOSE PASSWORD (at least 8 characters)
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
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={() =>
            navigation.navigate(route.params.nextScreen || 'Entry')
          }>
          <Text style={[theme.buttonText, styles.cancelText]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[
            styles.actionBtn,
            styles.nextBtn,
            (!passwordInput.value || !passwordConfirmationInput.value) &&
              styles.disabled,
          ]}
          disabled={!passwordInput.value || !passwordConfirmationInput.value}
          onPress={() =>
            arePasswordsValid() &&
            navigation.navigate(route.params.nextScreen || 'Entry', {
              ...route.params,
              password: passwordInput.value,
            })
          }>
          <Text style={[theme.buttonText, styles.nextText]}>Next</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  prompt: {
    flex: 1,
    marginTop: 62,
    alignItems: 'center',
  },
  promptText: {
    fontFamily: 'Montserrat-Regular',
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
    marginTop: 5,
    color: '#FFF',
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
    color: '#9D4DFA',
  },
  nextBtn: {
    backgroundColor: '#9D4DFA',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    marginLeft: 10,
  },
  nextText: {
    color: '#F8FAFF',
  },
  disabled: {
    opacity: 0.5,
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
