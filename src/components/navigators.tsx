import React, { createContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Entry from '../screens/entryScreen'
import TermsScreen from '../screens/termsScreen'
import PasswordCreationScreen from '../screens/passwordCreationScreen'
import WalletBackupScreen from '../screens/walletBackupScreen'
import SeedPhraseConfirmationScreen from '../screens/seedPhraseConfirmationScreen'
import CongratulationsScreen from '../screens/congratulationsScreen'
import UnlockWalletScreen from '../screens/wallet-import/unlockWalletScreen'
import LoginScreen from '../screens/loginScreen'
import LoadingScreen from '../screens/wallet-import/loadingScreen'

const Stack = createStackNavigator()

export const OnboardingContext = createContext({})

export const OnboardingNavigator = () => (
  <OnboardingContext.Provider value={{ password: '', confirmPassword: '' }}>
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
  </OnboardingContext.Provider>
)

export const WalletImportNavigator = () => (
  <OnboardingContext.Provider value={{ password: '', confirmPassword: '' }}>
    <Stack.Navigator
      initialRouteName="UnlockWalletScreen"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UnlockWalletScreen" component={UnlockWalletScreen} />
      <Stack.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
      />
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
    </Stack.Navigator>
  </OnboardingContext.Provider>
)

export const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
  </Stack.Navigator>
)

export const HomeNavigator = () => (
  <Stack.Navigator initialRouteName="Entry">
    <Stack.Screen name="Entry" component={Entry} />
  </Stack.Navigator>
)