import React, { FC } from 'react'
import { StatusBar } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { Box, Text, Pressable, ThemeLayout, GRADIENT_STYLE } from '../../theme'
import { GRADIENT_COLORS } from '../../utils'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'

const { LogoFull, OneWalletAllChains } = AppIcons

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props

  const handleImportPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'UnlockWalletScreen',
    })

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  return (
    <ThemeLayout>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={GRADIENT_COLORS} style={GRADIENT_STYLE}>
        <LogoFull width={scale(100)} />
        <Box flex={0.9} marginTop="xl">
          <OneWalletAllChains />
        </Box>
        <Pressable
          label={{ tx: 'entryScreen.createNewWallet' }}
          onPress={handleCreateWalletPress}
          variant="outline"
        />
        <Box marginTop={'xl'} alignItems="center">
          <Text
            opacity={0.8}
            variant={'whiteLabel'}
            tx="common.forgotPassword"
          />
          <Text
            opacity={0.8}
            variant={'whiteLabel'}
            textDecorationLine={'underline'}
            tx="common.importWithSeedPhrase"
            marginTop={'s'}
            onPress={handleImportPress}
          />
        </Box>
      </LinearGradient>
    </ThemeLayout>
  )
}

export default Entry
