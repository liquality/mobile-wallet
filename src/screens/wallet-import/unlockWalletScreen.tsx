import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../types'
import WalletManager from '../../core/walletManager'
import { ThemeContext } from '../../theme'
import Header from '../header'

type UnlockWalletScreenProps = StackScreenProps<
  RootStackParamList,
  'UnlockWalletScreen'
>

const UnlockWalletScreen = ({ navigation }: UnlockWalletScreenProps) => {
  const [seedPhraseLength, setPhraseLength] = useState(12)
  const [chosenSeedWords, setChosenSeedWords] = useState<Array<string>>(
    Array(12),
  )
  const theme = useContext(ThemeContext)

  const SeedWord = ({
    id,
    addSeedWord,
  }: {
    id: string
    addSeedWord: (text: string) => void
  }) => {
    return (
      <View style={styles.missingWordView}>
        <Text style={styles.wordOrderText}>{id}</Text>
        <TextInput
          style={styles.missingWordText}
          autoCorrect={false}
          autoCapitalize={'none'}
          onChangeText={(text) => addSeedWord(text)}
          returnKeyType="done"
        />
      </View>
    )
  }

  const addSeedWord = (text: string, index: string) => {
    chosenSeedWords[parseInt(index, 10)] = text
    setChosenSeedWords(chosenSeedWords)
  }

  const renderSeedWord = ({ item }: { item: { id: string } }) => {
    return (
      <SeedWord
        id={`${item.id}`}
        addSeedWord={(txt) => addSeedWord(txt, item.id)}
      />
    )
  }

  const validateSeedPhrase = () => {
    return WalletManager.validateSeedPhrase(chosenSeedWords.join(' ').trim())
  }

  const onContinue = () => {
    if (!validateSeedPhrase()) {
      Alert.alert('Your seed phrase is invalid', 'Please try again')
      return
    } else {
      navigation.navigate('PasswordCreationScreen', {
        previousScreen: 'UnlockWalletScreen',
        nextScreen: 'LoadingScreen',
        seedPhrase: chosenSeedWords.join(' ').trim(),
        imported: true,
      })
    }
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/bg/bg.png')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}>
        <Header showText={true} />
        <View style={styles.prompt}>
          <Text style={styles.promptText}>Unlock Wallet</Text>
          <Text style={styles.description}>
            Enter the seed phrase, in the same order saved when creating your
            wallet.
          </Text>
        </View>
        <View style={styles.seedPhrase}>
          <View style={styles.seedWordLengthOptions}>
            <Pressable
              onPress={() => setPhraseLength(12)}
              style={[
                styles.seedWordOptionAction,
                styles.btnLeftSide,
                seedPhraseLength === 12 && styles.optionActive,
              ]}>
              <Text style={styles.seedWordOptionText}>12 words</Text>
            </Pressable>
            <Pressable
              onPress={() => setPhraseLength(24)}
              style={[
                styles.seedWordOptionAction,
                styles.btnRightSide,
                seedPhraseLength === 24 && styles.optionActive,
              ]}>
              <Text style={styles.seedWordOptionText}>24 words</Text>
            </Pressable>
          </View>
          <FlatList
            style={styles.flatList}
            numColumns={3}
            showsVerticalScrollIndicator={true}
            data={[...Array(seedPhraseLength).keys()].map((key) => ({
              id: `${key + 1}`,
            }))}
            renderItem={renderSeedWord}
            keyExtractor={(item) => `${item.id}`}
            columnWrapperStyle={styles.columnWrapperStyle}
          />
          <View style={styles.actions}>
            <Pressable
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => navigation.goBack()}>
              <Text style={[theme.buttonText, styles.cancelText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.actionBtn,
                styles.nextBtn,
                !chosenSeedWords.every((val) => !!val) && styles.disabled,
              ]}
              disabled={!chosenSeedWords.every((val) => !!val)}
              onPress={onContinue}>
              <Text style={[theme.buttonText, styles.continueText]}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    flex: 0.3,
    marginTop: 62,
    alignItems: 'center',
    paddingHorizontal: 30,
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
    flex: 0.7,
    // flexGrow: 3,
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
  seedWordLengthOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  seedWordOptionAction: {
    borderColor: '#D9DFE5',
    borderWidth: 1,
  },
  btnLeftSide: {
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderRightWidth: 0,
  },
  btnRightSide: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  optionActive: {
    backgroundColor: '#F0F7F9',
  },
  seedWordOptionText: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  missingWordView: {
    flex: 1,
    marginRight: 20,
  },
  wordOrderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3D4767',
    marginBottom: 3,
  },
  missingWordText: {
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
    width: '100%',
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
  continueText: {
    color: '#F8FAFF',
  },
  disabled: {
    opacity: 0.5,
  },
  scrollableWrapper: {
    flex: 0.8,
    backgroundColor: '#FFFFFF',
  },
  keyboardScrollableWrapper: {
    flexGrow: 1,
  },
  contentWrapper: {
    borderWidth: 1,
  },
  keyboard: {
    flex: 1,
  },
})

export default UnlockWalletScreen
