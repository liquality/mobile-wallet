import React, { FC } from 'react'
import { Dimensions, Image } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types'
import { Box, Text, Pressable, ThemeLayout } from '../../theme'
import GradientBackground from '../../components/gradient-background'
import { ONBOARDING_SCREEN_DEFAULT_PADDING, widthInPerFn } from '../../utils'
import { AppIcons, Images } from '../../assets'

const { LogoFull } = AppIcons
const imageWidth75per = widthInPerFn(75)

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
        width={Dimensions.get('screen').width}
        height={Dimensions.get('screen').height}
        isFullPage
      />
      <LogoFull />
      <Box flex={0.9} marginTop="xxl">
        <Image
          source={Images.oneWalletAllChains}
          resizeMode="contain"
          style={imageWidth75per}
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
