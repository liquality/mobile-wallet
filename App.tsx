import React, { useEffect } from 'react'
import { StatusBar, View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createSwitchNavigator } from '@react-navigation/compat'
import { createStackNavigator } from '@react-navigation/stack'
import Entry from './src/screens/entryScreen'
import TermsScreen from './src/screens/termsScreen'
import PasswordCreationScreen from './src/screens/passwordCreationScreen'
import WalletBackupScreen from './src/screens/walletBackupScreen'
import SeedPhraseConfirmationScreen from './src/screens/seedPhraseConfirmationScreen'
import CongratulationsScreen from './src/screens/congratulationsScreen'
import { LiqualityThemeProvider } from './src/theme'

const Stack = createStackNavigator()
const OnboardingNavigator = () => (
  <Stack.Navigator
    initialRouteName="Entry"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Entry" component={Entry} />
    <Stack.Screen name="TermsScreen" component={TermsScreen} />
    <Stack.Screen
      name="PasswordCreationScreen"
      component={PasswordCreationScreen}
    />
    <Stack.Screen name="WalletBackupScreen" component={WalletBackupScreen} />
    <Stack.Screen
      name="SeedPhraseConfirmationScreen"
      component={SeedPhraseConfirmationScreen}
    />
    <Stack.Screen
      name="CongratulationsScreen"
      component={CongratulationsScreen}
    />
  </Stack.Navigator>
)
const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="Entry">
    <Stack.Screen name="Entry" component={Entry} />
  </Stack.Navigator>
)
const AppNavigator = createSwitchNavigator(
  {
    OnboardingNavigator,
    HomeNavigator,
  },
  {
    initialRouteName: 'OnboardingNavigator',
  },
)

const App = () => {
  const backgroundStyle = {
    flex: 1,
  }

  useEffect(() => {
    SplashScreen.hide()
  })

  return (
    <LiqualityThemeProvider>
      <View style={backgroundStyle} testID={'app-test'}>
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </LiqualityThemeProvider>
  )
}

export default App
