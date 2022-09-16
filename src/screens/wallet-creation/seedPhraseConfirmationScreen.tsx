import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Header from '../header'
import ButtonFooter from '../../components/button-footer'
import { Box, Button } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import { Text } from '../../components/text/text'
import { labelTranslateFn } from '../../utils'
import { Fonts } from '../../assets'

type SeedPhraseConfirmationProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const SeedWord = ({
  item,
  chosenSeedWords,
  onPress,
}: {
  item: SeedWordType
  chosenSeedWords: Array<string>
  onPress: () => void
}) => {
  const [pressed, setPressed] = useState(false)
  const { word } = item
  return (
    <Pressable
      style={styles.word}
      onPress={() => {
        if (chosenSeedWords.length <= 3) {
          setPressed(!pressed)
        }
        onPress()
      }}>
      <Text style={[styles.wordText, pressed ? styles.pressedWord : {}]}>
        {word}
      </Text>
    </Pressable>
  )
}

const SeedPhraseConfirmationScreen = ({
  route,
  navigation,
}: SeedPhraseConfirmationProps) => {
  const [chosenSeedWords, setChosenSeedWords] = useState<Array<string>>([])
  const [shuffledSeedWords, setShuffledSeedWords] = useState<
    Array<SeedWordType>
  >([])

  const renderSeedWord = ({ item }: { item: SeedWordType }) => {
    return (
      <SeedWord
        onPress={() => {
          if (
            chosenSeedWords.length < 3 &&
            chosenSeedWords.indexOf(item.word) < 0
          ) {
            setChosenSeedWords(Array.of(...chosenSeedWords, item.word))
          } else {
            setChosenSeedWords(chosenSeedWords.filter((w) => w !== item.word))
          }
        }}
        item={item}
        chosenSeedWords={chosenSeedWords}
      />
    )
  }

  const confirmSeedPhrase = () => {
    const seedWords = route.params.seedWords
    return (
      seedWords &&
      seedWords[0].word === chosenSeedWords[0] &&
      seedWords[4].word === chosenSeedWords[1] &&
      seedWords[11].word === chosenSeedWords[2]
    )
  }

  const onContinue = () => {
    if (!confirmSeedPhrase()) {
      Alert.alert(
        labelTranslateFn('seedPhraseConfirmationScreen.keyInfoMissing')!,
        labelTranslateFn('common.pleaseTryAgain')!,
      )
      return
    }

    navigation.navigate('PasswordCreationScreen', {
      ...route.params,
      mnemonic:
        route.params.seedWords?.map((item) => item.word).join(' ') || '',
      imported: false,
    })
  }

  useEffect(() => {
    setShuffledSeedWords(
      [...(route.params.seedWords || [])].sort(() => Math.random() - 0.5),
    )
  }, [route.params.seedWords])

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
            tx="seedPhraseConfirmationScreen.confirmSeed"
          />
          <Text
            style={styles.description}
            tx="seedPhraseConfirmationScreen.tap3wordMatching"
          />
        </View>

        <View style={styles.main}>
          <View style={styles.seedPhrase}>
            <View style={styles.seedWordLengthOptions} />

            <View style={styles.missingWords}>
              <View style={styles.missingWordView}>
                <Text
                  style={styles.wordOrderText}
                  tx="seedPhraseConfirmationScreen.1stWord"
                />
                <Text style={styles.missingWordText}>
                  {chosenSeedWords.length >= 1 && chosenSeedWords[0]}
                </Text>
              </View>
              <View style={styles.missingWordView}>
                <Text
                  style={styles.wordOrderText}
                  tx="seedPhraseConfirmationScreen.5thWord"
                />
                <Text style={styles.missingWordText}>
                  {chosenSeedWords.length >= 2 && chosenSeedWords[1]}
                </Text>
              </View>
              <View style={styles.missingWordView}>
                <Text
                  style={styles.wordOrderText}
                  tx="seedPhraseConfirmationScreen.12thWord"
                />
                <Text style={styles.missingWordText}>
                  {chosenSeedWords.length >= 3 && chosenSeedWords[2]}
                </Text>
              </View>
            </View>

            <FlatList
              style={styles.flatList}
              numColumns={4}
              data={shuffledSeedWords}
              renderItem={renderSeedWord}
              keyExtractor={(item) => `${item.id}`}
              columnWrapperStyle={styles.columnWrapperStyle}
            />
            <ButtonFooter unpositioned>
              <Button
                type="secondary"
                variant="m"
                label={{ tx: 'common.back' }}
                onPress={navigation.goBack}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label={{ tx: 'common.continue' }}
                onPress={onContinue}
                isBorderless={true}
                isActive={chosenSeedWords.length >= 3}
              />
            </ButtonFooter>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Box>
  )
}

const styles = StyleSheet.create({
  missingWords: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginBottom: 40,
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
  seedWordLengthOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
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
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 30,
  },
  description: {
    fontFamily: Fonts.SemiBold,
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
  pressedWord: {
    color: '#A8AEB7',
  },
})

export default SeedPhraseConfirmationScreen
