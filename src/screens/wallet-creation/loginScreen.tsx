import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList, UseInputStateReturnType } from '../../types'
import Header from '../header'
import { restoreWallet } from '../../store/store'
import { useDispatch } from 'react-redux'
import { onOpenSesame } from '../../utils'
import Text from '../../theme/text'
import Button from '../../theme/button'
import Box from '../../theme/box'

type LoginScreenProps = StackScreenProps<RootStackParamList, 'LoginScreen'>
const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const PASSWORD_LENGTH = 8
  const passwordInput = useInputState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError('Passwords must be at least 8 characters')
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
        navigation.navigate('MainNavigator')
      })
    }
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
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
              <Text variant="slogan1">one</Text>
              <Text variant="slogan2">wallet</Text>
              <Text variant="slogan1">all chains</Text>
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
            {!!error && <Text variant="error">{error}</Text>}
          </Box>
          <Box flex={0.3} width="90%" justifyContent="flex-end">
            <View style={styles.forgotPassword}>
              <Text variant="description">Forgot password? </Text>
              <Text
                variant="description"
                onPress={() => navigation.navigate('WalletImportNavigator')}>
                Import with seed phrase
              </Text>
            </View>
            <Button
              type="primary"
              variant="l"
              label="Unlock"
              isLoading={loading}
              onPress={onUnlock}
              isBorderless
              isActive={!!passwordInput.value}
            />
            <Button
              type="primary"
              variant="l"
              label="Open Sesame"
              isLoading={loading}
              onPress={async () => {
                setLoading(true)
                await onOpenSesame(dispatch, navigation)
              }}
              isBorderless
              isActive={true}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </ImageBackground>
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
    color: '#FFF',
    borderBottomColor: '#38FFFB',
    borderBottomWidth: 1,
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default LoginScreen
