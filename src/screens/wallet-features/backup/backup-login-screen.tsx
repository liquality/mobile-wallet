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
import { useDispatch } from 'react-redux'
import Text from '../../../theme/text'
import Button from '../../../theme/button'
import Box from '../../../theme/box'
import { MNEMONIC, PASSWORD } from '@env'
import CheckBox from '../../../components/checkbox'
import GradientBackground from '../../../components/gradient-background'

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

  const dispatch = useDispatch()

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError('Passwords must be at least 8 characters')
    } else if (!userHasChecked) {
      setError('Please check that you understand the risks')
    } else {
      setLoading(true)
      //TODO find a better way to handle threads
      restoreWallet(passwordInput.value).then((walletState) => {
        dispatch({
          type: 'RESTORE_WALLET',
          payload: {
            ...walletState,
          },
        })
        setLoading(false)
        navigation.navigate('BackupSeedScreen', {
          screenTitle: 'Seed Phrase',
        })
      })
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
              <Text variant="loginToSeePhraseTitle">
                Sign-in {'\n'} to see Seed Phrase
              </Text>
            </Box>

            <View style={styles.inputWrapper}>
              <Text variant="mainInputLabel">PASSWORD</Text>
              <TextInput
                style={styles.input}
                onChangeText={passwordInput.onChangeText}
                onFocus={() => setError('')}
                value={passwordInput.value}
                secureTextEntry
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>
            {!!error && <Text variant="errorLight">{error}</Text>}
          </Box>
          <CheckBox
            selected={userHasChecked}
            onPress={handleCheckBox}
            textStyle={styles.checkBoxText}
            style={styles.checkBoxStyle}
            text="I have privacy and understand the risk."
          />
          <Box flex={0.3} width="90%" justifyContent="flex-end">
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
                label="Continue"
                isLoading={loading}
                onPress={onUnlock}
                isBorderless={false}
                isActive={!!passwordInput.value}
              />
            </View>
            <Button
              type="primary"
              variant="l"
              label="Open Sesame"
              isLoading={loading}
              onPress={async () => {
                if (userHasChecked) {
                  setLoading(true)
                  await createWallet(PASSWORD, MNEMONIC)
                  navigation.navigate('BackupSeedScreen', {
                    screenTitle: 'Seed Phrase',
                  })
                } else setError('Please check that you understand the risks')
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
