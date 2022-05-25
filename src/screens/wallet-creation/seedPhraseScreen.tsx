import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
import { RootStackParamList, SeedWordType } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import ButtonFooter from '../../components/button-footer'
import Header from '../header'
import Button from '../../theme/button'
import Box from '../../theme/box'
import GradientBackground from '../../components/gradient-background'
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
    // const seedWordsArray = Wallet.generateSeedWords().map((word, index) => ({
    //   id: index + 1,
    //   word,
    // }))

    setSeedWords([])
  }, [])

  return (
    <Box style={styles.container}>
      <GradientBackground
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
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
})
export default SeedPhraseScreen
