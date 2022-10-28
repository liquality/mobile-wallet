import React, { useState } from 'react'
import {
  Box,
  GRADIENT_STYLE,
  Text,
  GRADIENT_COLORS,
  Pressable,
  TextInput,
} from '../../theme'
import { KeyboardAvoidingView } from '../../components/keyboard-avoid-view'
import LinearGradient from 'react-native-linear-gradient'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import { MainStackParamList, UseInputStateReturnType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useHeaderHeight } from '@react-navigation/elements'
import {
  INPUT_OPACITY_ACTIVE,
  INPUT_OPACITY_INACTIVE,
  labelTranslateFn,
} from '../../utils'
import { restoreWallet } from '../../store/store'
import { CommonActions } from '@react-navigation/native'
import { useRecoilValue } from 'recoil'
import { networkState } from '../../atoms'
import { Keyboard } from 'react-native'

const { LogoFull, OneWalletAllChains } = AppIcons

type LoginScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'LoginScreen'
>

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const PASSWORD_LENGTH = 8

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const headerHeight = useHeaderHeight()
  const passwordInput = useInputState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const activeNetwork = useRecoilValue(networkState)

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError(labelTranslateFn('passwordCreationScreen.password8char')!)
    } else {
      try {
        Keyboard.dismiss()
        setLoading(true)
        await restoreWallet(passwordInput.value, activeNetwork)
        setLoading(false)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainNavigator' }],
          }),
        )
      } catch (_error) {
        setLoading(false)
        passwordInput.onChangeText('')
        setError(labelTranslateFn('loginScreen.invalidPassword')!)
        Keyboard.dismiss()
      }
    }
  }

  const passwordInputOpacity =
    error || passwordInput.value.length === 0
      ? INPUT_OPACITY_INACTIVE
      : INPUT_OPACITY_ACTIVE

  return (
    <KeyboardAvoidingView>
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={[GRADIENT_STYLE, { paddingTop: headerHeight }]}>
        <LogoFull width={scale(100)} />
        <Box flex={0.9}>
          <Box marginTop="xl">
            <OneWalletAllChains width={scale(175)} />
          </Box>
          <Box flex={0.5} justifyContent="center">
            <Text variant="mainInputLabel" tx="loginScreen.password" />
            <TextInput
              variant={'passwordInputs'}
              onChangeText={passwordInput.onChangeText}
              onFocus={() => {
                setError('')
              }}
              value={passwordInput.value}
              secureTextEntry
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={onUnlock}
              style={{ opacity: passwordInputOpacity }}
            />
            {error.length ? (
              <Box
                marginTop="m"
                borderRadius={5}
                padding={'s'}
                alignSelf="flex-start"
                backgroundColor={'mainBackground'}>
                <Text
                  padding={'s'}
                  color={'danger'}
                  tx="loginScreen.passwordError"
                />
              </Box>
            ) : null}
          </Box>
        </Box>
        <Pressable
          label={{ tx: 'common.next' }}
          onPress={onUnlock}
          isLoading={loading}
          variant="outline"
          icon
          disabled={passwordInput.value.trim().length < 8}
        />
        <Box marginTop={'xl'} alignItems="center">
          <Text
            opacity={0.8}
            variant={'whiteLabel'}
            tx="common.forgotPassword"
          />
          <Text
            opacity={0.8}
            variant={'whiteLabel'}
            textDecorationLine={'underline'}
            tx="common.importWithSeedPhrase"
            marginTop={'s'}
            onPress={() =>
              navigation.navigate('TermsScreen', {
                previousScreen: 'LoginScreen',
                nextScreen: 'UnlockWalletScreen',
              })
            }
          />
        </Box>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
