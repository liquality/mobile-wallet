import React, { FC } from 'react'
import { Image, StatusBar, ViewStyle } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { Box, Text, Pressable, ThemeLayout, faceliftPalette } from '../../theme'
import { ONBOARDING_SCREEN_DEFAULT_PADDING, SCREEN_WIDTH } from '../../utils'
import { AppIcons, Images } from '../../assets'
import { scale } from 'react-native-size-matters'
import { LinearGradient } from 'expo-linear-gradient'

const { LogoFull } = AppIcons
const gradientColor = [
  faceliftPalette.gradientEndColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientMiddeColor,
  faceliftPalette.gradientStartColor,
]

const gradientStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: ONBOARDING_SCREEN_DEFAULT_PADDING,
}

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props

  const handleImportPress = () => navigation.navigate('WalletImportNavigator')

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  return (
    <ThemeLayout>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={gradientColor} style={gradientStyle}>
        <LogoFull width={scale(100)} />
        <Box flex={0.9} marginTop="xl">
          <Image
            source={Images.oneWalletAllChains}
            resizeMode="contain"
            style={{
              width: scale(
                (SCREEN_WIDTH - ONBOARDING_SCREEN_DEFAULT_PADDING) * 0.5,
              ),
            }}
          />
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
