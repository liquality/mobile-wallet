import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableWithoutFeedback } from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, faceliftPalette, Pressable, Text } from '../../theme'
import { labelTranslateFn, SCREEN_HEIGHT } from '../../utils'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { CommonActions } from '@react-navigation/native'

type SeedPhraseConfirmationProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const selectedWords = [
  {
    placeholder: labelTranslateFn('seedPhraseConfirmationScreen.1stWord'),
    value: '',
  },
  {
    placeholder: labelTranslateFn('seedPhraseConfirmationScreen.5thWord'),
    value: '',
  },
  {
    placeholder: labelTranslateFn('seedPhraseConfirmationScreen.12thWord'),
    value: '',
  },
]

const activeOpacity = 1
const inactiveOpacity = 0.5

interface CustomSeedWordType extends SeedWordType {
  selected: boolean
}

const SeedPhraseConfirmationScreen = ({
  route,
  navigation,
}: SeedPhraseConfirmationProps) => {
  const [shuffledSeedWords, setShuffledSeedWords] = useState<
    Array<CustomSeedWordType>
  >([])
  const [words, setWords] = useState(selectedWords)
  const [error, setError] = useState(false)

  useEffect(() => {
    let customSeedWords = route.params.seedWords
      ? route.params.seedWords.map((item) => ({ ...item, selected: false }))
      : []
    setShuffledSeedWords([...customSeedWords].sort(() => Math.random() - 0.5))
    setWords(words.map((item) => ({ ...item, value: '' })))
    // Need only once at the time of component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmSeedPhrase = () => {
    const seedWords = route.params.seedWords
    return (
      seedWords &&
      seedWords[0].word === words[0].value &&
      seedWords[4].word === words[1].value &&
      seedWords[11].word === words[2].value
    )
  }

  const onContinue = () => {
    if (!confirmSeedPhrase()) {
      setError(true)
      return
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'PasswordCreationScreen',
            params: {
              ...route.params,
              mnemonic:
                route.params.seedWords?.map((item) => item.word).join(' ') ||
                '',
              imported: false,
            },
          },
        ],
      }),
    )
  }

  const onWordPress = (customSeedWords: CustomSeedWordType, index: number) => {
    let tempWords = [...words]
    let tempShuffledSeedWords = [...shuffledSeedWords]
    let shuffle = false
    if (!customSeedWords.selected) {
      if (!tempWords[0].value) {
        tempWords[0].value = customSeedWords.word
        shuffle = true
      } else if (!tempWords[1].value) {
        tempWords[1].value = customSeedWords.word
        shuffle = true
      } else if (!tempWords[2].value) {
        tempWords[2].value = customSeedWords.word
        shuffle = true
      }
    } else {
      if (tempWords[0].value === customSeedWords.word) {
        tempWords[0].value = ''
        shuffle = true
      } else if (tempWords[1].value === customSeedWords.word) {
        tempWords[1].value = ''
        shuffle = true
      } else if (tempWords[2].value === customSeedWords.word) {
        tempWords[2].value = ''
        shuffle = true
      }
    }

    if (shuffle) {
      tempShuffledSeedWords[index].selected =
        !tempShuffledSeedWords[index].selected
      setWords([...tempWords])
      setShuffledSeedWords([...tempShuffledSeedWords])
    }
    if (error && shuffle) {
      setError(false)
    }
  }

  let isDisabled = !words.every((item) => !!item.value)

  const enableScroll = SCREEN_HEIGHT < 700

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'onboardingPadding'}>
      <Box flex={0.75}>
        <Box marginTop={'xl'}>
          <Text
            color={'textColor'}
            variant="h1"
            tx="seedPhraseConfirmationScreen.confirmSeed"
          />
        </Box>
        <Text
          variant={'normalText'}
          color={'textColor'}
          tx="seedPhraseConfirmationScreen.tap3wordMatching"
        />
        <Box marginTop={'xl'} marginBottom={'m'}>
          <Box flexDirection={'row'} justifyContent="space-between">
            {words.map((item, index) => (
              <Box
                key={index}
                width={'30%'}
                borderBottomWidth={scale(1)}
                borderBottomColor={error ? 'danger' : 'textColor'}
                style={{
                  opacity: item.value ? activeOpacity : inactiveOpacity,
                }}>
                <Text
                  marginBottom={'s'}
                  variant="normalText"
                  color={'textColor'}>
                  {item.value ? item.value : item.placeholder}
                </Text>
              </Box>
            ))}
          </Box>
          {error ? (
            <Text
              marginTop={'s'}
              textAlign="center"
              variant={'errorText'}
              color={'danger'}
              tx="wordsNotMatch"
            />
          ) : null}
        </Box>
        <ScrollView scrollEnabled={enableScroll}>
          <Box height={200} flexDirection="row" flexWrap="wrap">
            {shuffledSeedWords.map((item: CustomSeedWordType, index) => (
              <TouchableWithoutFeedback
                onPress={() => onWordPress(item, index)}
                key={item.id}>
                <Box
                  style={
                    item.selected
                      ? styles.inactiveButtonStyle
                      : styles.buttonStyle
                  }>
                  <Text
                    style={
                      item.selected
                        ? styles.inactiveTextStyle
                        : styles.textStyle
                    }>
                    {item.word}
                  </Text>
                </Box>
              </TouchableWithoutFeedback>
            ))}
          </Box>
        </ScrollView>
      </Box>
      <Box flex={0.25}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'common.next' }}
            onPress={onContinue}
            variant="solid"
            icon
            disabled={isDisabled}
          />
        </Box>
        <Text
          onPress={navigation.goBack}
          textAlign={'center'}
          variant="link"
          tx="termsScreen.cancel"
        />
      </Box>
    </Box>
  )
}

const styles = ScaledSheet.create({
  buttonStyle: {
    borderRadius: '15@s',
    borderColor: faceliftPalette.active,
    borderWidth: '1@s',
    margin: '3@ms0.1',
  },
  textStyle: {
    padding: '12@ms0.1',
    color: faceliftPalette.active,
  },
  inactiveButtonStyle: {
    backgroundColor: faceliftPalette.whiteGrey,
    margin: '3@ms0.1',
    borderRadius: '15@s',
  },
  inactiveTextStyle: {
    padding: '12@ms0.1',
    color: faceliftPalette.grey,
  },
})

export default SeedPhraseConfirmationScreen
