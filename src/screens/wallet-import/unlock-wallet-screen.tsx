import React, { useState } from 'react'
import { FlatList, TouchableWithoutFeedback } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import {
  Box,
  Text,
  palette,
  TextInput,
  Pressable,
  faceliftPalette,
} from '../../theme'
import { Fonts } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { KeyboardAvoidingView } from '../../components/keyboard-avoid-view'

type UnlockWalletScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UnlockWalletScreen'
>

const defaultArray = Array(12).fill('')

const UnlockWalletScreen = ({ navigation }: UnlockWalletScreenProps) => {
  const [seedPhraseLength, setPhraseLength] = useState(12)
  const [chosenSeedWords, setChosenSeedWords] =
    useState<Array<string>>(defaultArray)

  const onContinue = () => {
    navigation.navigate('PasswordCreationScreen', {
      mnemonic: chosenSeedWords.join(' ').trim(),
      imported: true,
    })
  }

  const onToggleNumber = (num: number) => {
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
    const opacity = chosenSeedWords[index].length ? 1 : 0.4
    return (
      <Box width={'27%'}>
        <Text>{`${index + 1}`}</Text>
        <TextInput
          variant={'seedPhraseInputs'}
          autoCorrect={false}
          keyboardType="ascii-capable"
          autoCapitalize={'none'}
          onChangeText={(value) => {
            chosenSeedWords[index] = value
            setChosenSeedWords([...chosenSeedWords])
          }}
          returnKeyType="done"
          cursorColor={faceliftPalette.buttonActive}
          style={{ opacity }}
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
        <Box marginTop={'xl'}>
          <Text
            color={'textColor'}
            variant="h1"
            tx="unlockWalletScreen.unlockWallet"
          />
        </Box>
        <Box flex={0.7}>
          <Text
            variant={'faceliftBody'}
            color={'textColor'}
            tx="unlockWalletScreen.enterSeedPhrase"
          />
          <Box flexDirection={'row'} marginTop="l" alignItems={'center'}>
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
          <Box marginTop={'xl'} flex={1}>
            <FlatList
              data={chosenSeedWords}
              columnWrapperStyle={styles.columnWrapperStyle}
              renderItem={renderSeedWord}
              numColumns={3}
            />
          </Box>
        </Box>
        <Box flex={0.3}>
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
  numberStyle: {
    height: '30@s',
    width: '81@s',
    borderWidth: '1@s',
    borderRadius: '20@s',
    borderColor: faceliftPalette.buttonActive,
  },
  lineStyle: {
    height: '30@s',
    width: '1@s',
    backgroundColor: faceliftPalette.buttonActive,
  },
  wordOrderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: palette.sectionTitleColor,
    marginBottom: 3,
  },
  missingWordText: {
    fontFamily: Fonts.Regular,
    fontSize: 16,
    // lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: palette.turquoise,
    width: '100%',
  },
  columnWrapperStyle: {
    marginBottom: 20,
    justifyContent: 'space-between',
  },
})

export default UnlockWalletScreen
