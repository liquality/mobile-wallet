import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  TextInput,
} from 'react-native'

import { RootStackParamList, UseInputStateReturnType } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
type PasswordCreationProps = StackScreenProps<
  RootStackParamList,
  'PasswordCreationScreen'
>

const useInputState = (
  initialValue: string,
): UseInputStateReturnType<string> => {
  const [value, setValue] = useState<string>(initialValue)
  return { value, onChangeText: setValue }
}

const PasswordCreationScreen = ({ navigation }: PasswordCreationProps) => {
  const passwordInput = useInputState('')
  const passwordConfirmationInput = useInputState('')

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
            value={passwordInput.value}
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            style={styles.input}
            onChangeText={passwordConfirmationInput.onChangeText}
            value={passwordConfirmationInput.value}
            autoCorrect={false}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={() => navigation.navigate('Entry')}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.nextBtn]}
          onPress={() => navigation.navigate('WalletBackupScreen')}>
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
})
export default PasswordCreationScreen
