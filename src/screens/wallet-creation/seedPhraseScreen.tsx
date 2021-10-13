import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  FlatList,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { StackScreenProps } from '@react-navigation/stack'
import WalletManager from '../../core/walletManager'
import { ThemeContext } from '../../theme'
import Header from '../header'
type WalletBackupProps = StackScreenProps<
  RootStackParamList,
  'SeedPhraseScreen'
>

const SeedPhraseScreen = ({ route, navigation }: WalletBackupProps) => {
  const [seedWords, setSeedWords] = useState<Array<SeedWordType>>()
  const theme = useContext(ThemeContext)

  const renderSeedWord = ({ item }: { item: SeedWordType }) => {
    const { id, word } = item
    return (
      <View style={styles.word}>
        <Text style={styles.wordId}>{id}</Text>
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
      source={require('../../assets/bg/bg.png')}>
      <Header showText={true} />
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Backup your Wallet</Text>
        <Text style={styles.description}>
          The seed phrase is the only way to restore your wallet. Write it down.
          Next you will confirm it.
        </Text>
      </View>

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
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  prompt: {
    flex: 1,
    marginTop: 62,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  promptText: {
    fontFamily: 'Montserrat-Regular',
    color: '#fff',
    fontSize: 28,
  },
  description: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
    marginBottom: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
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
    margin: 10,
  },
  word: {
    flex: 0.25,
  },
  wordId: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  wordText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginTop: 5,
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
export default SeedPhraseScreen
