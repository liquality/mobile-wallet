import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
type EntryProps = StackScreenProps<RootStackParamList, 'Entry'>

const Entry = ({ navigation }: EntryProps) => {
  const CREATE = 'CREATE',
    IMPORT = 'IMPORT'
  const [actionType, setActionType] = useState(CREATE)

  const OptionImage = ({ buttonType }: { buttonType: string }) => {
    return actionType === buttonType ? (
      <Image source={require('../assets/icons/ellipse-btn-active.png')} />
    ) : (
      <Image source={require('../assets/icons/ellipse-btn.png')} />
    )
  }

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
        <Text style={styles.promptText}>Create or import</Text>
        <Text style={styles.promptText}>a wallet</Text>
      </View>
      <Text style={styles.description}>
        Your Liquality wallet will give you the benefits of the blockchain
        networks to manage several wallets individually.
      </Text>
      <View style={styles.options}>
        <Text style={styles.want}>I want to</Text>
        <Pressable style={styles.option} onPress={() => setActionType(CREATE)}>
          <OptionImage buttonType={CREATE} />
          <Text style={styles.optionText}>Create</Text>
        </Pressable>
        <Pressable style={styles.option} onPress={() => setActionType(IMPORT)}>
          <OptionImage buttonType={IMPORT} />
          <Text style={styles.optionText}>Import</Text>
        </Pressable>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.cancelBtn]}
          onPress={() => setActionType(CREATE)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.actionBtn, styles.nextBtn]}
          onPress={() => navigation.navigate('TermsScreen')}>
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
  description: {
    marginTop: 39,
    marginBottom: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
  },
  options: {
    alignItems: 'center',
  },
  want: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -50,
    marginTop: 5,
  },
  optionText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
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
export default Entry
