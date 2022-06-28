import React, { createContext } from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserCog from '../assets/icons/user-cog.svg'
import SwapCheck from '../assets/icons/swap-check.svg'
import Infinity from '../assets/icons/infinity.svg'
import Entry from '../screens/wallet-creation/entryScreen'
import TermsScreen from '../screens/wallet-creation/termsScreen'
import PasswordCreationScreen from '../screens/wallet-creation/passwordCreationScreen'
import SeedPhraseScreen from '../screens/wallet-creation/seedPhraseScreen'
import SeedPhraseConfirmationScreen from '../screens/wallet-creation/seedPhraseConfirmationScreen'
import CongratulationsScreen from '../screens/wallet-creation/congratulationsScreen'
import UnlockWalletScreen from '../screens/wallet-import/unlock-wallet-screen'
import LoadingScreen from '../screens/wallet-import/loading-screen'
import OverviewScreen from '../screens/wallet-features/home/overview-screen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SettingsScreen from '../screens/wallet-features/settings/settings-screen'
import AssetScreen from '../screens/wallet-features/asset/asset-screen'
import OverviewHeaderLeft from './header-bar/overview-header-left'
import OverviewHeaderRight from './header-bar/overview-header-right'
import { HeaderBackButtonProps } from '@react-navigation/elements'
import ReceiveScreen from '../screens/wallet-features/receive/receive-screen'
import SendScreen from '../screens/wallet-features/send/send-screen'
import SendReviewScreen from '../screens/wallet-features/send/send-review-screen'
import CustomFeeScreen from '../screens/wallet-features/custom-fee-screen'
import SendConfirmationScreen from '../screens/wallet-features/send/send-confirmation-screen'
import { RootStackParamList } from '../types'
import WithPopupMenu from './with-popup-menu'
import AssetChooserScreen from '../screens/wallet-features/asset/asset-chooser-screen'
import AssetManagementScreen from '../screens/wallet-features/asset/asset-management-screen'

import AssetToggleScreen from '../screens/wallet-features/asset/asset-toggle-screen'
import SwapScreen from '../screens/wallet-features/swap/swap-screen'
import SwapReviewScreen from '../screens/wallet-features/swap/swap-review-screen'
import SwapConfirmationScreen from '../screens/wallet-features/swap/swap-confirmation-screen'
import { TransitionPresets } from '@react-navigation/stack'
import LoginScreen from '../screens/wallet-creation/loginScreen'
import BackupWarningScreen from '../screens/wallet-features/backup/backup-warning-screen'
import BackupSeedScreen from '../screens/wallet-features/backup/backup-seed-screen'
import BackupLoginScreen from '../screens/wallet-features/backup/backup-login-screen'
import { getFocusedRouteNameFromRoute } from '@react-navigation/core'
import TimesIcon from '../assets/icons/times.svg'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

export const OnboardingContext = createContext({})

export const WalletCreationNavigator = () => (
  <OnboardingContext.Provider value={{ password: '', confirmPassword: '' }}>
    <Stack.Navigator
      initialRouteName="Entry"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
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
      initialRouteName="TermsScreen"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="TermsScreen" component={TermsScreen} />
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
      gestureEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: true,
      title: '',
      headerLeft: (props: HeaderBackButtonProps) => (
        <OverviewHeaderLeft
          includeBackBtn={!props.canGoBack}
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
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="OverviewScreen">
      {(props) => WithPopupMenu(OverviewScreen)(props)}
    </Stack.Screen>
    <Stack.Screen
      name="AssetChooserScreen"
      options={() => ({
        headerRight: () => <View />,
      })}>
      {(props) => WithPopupMenu(AssetChooserScreen)(props)}
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
      options={({ navigation, route }) => ({
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('OverviewScreen')}>
            <SwapCheck style={styles.checkIcon} width={20} height={20} />
          </Pressable>
        ),
        title: route?.params?.screenTitle || 'Overview',
        headerLeft: () => <View />,
      })}
    />
    <Stack.Screen
      name="AssetManagementScreen"
      component={AssetManagementScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="BackupWarningScreen"
      component={BackupWarningScreen}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: '',
        headerLeft: () => <Text style={styles.settingsTitle}>WARNING</Text>,
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('OverviewScreen')}>
            <TimesIcon
              width={30}
              height={30}
              color={'#5F5F5F'}
              style={styles.checkIcon}
            />
          </Pressable>
        ),
      })}
    />
    <Stack.Screen
      name="BackupSeedScreen"
      component={BackupSeedScreen}
      options={({}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="BackupLoginScreen"
      component={BackupLoginScreen}
      options={({}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="AssetToggleScreen"
      component={AssetToggleScreen}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SwapScreen"
      component={WithPopupMenu(SwapScreen)}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SwapReviewScreen"
      component={WithPopupMenu(SwapReviewScreen)}
      options={() => ({
        headerRight: () => <View />,
      })}
    />
    <Stack.Screen
      name="SwapConfirmationScreen"
      component={WithPopupMenu(SwapConfirmationScreen)}
      options={({ navigation, route }) => ({
        headerRight: () => (
          <Pressable onPress={() => navigation.navigate('OverviewScreen')}>
            <SwapCheck style={styles.checkIcon} width={20} height={20} />
          </Pressable>
        ),
        title: route?.params?.screenTitle || 'Overview',
        headerLeft: () => <View />,
      })}
    />
  </Stack.Navigator>
)

export const MainNavigator = () => (
  <Tab.Navigator
    initialRouteName="AppStackNavigator"
    screenOptions={({ route }) => ({
      tabBarStyle: ((route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? ''
        if (
          routeName === 'BackupWarningScreen' ||
          routeName === 'BackupLoginScreen' ||
          routeName === 'BackupSeedScreen'
        ) {
          return {
            display: 'none',
          }
        } else if (routeName === 'OverviewScreen')
          //Maybe not ideal solution but there is bug in rn-navigation workaround here: https://github.com/react-navigation/react-navigation/issues/6779#issuecomment-583272325
          return {
            bottom: 0,
            position: 'absolute',
          }
      })(route),
      headerShown: false,
      title: '',
      tabBarIcon: ({ focused, size }) => {
        return (
          <View style={[styles.iconWrapper, focused && styles.tabFocused]}>
            {route.name === 'SettingsScreen' ? (
              <UserCog width={size} height={size} />
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
      options={({}) => ({
        headerShown: true,
        headerTitle: '',
        headerLeft: () => <Text style={styles.settingsTitle}>SETTINGS</Text>,
        /*    headerRight: () => (
          <SettingsHeaderRight navigate={navigation.navigate} />
        ), */
      })}
    />
  </Tab.Navigator>
)

const styles = StyleSheet.create({
  iconWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#D9DFE5',
    backgroundColor: '#FFF',
  },
  tabFocused: {
    backgroundColor: '#FFF',
    borderTopColor: '#000',
  },
  checkIcon: {
    marginRight: 20,
  },
  settingsTitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 20,
  },
})
