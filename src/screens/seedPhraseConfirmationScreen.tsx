import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  FlatList,
  Alert,
} from 'react-native'
import { RootStackParamList, SeedPhraseType } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
import WalletManager from '../core/walletManager'
import StorageManager from '../core/storageManager'
type SeedPhraseConfirmationProps = StackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const SeedPhraseConfirmationScreen = ({
  route,
  navigation,
}: SeedPhraseConfirmationProps) => {
  const DATA: Array<SeedPhraseType> = [
    {
      id: 1,
      word: 'logic',
    },
    {
      id: 2,
      word: 'resist',
    },
    {
      id: 3,
      word: 'cage',
    },
    {
      id: 4,
      word: 'dash',
    },
    {
      id: 5,
      word: 'trigger',
    },
    {
      id: 6,
      word: 'seminar',
    },
    {
      id: 7,
      word: 'monkey',
    },
    {
      id: 8,
      word: 'custom',
    },
    {
      id: 9,
      word: 'afraid',
    },
    {
      id: 10,
      word: 'zoom',
    },
    {
      id: 11,
      word: 'pudding',
    },
    {
      id: 12,
      word: 'enrich',
    },
  ]
  const renderSeedWord = ({ item }: { item: SeedPhraseType }) => {
    const { word } = item
    return (
      <Pressable style={styles.word}>
        <Text style={styles.wordText}>{word}</Text>
      </Pressable>
    )
  }

  const onContinue = () => {
    if (!route.params.password) {
      Alert.alert('Key information missig', 'Please try again')
    }
    const wallet = {
      id: '1234',
      at: Date.now(),
      name: 'Account-1',
      mnemomnic: 'anjsnc8383jndndj',
      imported: false,
    }
    const walletManager = new WalletManager(
      wallet,
      route.params.password || '',
      new StorageManager(),
    )
    walletManager.createWallet().then(() => {
      walletManager.retrieveWallet().then(() => {
        navigation.navigate('CongratulationsScreen')
      })
    })
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
        <Text style={styles.promptText}>Backup your Wallet</Text>
      </View>
      <Text style={styles.description}>
        The seed phrase is the only way to restore your wallet. Write it down.
        Next you will confirm it.
      </Text>
      <View style={styles.seedPhrase}>
        <View style={styles.missingWords}>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>1ST WORD</Text>
            <Text style={styles.missingWordText}>logic</Text>
          </View>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>8TH WORD</Text>
            <Text style={styles.missingWordText} />
          </View>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>12TH WORD</Text>
            <Text style={styles.missingWordText} />
          </View>
        </View>
        <FlatList
          style={styles.flatList}
          numColumns={4}
          data={DATA}
          renderItem={renderSeedWord}
          keyExtractor={(item) => `${item.id}`}
          columnWrapperStyle={styles.columnWrapperStyle}
        />
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.nextBtn]}
            onPress={onContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
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
  seedPhrase: {
    backgroundColor: '#fff',
  },
  flatList: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  columnWrapperStyle: {
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  word: {
    flex: 0.2,
    width: 60,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    borderColor: '#D9DFE5',
    borderWidth: 1,
  },
  wordText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9D4DFA',
  },
  missingWords: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  missingWordView: {
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
  },
  wordOrderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3D4767',
    marginBottom: 3,
  },
  missingWordText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
  },
  actions: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
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
  backText: {
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
  continueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFF',
  },
})

export default SeedPhraseConfirmationScreen
