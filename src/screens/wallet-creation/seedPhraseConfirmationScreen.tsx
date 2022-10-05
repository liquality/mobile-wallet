import React from 'react'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, Pressable, Text } from '../../theme'
import { labelTranslateFn } from '../../utils'
import { scale } from 'react-native-size-matters'

type SeedPhraseConfirmationProps = NativeStackScreenProps<
  RootStackParamList,
  'SeedPhraseConfirmationScreen'
>

const wordsArray = [
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

const SeedPhraseConfirmationScreen = ({
  navigation,
}: SeedPhraseConfirmationProps) => {
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
        <Box marginVertical={'xl'}>
          <Box flexDirection={'row'} justifyContent="space-between">
            {wordsArray.map((item) => (
              <Box
                width={'30%'}
                borderBottomWidth={scale(1)}
                borderBottomColor="textColor"
                style={{ opacity: 0.5 }}>
                <Text marginBottom={'s'} variant="normalText">
                  {item.placeholder}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box flex={0.25}>
        <Box marginVertical={'xl'}>
          <Pressable
            label={{ tx: 'common.next' }}
            onPress={onContinue}
            variant="solid"
            icon
            disabled={true}
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

export default SeedPhraseConfirmationScreen
