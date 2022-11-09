import React, { useState } from 'react'
import { Keyboard, StyleSheet } from 'react-native'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { MainStackParamList, UseInputStateReturnType } from '../../../types'
import { restoreWallet } from '../../../store/store'
import {
  Box,
  Pressable,
  Text,
  GRADIENT_COLORS,
  GRADIENT_STYLE,
  TextInput,
} from '../../../theme'
import {
  INPUT_OPACITY_ACTIVE,
  INPUT_OPACITY_INACTIVE,
  labelTranslateFn,
} from '../../../utils'
import { AppIcons, Fonts } from '../../../assets'
import { KeyboardAvoidingView } from '../../../components/keyboard-avoid-view'
import LinearGradient from 'react-native-linear-gradient'
import { useHeaderHeight } from '@react-navigation/elements'
import { scale } from 'react-native-size-matters'
import CheckBox from '../../../components/checkbox'

const { LogoFull } = AppIcons

type BackupLoginScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'BackupLoginScreen'
>
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)

  return { value, onChangeText: setValue }
}

const BackupLoginScreen = ({ navigation }: BackupLoginScreenProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userHasChecked, setUserHasChecked] = useState<boolean>(false)
  const headerHeight = useHeaderHeight()

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError(labelTranslateFn('passwordCreationScreen.password8char')!)
    } else if (!userHasChecked) {
      setError(labelTranslateFn('backupLoginScreen.pleaseCheckRisk')!)
    } else {
      Keyboard.dismiss()
      try {
        setLoading(true)
        await restoreWallet(passwordInput.value)
        navigation.navigate('BackupSeedScreen', {
          screenTitle: labelTranslateFn('backupLoginScreen.seedPhrase')!,
        })
      } catch (_error) {
        passwordInput.onChangeText('')
        setError(labelTranslateFn('loginScreen.invalidPassword')!)
        setLoading(false)
      }
    }
  }

  const handleCheckBox = () => {
    setUserHasChecked(!userHasChecked)
  }
  const passwordInputOpacity =
    error || passwordInput.value.length === 0
      ? INPUT_OPACITY_INACTIVE
      : INPUT_OPACITY_ACTIVE

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
            tx="backupLoginScreen.signInToSeedPhrase"
          />
        </Box>
        <Box flex={0.9} marginTop={'xxl'}>
          <Box flex={0.5} justifyContent="center">
            <Text variant="mainInputLabel" tx="backupLoginScreen.password" />
            <TextInput
              variant={'passwordInputs'}
              onChangeText={passwordInput.onChangeText}
              onFocus={() => {
                setError('')
              }}
              value={passwordInput.value}
              autoCorrect={false}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={onUnlock}
              style={{
                opacity: passwordInputOpacity,
              }}
            />
            {error ? (
              <Box
                marginTop="m"
                borderRadius={5}
                padding={'s'}
                alignSelf="flex-start"
                backgroundColor={'semiTransparentWhite'}>
                <Text padding={'s'} color={'danger'}>
                  {error}
                </Text>
              </Box>
            ) : (
              <Box marginTop={'m'} padding={'s'} alignSelf="flex-start">
                <Text padding={'s'} />
              </Box>
            )}
          </Box>
        </Box>
        <CheckBox
          selected={userHasChecked}
          onPress={handleCheckBox}
          textStyle={styles.checkBoxText}
          style={styles.checkBoxStyle}
          text={{ tx: 'backupLoginScreen.iHavePrivacyUnderstand' }}
        />
        <Box marginTop={'l'}>
          <Pressable
            label={{ tx: 'common.continue' }}
            onPress={onUnlock}
            isLoading={loading}
            variant="outline"
            icon
            disabled={passwordInput.value.trim().length < 8}
          />
        </Box>
        <Box marginTop={'xl'} alignItems="center">
          <Text
            opacity={0.8}
            variant={'whiteLabel'}
            tx="common.cancel"
            onPress={navigation.goBack}
          />
        </Box>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  checkBoxText: {
    fontFamily: Fonts.Regular,
    fontWeight: '600',
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
  checkBoxStyle: {
    marginTop: 50,
  },
})
export default BackupLoginScreen
