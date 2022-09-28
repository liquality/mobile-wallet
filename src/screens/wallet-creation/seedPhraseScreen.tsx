import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import { Box, Button, palette } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import { generateMnemonic } from 'bip39'
import { Text } from '../../components/text/text'
import { Fonts } from '../../assets'

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
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={[styles.keyboard, StyleSheet.absoluteFillObject]}>
        <Header showText={true} />
        <View style={styles.prompt}>
          <Text
            style={styles.promptText}
            tx="seedPhraseScreen.backupYourWallet"
          />
          <Text
            style={styles.description}
            tx="seedPhraseScreen.restoreYourWallet"
          />
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
                label={{ tx: 'common.cancel' }}
                onPress={() => navigation.navigate('Entry')}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label={{ tx: 'common.next' }}
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
    </Box>
  )
}

const styles = StyleSheet.create({
  word: {
    flex: 0.25,
    marginTop: 5,
  },
  wordId: {
    fontFamily: Fonts.Bold,
    fontSize: 12,
  },
  wordText: {
    fontFamily: Fonts.Regular,
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
    fontFamily: Fonts.Regular,
    color: palette.white,
    fontSize: 30,
  },
  description: {
    fontFamily: Fonts.SemiBold,
    marginTop: 10,
    marginBottom: 18,
    alignSelf: 'center',
    textAlign: 'center',
    color: palette.white,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  seedPhrase: {
    backgroundColor: palette.white,
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
