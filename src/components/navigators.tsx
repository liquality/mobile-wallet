import React, { createContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserCog, faCircle } from '@fortawesome/free-solid-svg-icons'
import Infinity from '../assets/icons/infinity.svg'
import Entry from '../screens/wallet-creation/entryScreen'
import TermsScreen from '../screens/wallet-creation/termsScreen'
import PasswordCreationScreen from '../screens/wallet-creation/passwordCreationScreen'
import SeedPhraseScreen from '../screens/wallet-creation/seedPhraseScreen'
import SeedPhraseConfirmationScreen from '../screens/wallet-creation/seedPhraseConfirmationScreen'
import CongratulationsScreen from '../screens/wallet-creation/congratulationsScreen'
import UnlockWalletScreen from '../screens/wallet-import/unlockWalletScreen'
import LoginScreen from '../screens/wallet-creation/loginScreen'
import LoadingScreen from '../screens/wallet-import/loadingScreen'
import OverviewScreen from '../screens/wallet-features/overviewScreen'
import OverviewHeaderLeft from './header-bar/overviewHeaderLeft'
import OverviewHeaderRight from './header-bar/overviewHeaderRight'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SettingsScreen from '../screens/wallet-features/settingsScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

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
      <Stack.Screen name="SeedPhraseScreen" component={SeedPhraseScreen} />
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

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName="MainStackNavigator"
    screenOptions={({ route }) => ({
      headerShown: false,
      title: '',
      tabBarIcon: ({ focused, size }) => {
        return (
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon
              icon={faCircle}
              size={10}
              color={focused ? '#C4C4C4' : '#FFFFFF'}
              style={styles.icon}
            />
            {route.name === 'SettingsScreen' ? (
              <FontAwesomeIcon icon={faUserCog} size={size} color="#5F5F5F" />
            ) : (
              <Infinity height={size} />
            )}
          </View>
        )
      },
    })}>
    <Tab.Screen name="OverviewScreen" component={OverviewScreen} />
    <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
  </Tab.Navigator>
)

export const MainNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen
      name="MainTabNavigator"
      component={MainTabNavigator}
      options={{
        headerShown: true,
        title: '',
        headerLeft: () => <OverviewHeaderLeft />,
        headerRight: () => <OverviewHeaderRight />,
      }}
    />
  </Stack.Navigator>
)

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginVertical: 5,
  },
})
