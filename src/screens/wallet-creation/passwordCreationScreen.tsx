import React, { Dispatch, SetStateAction, useState } from 'react'
import { View, StyleSheet, ImageBackground, TextInput } from 'react-native'

import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Header from '../header'
import ButtonFooter from '../../components/button-footer'
import Button from '../../theme/button'
import Text from '../../theme/text'

type PasswordCreationProps = NativeStackScreenProps<
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
      source={require('../../assets/bg/bg.png')}>
      <Header showText={true} />
      <View style={styles.prompt}>
        <Text variant="mainInputLabel">Create Password</Text>
        <View style={styles.inputs}>
          <View style={styles.inputWrapper}>
            <Text variant="description">
              CHOOSE PASSWORD (at least 8 characters)
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={passwordInput.onChangeText}
              onFocus={resetInput}
              value={passwordInput.value}
              secureTextEntry
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text variant="mainInputLabel">CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.input}
              onChangeText={passwordConfirmationInput.onChangeText}
              onFocus={resetInput}
              value={passwordConfirmationInput.value}
              secureTextEntry
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          {!!error && <Text variant="error">Passwords don't match</Text>}
          <Text variant="error">Passwords must be at least 8 characters</Text>
        </View>
      </View>

      <ButtonFooter>
        <Button
          type="secondary"
          variant="m"
          label="Cancel"
          onPress={() =>
            navigation.navigate(route.params.nextScreen || 'Entry')
          }
          isBorderless
          isActive
        />
        <Button
          type="primary"
          variant="m"
          label="Next"
          onPress={() =>
            arePasswordsValid() &&
            navigation.navigate('LoadingScreen', {
              ...route.params,
              password: passwordInput.value,
            })
          }
          isBorderless
          isActive={!!passwordInput.value && !!passwordConfirmationInput.value}
        />
      </ButtonFooter>
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
  inputs: {
    marginHorizontal: 20,
  },
  inputWrapper: {
    marginTop: 30,
  },
  input: {
    marginTop: 5,
    color: '#FFF',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
    padding: 10,
  },
})
export default PasswordCreationScreen
