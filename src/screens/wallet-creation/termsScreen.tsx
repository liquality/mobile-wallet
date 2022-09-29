import React, { useState } from 'react'
import { ScrollView, useColorScheme, View } from 'react-native'
import { RootStackParamList } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, faceliftPalette, Text, Pressable } from '../../theme'
import { scale, ScaledSheet } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'
import { themeMode } from '../../atoms'
import { useRecoilValue } from 'recoil'
import AnalyticsModal from './optInAnalyticsModal'

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

const TermsScreen = ({ navigation, route }: TermsProps) => {
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const theme = useRecoilValue(themeMode)

  let currentTheme = useColorScheme() || 'light'
  if (theme) {
    currentTheme = theme
  }

  const gradientType = currentTheme === 'light' ? lightGradient : darkGradient

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      paddingHorizontal={'onboardingPadding'}>
      <Box marginTop={'xl'}>
        <Text color={'textColor'} variant="h1" tx="termsScreen.termPrivacy" />
      </Box>
      <Box flex={1}>
        <Box flex={0.7}>
          <ScrollView
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}>
            <Text
              variant={'faceliftBody'}
              color={'textColor'}
              tx="termsScreen.termCopy"
            />
          </ScrollView>
        </Box>
        <Box flex={0.3} backgroundColor="transparent">
          <LinearGradient colors={gradientType} style={styles.linearStyle} />
          <Box marginVertical={'xl'}>
            <Pressable
              label={{ tx: 'termsScreen.iAgree:' }}
              onPress={() => setShowAnalyticsModal(true)}
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
      {showAnalyticsModal ? (
        <React.Suspense
          fallback={
            <View>
              <Text tx="common.loading" />
            </View>
          }>
          <AnalyticsModal
            nextScreen={route?.params?.nextScreen || 'UnlockWalletScreen'}
            previousScreen={route.params.previousScreen || 'Entry'}
            onAction={setShowAnalyticsModal}
          />
        </React.Suspense>
      ) : null}
    </Box>
  )
}

const styles = ScaledSheet.create({
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
