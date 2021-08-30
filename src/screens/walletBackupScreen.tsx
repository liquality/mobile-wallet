import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
  FlatList,
} from 'react-native'
import { RootStackParamList, SeedPhraseType } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
type WalletBackupProps = StackScreenProps<
  RootStackParamList,
  'WalletBackupScreen'
>

const WalletBackupScreen = ({ navigation }: WalletBackupProps) => {
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
    const { id, word } = item
    return (
      <View style={styles.word}>
        <Text style={styles.wordText}>{id}</Text>
        <Text style={styles.wordText}>{word}</Text>
      </View>
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
        <Text style={styles.promptText}>Backup your Wallet</Text>
      </View>
      <Text style={styles.description}>
        Tap the 3 words matching their position in the seed phrase. Once
        confirmed, store the phrase securely.
      </Text>
      <View style={styles.seedPhrase}>
        <FlatList
          numColumns={4}
          style={styles.flatList}
          data={DATA}
          renderItem={renderSeedWord}
          keyExtractor={(item) => `${item.id}`}
          columnWrapperStyle={styles.columnWrapperStyle}
        />
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => navigation.navigate('Entry')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.nextBtn]}
            onPress={() => navigation.navigate('SeedPhraseConfirmationScreen')}>
            <Text style={styles.nextText}>Next</Text>
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
    margin: 20,
  },
  columnWrapperStyle: {
    margin: 5,
  },
  word: {
    flex: 0.25,
  },
  wordText: {
    fontSize: 16,
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
export default WalletBackupScreen
