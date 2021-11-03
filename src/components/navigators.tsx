import React, { createContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUserCog, faCircle } from '@fortawesome/pro-duotone-svg-icons'
import Infinity from '../assets/icons/infinity.svg'
import Entry from '../screens/wallet-creation/entryScreen'
import TermsScreen from '../screens/wallet-creation/termsScreen'
import PasswordCreationScreen from '../screens/wallet-creation/passwordCreationScreen'
import SeedPhraseScreen from '../screens/wallet-creation/seedPhraseScreen'
import SeedPhraseConfirmationScreen from '../screens/wallet-creation/seedPhraseConfirmationScreen'
import CongratulationsScreen from '../screens/wallet-creation/congratulationsScreen'
import UnlockWalletScreen from '../screens/wallet-import/unlock-wallet-screen'
import LoadingScreen from '../screens/wallet-import/loading-screen'
import OverviewScreen from '../screens/wallet-features/overview-screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SettingsScreen from '../screens/wallet-features/settings-screen'
import AssetScreen from '../screens/wallet-features/asset-screen'
import OverviewHeaderLeft from './header-bar/overview-header-left'
import OverviewHeaderRight from './header-bar/overview-header-right'
import { HeaderBackButtonProps } from '@react-navigation/elements'
import ReceiveScreen from '../screens/wallet-features/receive-screen'
import SendScreen from '../screens/wallet-features/send-screen'
import SendReviewScreen from '../screens/wallet-features/send-review-screen'
import CustomFeeScreen from '../screens/wallet-features/custom-fee-screen'
import SendConfirmationScreen from '../screens/wallet-features/send-confirmation-screen'
import { RootStackParamList } from '../types'
import WithPopupMenu from './with-popup-menu'

const Stack = createStackNavigator<RootStackParamList>()
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
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
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
      <Stack.Screen
        name="CongratulationsScreen"
        component={CongratulationsScreen}
      />
    </Stack.Navigator>
  </OnboardingContext.Provider>
)

export const AppStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="OverviewScreen"
    screenOptions={({ navigation, route }) => ({
      headerShown: true,
      title: '',
      headerLeft: (props: HeaderBackButtonProps) => (
        <OverviewHeaderLeft
          includeBackBtn={!!props.canGoBack}
          goBack={navigation.goBack}
          screenTitle={route?.params?.screenTitle || 'Overview'}
        />
      ),
      headerRight: () => (
        <OverviewHeaderRight
          onPress={() => {
            navigation.setParams({ showPopup: !route?.params?.showPopup })
          }}
        />
      ),
    })}>
    <Stack.Screen name="OverviewScreen">
      {(props) => WithPopupMenu(OverviewScreen)(props)}
    </Stack.Screen>
    <Stack.Screen name="AssetScreen">
      {(props) => WithPopupMenu(AssetScreen)(props)}
    </Stack.Screen>
    <Stack.Screen
      name="ReceiveScreen"
      component={ReceiveScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SendScreen"
      component={SendScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SendReviewScreen"
      component={SendReviewScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="CustomFeeScreen"
      component={CustomFeeScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SendConfirmationScreen"
      component={SendConfirmationScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
  </Stack.Navigator>
)

export const MainNavigator = () => (
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
              secondaryColor={focused ? '#C4C4C4' : '#FFFFFF'}
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
    <Tab.Screen name="AppStackNavigator" component={AppStackNavigator} />
    <Tab.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{ headerShown: true, headerTitle: 'Settings' }}
    />
  </Tab.Navigator>
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
