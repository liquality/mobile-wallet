import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import Button from '../../theme/button'
import Box from '../../theme/box'
import GradientBackground from '../../components/gradient-background'

type UnlockWalletScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UnlockWalletScreen'
>

const UnlockWalletScreen = ({ navigation }: UnlockWalletScreenProps) => {
  const [seedPhraseLength, setPhraseLength] = useState(12)
  const [chosenSeedWords, setChosenSeedWords] = useState<Array<string>>(
    Array(12),
  )

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
          keyboardType="ascii-capable"
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
    return true
  }

  const onContinue = () => {
    if (!validateSeedPhrase()) {
      Alert.alert('Your seed phrase is invalid', 'Please try again')
      return
    } else {
      navigation.navigate('PasswordCreationScreen', {
        previousScreen: 'UnlockWalletScreen',
        mnemonic: chosenSeedWords.join(' ').trim(),
        imported: true,
      })
    }
  }

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
          <Text style={styles.promptText}>Unlock Wallet</Text>
          <Text style={styles.description}>
            Enter the seed phrase, in the same order saved when creating your
            wallet.
          </Text>
        </View>
        <View style={styles.main}>
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
            <ButtonFooter unpositioned>
              <Button
                type="secondary"
                variant="m"
                label="Cancel"
                onPress={navigation.goBack}
                isBorderless={false}
                isActive={true}
              />
              <Button
                type="primary"
                variant="m"
                label="Continue"
                onPress={onContinue}
                isBorderless={false}
                isActive={chosenSeedWords.every((val) => !!val)}
              />
            </ButtonFooter>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  main: {
    flex: 0.7,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  prompt: {
    flex: 0.3,
    marginTop: 62,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
  },
  promptText: {
    fontFamily: 'Montserrat-Regular',
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 28,
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
    width: Dimensions.get('window').width,
  },
  flatList: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  columnWrapperStyle: {
    marginBottom: 20,
    justifyContent: 'space-between',
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
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2CD2CF',
    width: '100%',
  },
  keyboard: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default UnlockWalletScreen
