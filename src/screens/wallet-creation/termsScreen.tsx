import React from 'react'
import { ScrollView } from 'react-native'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Box,
  faceliftPalette,
  ThemeLayout,
  ThemeText,
  Text,
  Pressable,
} from '../../theme'
import { Fonts, AppIcons } from '../../assets'
import { scale, ScaledSheet } from 'react-native-size-matters'
import { ONBOARDING_SCREEN_DEFAULT_PADDING } from '../../utils'
import { LinearGradient } from 'expo-linear-gradient'
import { CommonActions } from '@react-navigation/native'

const { OnlyLqLogo } = AppIcons
const transparentToWhiteGradient = [
  'rgba(255,255,255,0.6)',
  faceliftPalette.white,
  faceliftPalette.white,
  faceliftPalette.white,
  faceliftPalette.white,
]

type TermsProps = NativeStackScreenProps<RootStackParamList, 'TermsScreen'>

const TermsScreen = ({ navigation }: TermsProps) => {
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
      <OnlyLqLogo />
      <Box marginTop={'xxl'}>
        <ThemeText style={styles.termsTitle} tx="termsScreen.termPrivacy" />
      </Box>
      <Box marginTop={'xl'} flex={1}>
        <Box flex={0.7}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemeText style={styles.termsCopy} tx="termsScreen.termCopy" />
          </ScrollView>
        </Box>
        <Box flex={0.3} backgroundColor="transparent">
          <LinearGradient
            colors={transparentToWhiteGradient}
            style={styles.linearStyle}
          />
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
    fontSize: '41@s',
    fontWeight: '500',
    lineHeight: '58@s',
  },
  termsCopy: {
    fontFamily: Fonts.Regular,
    textAlign: 'justify',
    fontSize: '14@s',
  },
  linearStyle: {
    left: 0,
    bottom: 0,
    right: 0,
    position: 'absolute',
    top: scale(-30),
  },
})
export default TermsScreen
