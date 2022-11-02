import React, { useState } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { Box, Text, TextInput, Pressable, faceliftPalette } from '../../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { KeyboardAvoidingView } from '../../components/keyboard-avoid-view'
import { labelTranslateFn } from '../../utils'

type UnlockWalletScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UnlockWalletScreen'
>

const defaultArray = Array(12).fill('')

const UnlockWalletScreen = ({ navigation }: UnlockWalletScreenProps) => {
  const [seedPhraseLength, setPhraseLength] = useState(12)
  const [indexOfFocusedText, setIndexOfFocusedText] = useState<number>(-1)
  const [chosenSeedWords, setChosenSeedWords] =
    useState<Array<string>>(defaultArray)

  const onContinue = () => {
    navigation.navigate('PasswordCreationScreen', {
      mnemonic: chosenSeedWords.join(' ').trim(),
      imported: true,
    })
  }

  const onToggleNumber = (num: 12 | 24) => {
    navigation.setOptions({
      headerTitle: num === 24 ? labelTranslateFn('unlockWalletUpperCase')! : '',
    })
    let tempArray = Array(num).fill('')
    for (let item in tempArray) {
      tempArray[item] = chosenSeedWords[item] || ''
    }
    setChosenSeedWords([...tempArray])
    setPhraseLength(num)
  }

  const isSeedPhrase12 = seedPhraseLength === 12
  const isSeedPhrase24 = seedPhraseLength === 24

  let isDisabled = !chosenSeedWords.every((val) => !!val.trim())

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderSeedWord = ({ item, index }: { item: any; index: number }) => {
    return (
      <Box width={'27%'}>
        <Text variant={'numberLabel'} color="greyBlack">{`${index + 1}`}</Text>
        <TextInput
          variant={'seedPhraseInputs'}
          autoCorrect={false}
          keyboardType="ascii-capable"
          autoCapitalize={'none'}
          onFocus={() => setIndexOfFocusedText(index)}
          onChangeText={(value) => {
            chosenSeedWords[index] = value
            setChosenSeedWords([...chosenSeedWords])
          }}
          returnKeyType="done"
          cursorColor={faceliftPalette.buttonActive}
          style={{
            lineHeight: scale(1.3 * 16),
            borderBottomColor:
              index === indexOfFocusedText
                ? faceliftPalette.buttonActive
                : faceliftPalette.darkText,
          }}
        />
      </Box>
    )
  }

  return (
    <KeyboardAvoidingView>
      <Box
        flex={1}
        backgroundColor="mainBackground"
        paddingHorizontal={'onboardingPadding'}>
        <Box flex={0.75}>
          {isSeedPhrase12 ? (
            <Box marginTop={'xl'}>
              <Text
                color={'textColor'}
                variant="h1"
                tx="unlockWalletScreen.unlockWallet"
              />
            </Box>
          ) : null}
          {isSeedPhrase12 ? (
            <Text
              variant={'normalText'}
              fontSize={scale(17)}
              lineHeight={scale(1.3 * 17)}
              color={'textColor'}
              tx="unlockWalletScreen.enterSeedPhrase"
            />
          ) : null}
          <Box flexDirection={'row'} marginTop="s" alignItems={'center'}>
            <Box
              flexDirection={'row'}
              alignItems="center"
              height={scale(30)}
              borderWidth={scale(1)}
              borderRadius={scale(15)}
              borderColor={'activeButton'}
              width={scale(81)}>
              <TouchableWithoutFeedback onPress={() => onToggleNumber(12)}>
                <Box
                  justifyContent={'center'}
                  alignItems="center"
                  height={'100%'}
                  borderTopLeftRadius={scale(15)}
                  borderBottomLeftRadius={scale(15)}
                  backgroundColor={
                    isSeedPhrase12 ? 'activeButton' : 'transparent'
                  }
                  width={'50%'}>
                  <Text
                    variant={'normalText'}
                    color={isSeedPhrase12 ? 'white' : 'activeButton'}
                    tx={'unlockWalletScreen.12words'}
                  />
                </Box>
              </TouchableWithoutFeedback>
              <Box
                height={'100%'}
                width={'1%'}
                backgroundColor={'activeButton'}
              />
              <TouchableWithoutFeedback onPress={() => onToggleNumber(24)}>
                <Box
                  justifyContent={'center'}
                  alignItems="center"
                  height={'100%'}
                  borderTopRightRadius={scale(15)}
                  borderBottomRightRadius={scale(15)}
                  backgroundColor={
                    isSeedPhrase24 ? 'activeButton' : 'transparent'
                  }
                  width={'50%'}>
                  <Text
                    color={isSeedPhrase24 ? 'white' : 'activeButton'}
                    tx={'unlockWalletScreen.24words'}
                  />
                </Box>
              </TouchableWithoutFeedback>
            </Box>
            <Text
              marginLeft={'m'}
              color={'textColor'}
              tx={'unlockWalletScreen.wordCount'}
            />
          </Box>
          <Box marginTop={'mxxl'} flex={1}>
            <FlatList
              data={chosenSeedWords}
              columnWrapperStyle={styles.columnWrapperStyle}
              renderItem={renderSeedWord}
              numColumns={3}
            />
          </Box>
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
    </KeyboardAvoidingView>
  )
}

const styles = ScaledSheet.create({
  columnWrapperStyle: {
    marginBottom: '20@s',
    justifyContent: 'space-between',
  },
})

export default UnlockWalletScreen
