import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, UseInputStateReturnType } from '../../../types'
import Header from '../../header'
import { createWallet, restoreWallet } from '../../../store/store'
import Text from '../../../theme/text'
import Button from '../../../theme/button'
import Box from '../../../theme/box'
import { MNEMONIC, PASSWORD } from '@env'
import CheckBox from '../../../components/checkbox'
import GradientBackground from '../../../components/gradient-background'
import { labelTranslateFn } from '../../../utils'

type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginScreen'
>
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)

  return { value, onChangeText: setValue }
}

const BackupLoginScreen = ({ navigation }: LoginScreenProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [userHasChecked, setUserHasChecked] = useState<boolean>(false)

  const textInputRef = React.useRef<TextInput>(null)

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError('Passwords must be at least 8 characters')
    } else if (!userHasChecked) {
      setError('Please check that you understand the risks')
    } else {
      try {
        setLoading(true)
        await restoreWallet(passwordInput.value)
        navigation.navigate('BackupSeedScreen', {
          screenTitle: labelTranslateFn('backupLoginScreen.seedPhrase')!,
        })
      } catch (_error) {
        passwordInput.onChangeText('')
        setError(labelTranslateFn('loginScreen.invalidPassword')!)
        textInputRef.current?.blur()
        setLoading(false)
      }
    }
  }

  const handleCheckBox = () => {
    setUserHasChecked(!userHasChecked)
  }

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={styles.keyboard}>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          width={Dimensions.get('window').width}>
          <Header showText={true} />
          <Box flex={0.6} justifyContent="space-around" width="100%">
            <Box alignItems="center">
              <Text
                variant="loginToSeePhraseTitle"
                tx="backupLoginScreen.signInToSeedPhrase"
              />
            </Box>

            <View style={styles.inputWrapper}>
              <Text variant="mainInputLabel" tx="backupLoginScreen.password" />
              <TextInput
                style={styles.input}
                onChangeText={passwordInput.onChangeText}
                onFocus={() => setError('')}
                value={passwordInput.value}
                secureTextEntry
                autoCorrect={false}
                returnKeyType="done"
                ref={textInputRef}
              />
            </View>
            {!!error && <Text variant="error">{error}</Text>}
          </Box>
          <CheckBox
            selected={userHasChecked}
            onPress={handleCheckBox}
            textStyle={styles.checkBoxText}
            style={styles.checkBoxStyle}
            text={{ tx: 'backupLoginScreen.iHavePrivacyUnderstand' }}
          />
          <Box flex={0.3} width="90%" justifyContent="flex-end">
            <View style={styles.actionBlock}>
              <Button
                type="secondary"
                variant="m"
                label={{ tx: 'common.cancel' }}
                onPress={navigation.goBack}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label={{ tx: 'common.continue' }}
                isLoading={loading}
                onPress={onUnlock}
                isBorderless={false}
                isActive={!!passwordInput.value}
              />
            </View>
            <Button
              type="primary"
              variant="l"
              label={{ tx: 'common.openSesame' }}
              isLoading={loading}
              onPress={async () => {
                if (userHasChecked) {
                  setLoading(true)
                  await createWallet(PASSWORD, MNEMONIC)
                  navigation.navigate('BackupSeedScreen', {
                    screenTitle: labelTranslateFn(
                      'backupLoginScreen.seedPhrase',
                    )!,
                  })
                } else
                  setError(
                    labelTranslateFn('backupLoginScreen.pleaseCheckRisk')!,
                  )
              }}
              isBorderless
              isActive={true}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputWrapper: {
    width: '90%',
    marginHorizontal: 20,
  },
  input: {
    marginTop: 5,
    padding: 10,
    color: '#FFF',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBlock: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  checkBoxText: {
    fontFamily: 'Montserrat-Regular',
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
