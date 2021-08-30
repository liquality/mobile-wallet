import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import Logo from '../assets/icons/logo.svg'
import { RootStackParamList } from '../types'
type EntryProps = StackScreenProps<RootStackParamList, 'Entry'>

const Entry = ({ navigation }: EntryProps) => {
  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <View style={styles.header}>
        <Logo width={135} height={83} />
        <Text style={styles.headerText}>liquality</Text>
      </View>
      <View style={styles.description}>
        <Text style={styles.descriptionTitle}>Wallet</Text>
        <Text style={styles.descriptionDetails}>The atomic swap enabled</Text>
        <Text style={styles.descriptionDetails}>multi-crypto wallet</Text>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password? </Text>
          <Text
            style={styles.forgotPasswordText}
            onPress={() => Alert.alert('Import wallet flow')}>
            Import with seed phrase
          </Text>
        </View>
        <Pressable
          style={[styles.createBtn, styles.createBtn]}
          onPress={() => navigation.navigate('TermsScreen')}>
          <Text style={styles.createText}>Create a new Wallet </Text>
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    marginTop: 60,
    alignSelf: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 135,
    height: 83,
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 27,
  },
  description: {
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 50,
    color: '#FFF',
    marginBottom: 5,
  },
  descriptionDetails: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 5,
  },
  actionContainer: {
    width: '90%',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
})
export default Entry
