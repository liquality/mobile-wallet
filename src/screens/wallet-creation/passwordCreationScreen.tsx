import React, { Dispatch, SetStateAction, useState } from 'react'
import { Keyboard } from 'react-native'

import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Box,
  Text,
  GRADIENT_COLORS,
  GRADIENT_STYLE,
  TextInput,
  Pressable,
} from '../../theme'
import { KeyboardAvoidingView } from '../../components/keyboard-avoid-view'
import LinearGradient from 'react-native-linear-gradient'
import { AppIcons } from '../../assets'
import { useHeaderHeight } from '@react-navigation/elements'
import { scale } from 'react-native-size-matters'
import { INPUT_OPACITY_ACTIVE, INPUT_OPACITY_INACTIVE } from '../../utils'

const { LogoFull } = AppIcons

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
  const headerHeight = useHeaderHeight()

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

  const onPress = () => {
    Keyboard.dismiss()
    if (arePasswordsValid()) {
      navigation.navigate('LoadingScreen', {
        ...route.params,
        password: passwordInput.value,
      })
    }
  }

  let disabled = true
  const { value: passValue } = passwordInput
  const { value: passConfirmValue } = passwordConfirmationInput

  const passwordInputOpacity =
    error || passValue.length === 0
      ? INPUT_OPACITY_INACTIVE
      : INPUT_OPACITY_ACTIVE

  const passwordConfirmationInputOpacity =
    error || passConfirmValue.length === 0
      ? INPUT_OPACITY_INACTIVE
      : INPUT_OPACITY_ACTIVE

  if (
    passValue.trim().length >= PASSWORD_LENGTH &&
    passConfirmValue.trim().length >= PASSWORD_LENGTH &&
    passValue === passConfirmValue
  ) {
    disabled = false
  }

  return (
    <KeyboardAvoidingView enabled={false}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={[GRADIENT_STYLE, { paddingTop: headerHeight }]}>
        <LogoFull width={scale(100)} />
        <Box marginTop="xl">
          <Text
            variant="h1"
            color={'white'}
            tx="passwordCreationScreen.createPassword"
          />
        </Box>
        <Box flex={0.9} marginTop={'xxl'}>
          <Box>
            <Text variant="mainInputLabel" tx="loginScreen.password" />
            <TextInput
              variant={'passwordInputs'}
              onChangeText={passwordInput.onChangeText}
              onFocus={resetInput}
              value={passwordInput.value}
              secureTextEntry
              autoCorrect={false}
              style={{
                opacity: passwordInputOpacity,
                lineHeight: scale(1.3 * 15),
                height: scale(1.3 * 15),
              }}
            />
          </Box>
          <Box marginTop={'xxl'}>
            <Text
              variant="mainInputLabel"
              tx="passwordCreationScreen.confirmPassword"
            />
            <TextInput
              variant={'passwordInputs'}
              onChangeText={passwordConfirmationInput.onChangeText}
              onFocus={resetInput}
              value={passwordConfirmationInput.value}
              secureTextEntry
              autoCorrect={false}
              returnKeyType="done"
              style={{
                opacity: passwordConfirmationInputOpacity,
                lineHeight: scale(1.3 * 15),
                height: scale(1.3 * 15),
              }}
              onSubmitEditing={onPress}
            />
            {error.length ? (
              <Box
                marginTop="m"
                borderRadius={5}
                padding={'s'}
                alignSelf="flex-start"
                backgroundColor={'mainBackground'}>
                <Text color={'danger'} tx="loginScreen.passwordError" />
              </Box>
            ) : null}
          </Box>
          {!error.length ? (
            <Text
              marginTop={'s'}
              opacity={0.6}
              variant={'hintLabel'}
              tx="passwordCreationScreen.password8char"
            />
          ) : null}
        </Box>
        <Pressable
          label={{ tx: 'common.next' }}
          onPress={onPress}
          variant="outline"
          icon
          disabled={disabled}
        />
        <Box
          marginTop={'s'}
          alignItems="center"
          paddingHorizontal={'onboardingPadding'}>
          <Text
            opacity={0.8}
            textAlign={'center'}
            variant={'whiteLabel'}
            tx="passwordCreationScreen.orImportWallet"
            marginTop={'m'}
            onPress={() =>
              navigation.navigate('TermsScreen', {
                previousScreen: 'PasswordCreationScreen',
                nextScreen: 'UnlockWalletScreen',
              })
            }
          />
        </Box>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default PasswordCreationScreen
