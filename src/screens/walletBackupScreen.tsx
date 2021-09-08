import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  FlatList,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../types'
import { StackScreenProps } from '@react-navigation/stack'
import WalletManager from '../core/walletManager'
import { ThemeContext } from '../theme'
import ScreenHeader from './screenHeader'
type WalletBackupProps = StackScreenProps<
  RootStackParamList,
  'WalletBackupScreen'
>

const WalletBackupScreen = ({ route, navigation }: WalletBackupProps) => {
  const [seedWords, setSeedWords] = useState<Array<SeedWordType>>()
  const theme = useContext(ThemeContext)

  const renderSeedWord = ({ item }: { item: SeedWordType }) => {
    const { id, word } = item
    return (
      <View style={styles.word}>
        <Text style={styles.wordText}>{id}</Text>
        <Text style={styles.wordText}>{word}</Text>
      </View>
    )
  }

  useEffect(() => {
    const seedWordsArray = WalletManager.generateSeedWords().map(
      (word, index) => ({
        id: index + 1,
        word,
      }),
    )

    setSeedWords(seedWordsArray)
  }, [])

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/bg/bg.png')}>
      <ScreenHeader />
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Backup your Wallet</Text>
      </View>
      <Text style={styles.description}>
        The seed phrase is the only way to restore your wallet. Write it down.
        Next you will confirm it.
      </Text>
      <View style={styles.seedPhrase}>
        <FlatList
          numColumns={4}
          style={styles.flatList}
          data={seedWords}
          renderItem={renderSeedWord}
          keyExtractor={(item) => `${item.id}`}
          columnWrapperStyle={styles.columnWrapperStyle}
        />
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => navigation.navigate('Entry')}>
            <Text style={[styles.cancelText, theme.buttonText]}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.nextBtn]}
            onPress={() =>
              navigation.navigate('SeedPhraseConfirmationScreen', {
                ...route.params,
                seedWords,
              })
            }>
            <Text style={[theme.buttonText, styles.nextText]}>Next</Text>
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
    color: '#9D4DFA',
  },
  nextBtn: {
    backgroundColor: '#9D4DFA',
    borderColor: '#9D4DFA',
    borderWidth: 1,
    marginLeft: 10,
  },
  nextText: {
    color: '#F8FAFF',
  },
})
export default WalletBackupScreen
