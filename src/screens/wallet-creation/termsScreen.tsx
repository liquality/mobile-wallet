import React from 'react'
import { ScrollView, useColorScheme } from 'react-native'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Box,
  faceliftPalette,
  ThemeLayout,
  ThemeText,
  Text,
  ThemeIcon,
  Pressable,
} from '../../theme'
import { Fonts } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { ONBOARDING_SCREEN_DEFAULT_PADDING } from '../../utils'
import { LinearGradient } from 'expo-linear-gradient'
import { CommonActions } from '@react-navigation/native'
import { themeMode } from '../../atoms'
import { useRecoilValue } from 'recoil'

const lightGradient = [
  'rgba(255,255,255,0.6)',
  faceliftPalette.white,
  faceliftPalette.white,
  faceliftPalette.white,
  faceliftPalette.white,
]

const darkGradient = [
  'rgba(61, 71, 103, 0.6)',
  faceliftPalette.darkGrey,
  faceliftPalette.darkGrey,
  faceliftPalette.darkGrey,
  faceliftPalette.darkGrey,
]

type TermsProps = NativeStackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation }: TermsProps) => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() || 'light'
  if (theme) {
    currentTheme = theme
  }

  const gradientType = currentTheme === 'light' ? lightGradient : darkGradient

  const navigateToSeedPhraseScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Entry' },
          {
            name: 'SeedPhraseScreen',
            params: {
              termsAcceptedAt: Date.now(),
            },
          },
        ],
      }),
    )
  }

  return (
    <ThemeLayout
      style={{ paddingHorizontal: ONBOARDING_SCREEN_DEFAULT_PADDING }}>
      <ThemeIcon iconName="OnlyLqLogo" />
      <Box marginTop={'xl'}>
        <ThemeText style={styles.termsTitle} tx="termsScreen.termPrivacy" />
      </Box>
      <Box flex={1}>
        <Box flex={0.7}>
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}>
            <ThemeText style={styles.termsCopy} tx="termsScreen.termCopy" />
          </ScrollView>
        </Box>
        <Box flex={0.3} backgroundColor="transparent">
          <LinearGradient colors={gradientType} style={styles.linearStyle} />
          <Box marginVertical={'xl'}>
            <Pressable
              label={{ tx: 'termsScreen.iAgree:' }}
              onPress={navigateToSeedPhraseScreen}
              variant="solid"
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
    </ThemeLayout>
  )
}

const styles = ScaledSheet.create({
  termsTitle: {
    fontFamily: Fonts.Regular,
    fontSize: '48@s',
    fontWeight: '500',
    lineHeight: '64@s',
  },
  termsCopy: {
    fontFamily: Fonts.Regular,
    fontSize: '15@s',
  },
  linearStyle: {
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    top: scale(-30),
  },
  contentContainerStyle: {
    paddingBottom: '25@s',
  },
})
export default TermsScreen
