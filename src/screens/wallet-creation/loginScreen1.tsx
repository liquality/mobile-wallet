import React from 'react'
import { StatusBar } from 'react-native'
import {
  Box,
  GRADIENT_STYLE,
  Text,
  ThemeLayout,
  GRADIENT_COLORS,
} from '../../theme'
import { KeyboardAvoidingView } from '../../components/keyboard-avoid-view'
import LinearGradient from 'react-native-linear-gradient'
import { AppIcons } from '../../assets'
import { scale } from 'react-native-size-matters'

const { LogoFull, OneWalletAllChains } = AppIcons

const LoginScreen = () => {
  return (
    <ThemeLayout>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView>
        <LinearGradient colors={GRADIENT_COLORS} style={GRADIENT_STYLE}>
          <LogoFull width={scale(100)} />
          <OneWalletAllChains />
          <Box flex={0.8} justifyContent="center">
            <Text>Input</Text>
          </Box>
          <Text>Button</Text>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ThemeLayout>
  )
}

export default LoginScreen
