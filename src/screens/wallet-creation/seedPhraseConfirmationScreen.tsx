import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Header from '../header'
import ButtonFooter from '../../components/button-footer'
import Button from '../../theme/button'
import Box from '../../theme/box'
import GradientBackground from '../../components/gradient-background'

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
      Alert.alert('Key information missing', 'Please try again')
      return
    }
    navigation.navigate('PasswordCreationScreen', {
      ...route.params,
      mnemonic: route.params.seedWords?.join(' ') || '',
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
      <Header showText={true} />
      <View style={styles.prompt}>
        <Text style={styles.promptText}>Confirm Seed Phrase</Text>
        <Text style={styles.description}>
          Tap the 3 words matching their position in the seed phrase. Once
          confirmed, store the phrase securely.
        </Text>
      </View>
      <View style={styles.seedPhrase}>
        <View style={styles.missingWords}>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>1ST WORD</Text>
            <Text style={styles.missingWordText}>
              {chosenSeedWords.length >= 1 && chosenSeedWords[0]}
            </Text>
          </View>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>5TH WORD</Text>
            <Text style={styles.missingWordText}>
              {chosenSeedWords.length >= 2 && chosenSeedWords[1]}
            </Text>
          </View>
          <View style={styles.missingWordView}>
            <Text style={styles.wordOrderText}>12TH WORD</Text>
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
            label="Back"
            onPress={navigation.goBack}
            isBorderless={false}
            isActive={true}
          />
          <Button
            type="primary"
            variant="m"
            label="Continue"
            onPress={onContinue}
            isBorderless={true}
            isActive={chosenSeedWords.length >= 3}
          />
        </ButtonFooter>
      </View>
    </Box>
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
    color: '#FFFFFF',
    fontSize: 28,
  },
  description: {
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 20,
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
  pressedWord: {
    color: '#A8AEB7',
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
})

export default SeedPhraseConfirmationScreen
