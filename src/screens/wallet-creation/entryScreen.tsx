import React, { FC } from 'react'
import { Image } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { Box, Text, Pressable, ThemeLayout } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import {
  ONBOARDING_SCREEN_DEFAULT_PADDING,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
} from '../../utils'
import { AppIcons, Images } from '../../assets'
import { scale } from 'react-native-size-matters'

const { LogoFull } = AppIcons

type EntryProps = NativeStackScreenProps<RootStackParamList, 'Entry'>

const Entry: FC<EntryProps> = (props): JSX.Element => {
  const { navigation } = props

  const handleImportPress = () => navigation.navigate('WalletImportNavigator')

  const handleCreateWalletPress = () =>
    navigation.navigate('TermsScreen', {
      nextScreen: 'SeedPhraseScreen',
    })

  return (
    <ThemeLayout
      style={{ paddingHorizontal: ONBOARDING_SCREEN_DEFAULT_PADDING }}>
      <GradientBackground
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        isFullPage
      />
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
        <Text opacity={0.8} variant={'whiteLabel'} tx="common.forgotPassword" />
        <Text
          opacity={0.8}
          variant={'whiteLabel'}
          textDecorationLine={'underline'}
          tx="common.importWithSeedPhrase"
          marginTop={'s'}
          onPress={handleImportPress}
        />
      </Box>
    </ThemeLayout>
  )
}

export default Entry
