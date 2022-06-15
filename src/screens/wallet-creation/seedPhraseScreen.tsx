import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import Button from '../../theme/button'
import { generateMnemonic } from 'bip39'

type WalletBackupProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseScreen'
>

const SeedPhraseScreen = ({ route, navigation }: WalletBackupProps) => {
  const [seedWords, setSeedWords] = useState<Array<SeedWordType>>()

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
    const seedWordArray = generateMnemonic()
      .split(' ')
      .map((word, index) => ({
        id: index + 1,
        word,
      }))

    setSeedWords(seedWordArray)
  }, [])

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={[styles.keyboard, StyleSheet.absoluteFillObject]}>
        <Header showText={true} />
        <View style={styles.prompt}>
          <Text style={styles.promptText}>Backup your Wallet</Text>
          <Text style={styles.description}>
            The seed phrase is the only way to restore your wallet. Write it
            down. Next you will confirm it.
          </Text>
        </View>

        <View style={styles.main}>
          <View style={styles.seedPhrase}>
            <View style={styles.seedWordLengthOptions} />
            <FlatList
              numColumns={3}
              style={styles.flatList}
              data={seedWords}
              renderItem={renderSeedWord}
              keyExtractor={(item) => `${item.id}`}
              columnWrapperStyle={styles.columnWrapperStyle}
            />
            <ButtonFooter unpositioned>
              <Button
                type="secondary"
                variant="m"
                label="Cancel"
                onPress={() => navigation.navigate('Entry')}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label="Next"
                onPress={() =>
                  navigation.navigate('SeedPhraseConfirmationScreen', {
                    ...route.params,
                    seedWords,
                  })
                }
                isBorderless={true}
                isActive={true}
              />
            </ButtonFooter>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  word: {
    flex: 0.25,
    marginTop: 5,
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
  seedWordLengthOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  main: {
    flex: 0.9,
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },

  prompt: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  promptText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 28,
  },
  description: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
    marginBottom: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  seedPhrase: {
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    height: '100%',
  },
  flatList: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  columnWrapperStyle: {
    marginBottom: 50,
    marginTop: 0,
    justifyContent: 'space-between',
  },

  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
export default SeedPhraseScreen
