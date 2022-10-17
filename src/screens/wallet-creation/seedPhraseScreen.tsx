import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList, SeedWordType } from '../../types'
import { Box, Text, Pressable } from '../../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { generateMnemonic } from 'bip39'

type SeedPhraseScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseScreen'
>

const SeedPhraseScreen = ({ navigation, route }: SeedPhraseScreenProps) => {
  const [seedWords, setSeedWords] = useState<Array<SeedWordType>>()

  useEffect(() => {
    const seedWordArray = generateMnemonic()
      .split(' ')
      .map((word, index) => ({
        id: index + 1,
        word,
      }))

    setSeedWords(seedWordArray)
  }, [])

  const onContinue = () => {
    navigation.navigate('SeedPhraseConfirmationScreen', {
      ...route.params,
      seedWords,
    })
  }

  const renderSeedWord = ({ item }: { item: SeedWordType }) => {
    const { id, word } = item

    return (
      <Box width={'27%'} borderBottomColor="textColor" borderBottomWidth={1}>
        <Text variant={'numberLabel'} color="greyBlack">
          {id}
        </Text>
        <Text
          lineHeight={scale(25)}
          variant={'seedPhraseLabel'}
          color="textColor">
          {word}
        </Text>
      </Box>
    )
  }

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
            tx="seedPhraseScreen.backupYourWallet"
          />
        </Box>
        <Text
          variant={'normalText'}
          color={'textColor'}
          tx="seedPhraseScreen.restoreYourWallet"
        />
        <Box marginTop={'xl'} flex={1}>
          <FlatList
            data={seedWords}
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
  columnWrapperStyle: {
    marginBottom: '20@s',
    justifyContent: 'space-between',
  },
})

export default SeedPhraseScreen
