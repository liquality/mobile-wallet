import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList, UseInputStateReturnType } from '../../types'
import { ThemeContext } from '../../theme'
import Header from '../header'
import {
  fetchFiatRatesForAssets,
  openSesame,
  restoreWallet,
  updateAddressesAndBalances,
} from '../../store'
import { useDispatch } from 'react-redux'

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
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const onUnlock = async () => {
    if (!passwordInput.value || passwordInput.value.length < PASSWORD_LENGTH) {
      setError('Passwords must be at least 8 characters')
    } else {
      setLoading(true)
      //TODO find a better way to handle threads
      setTimeout(async () => {
        const { type = '', payload = {} } = await dispatch(
          restoreWallet(passwordInput.value),
        )
        await dispatch(updateAddressesAndBalances())

        await dispatch(fetchFiatRatesForAssets())
        setLoading(false)
        if (!type) {
          setError('Please try again')
        } else if (type === 'ERROR') {
          setError(payload.errorMessage)
        } else {
          navigation.navigate('MainNavigator')
        }
      }, 1000)
    }
  }

  // To make testing easier for team members
  const onOpenSesame = async () => {
    'worklet'
    const wallet = {
      mnemomnic:
        'legend else tooth car romance thought rather share lunar reopen attend refuse',
      imported: true,
    }
    openSesame(wallet, '123123123').then((newState) => {
      dispatch({
        type: 'SETUP_WALLET',
        payload: newState,
      })

      navigation.navigate('MainNavigator')
    })
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
      <Header showText={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}>
        <View style={styles.contentWrapper}>
          <View style={styles.description}>
            <Text style={styles.description1}>one</Text>
            <Text style={styles.description2}>wallet</Text>
            <Text style={styles.description1}>all chains</Text>
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
              returnKeyType="done"
            />
          </View>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password? </Text>
            <Text
              style={styles.forgotPasswordText}
              onPress={() => navigation.navigate('WalletImportNavigator')}>
              Import with seed phrase
            </Text>
          </View>
          <Pressable
            style={[
              styles.createBtn,
              styles.createBtn,
              !passwordInput.value && styles.disabled,
            ]}
            disabled={!passwordInput.value}
            onPress={onUnlock}>
            <Text style={[theme.buttonText, styles.createText]}>
              {loading ? 'Unlocking...' : 'Unlock'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.createBtn, styles.createBtn]}
            onPress={() => {
              setLoading(true)
              onOpenSesame()
            }}>
            <Text style={[theme.buttonText, styles.createText]}>
              {loading ? 'Openning' : 'Open'} Sesame
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 0.6,
    justifyContent: 'space-around',
    width: '100%',
  },
  description: {
    alignItems: 'center',
  },
  description1: {
    fontFamily: 'Montserrat-Light',
    color: '#FFFFFF',
    fontSize: 24,
  },
  description2: {
    fontFamily: 'MontserratAlternates-Light',
    color: '#FFFFFF',
    fontSize: 55,
    marginVertical: 15,
  },
  inputWrapper: {
    width: '90%',
    marginHorizontal: 20,
  },
  inputLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
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
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
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
  disabled: {
    opacity: 0.5,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
})
export default LoginScreen
