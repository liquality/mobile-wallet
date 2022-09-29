import React, { createContext } from 'react'
import { View, StyleSheet, Pressable, useColorScheme } from 'react-native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
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
import CustomFeeScreen from '../screens/wallet-features/custom-fee/custom-fee-screen'
import SendConfirmationScreen from '../screens/wallet-features/send/send-confirmation-screen'
import { RootStackParamList, RootTabParamList } from '../types'
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
import CustomFeeEIP1559Screen from '../screens/wallet-features/custom-fee/custom-fee-eip-1559-screen'
import { Box, faceliftPalette, palette, Text } from '../theme'
import ShowAllNftsScreen from '../screens/wallet-features/NFT/show-all-nfts-screen'
import NftDetailScreen from '../screens/wallet-features/NFT/nft-detail-screen'
import NftSendScreen from '../screens/wallet-features/NFT/nft-send-screen'
import NftForSpecificChainScreen from '../screens/wallet-features/NFT/nft-for-specific-chain-screen'
import { AppIcons, Fonts } from '../assets'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'

const { UserCog, SwapCheck, InfinityIcon, TimesIcon } = AppIcons

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()

export const OnboardingContext = createContext({})

const PlaceholderComp = () => <Box />

export const WalletCreationNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white

  return (
    <OnboardingContext.Provider value={{ password: '', confirmPassword: '' }}>
      <Stack.Navigator
        initialRouteName="Entry"
        /**
         * TransitionPresets types exist only on @react-navigation/stack
         * but we are using @react-navigation/native-stack that is the
         * reason for red squiggly line
         */
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen
          name="Entry"
          component={Entry}
          options={{
            headerTitle: '',
            headerShown: true,
            headerShadowVisible: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TermsScreen"
          component={TermsScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerBackVisible: false,
            headerStyle: { backgroundColor },
          }}
        />
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
        <Stack.Screen
          name="UnlockWalletScreen"
          component={UnlockWalletScreen}
        />
      </Stack.Navigator>
    </OnboardingContext.Provider>
  )
}

export const WalletImportNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white

  return (
    <OnboardingContext.Provider value={{ password: '', confirmPassword: '' }}>
      <Stack.Navigator
        initialRouteName="TermsScreen"
        /**
         * TransitionPresets types exist only on @react-navigation/stack
         * but we are using @react-navigation/native-stack that is the
         * reason for red squiggly line
         */
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen
          name="Entry"
          component={Entry}
          options={{
            headerTitle: '',
            headerShown: true,
            headerShadowVisible: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="TermsScreen"
          component={TermsScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerBackVisible: false,
            headerStyle: { backgroundColor },
          }}
        />
        <Stack.Screen
          name="UnlockWalletScreen"
          component={UnlockWalletScreen}
        />
        <Stack.Screen
          name="PasswordCreationScreen"
          component={PasswordCreationScreen}
        />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="SeedPhraseScreen" component={SeedPhraseScreen} />

        <Stack.Screen
          name="CongratulationsScreen"
          component={CongratulationsScreen}
        />
      </Stack.Navigator>
    </OnboardingContext.Provider>
  )
}

type NavigationProps = NativeStackScreenProps<
  RootStackParamList,
  | 'OverviewScreen'
  | 'SendConfirmationScreen'
  | 'BackupWarningScreen'
  | 'SwapConfirmationScreen'
>

const OverViewHeaderLeft = (
  headerProps: HeaderBackButtonProps,
  navProps: NavigationProps,
) => {
  const { navigation, route } = navProps
  return (
    <React.Suspense
      fallback={
        <Box>
          <Text variant="loading" tx="overviewScreen.load" />
        </Box>
      }>
      <OverviewHeaderLeft
        includeBackBtn={
          !headerProps.canGoBack || !!route?.params?.includeBackBtn
        }
        goBack={navigation.goBack}
        screenTitle={route?.params?.screenTitle || 'Overview'}
      />
    </React.Suspense>
  )
}

const SwapCheckHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  return (
    <Pressable onPress={() => navigation.navigate('OverviewScreen', {})}>
      <SwapCheck style={styles.checkIcon} width={20} height={20} />
    </Pressable>
  )
}

const OverViewHeaderRight = (navProps: NavigationProps) => {
  const { navigation, route } = navProps
  return (
    <OverviewHeaderRight
      onPress={() => {
        navigation.setParams({ showPopup: !route?.params?.showPopup })
      }}
    />
  )
}

const BackupWarningHeaderLeft = () => (
  <Text style={styles.settingsTitle} tx="warning" />
)

const BackupWarningHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps

  return (
    <Pressable onPress={() => navigation.navigate('OverviewScreen', {})}>
      <TimesIcon
        width={30}
        height={30}
        color={palette.timesIconColor}
        style={styles.checkIcon}
      />
    </Pressable>
  )
}

export const AppStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="OverviewScreen"
    /**
     * TransitionPresets types exist only on @react-navigation/stack
     * but we are using @react-navigation/native-stack that is the
     * reason for red squiggly line
     */
    screenOptions={({ navigation, route }: NavigationProps) => ({
      gestureEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: true,
      title: '',
      headerLeft: (props) => OverViewHeaderLeft(props, { navigation, route }),
      headerRight: () => OverViewHeaderRight({ navigation, route }),
    })}>
    <Stack.Screen name="OverviewScreen">
      {(props) => WithPopupMenu(OverviewScreen)(props)}
    </Stack.Screen>
    <Stack.Screen
      name="AssetChooserScreen"
      options={() => ({
        headerRight: PlaceholderComp,
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
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SendScreen"
      component={SendScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SendReviewScreen"
      component={SendReviewScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="CustomFeeScreen"
      component={CustomFeeScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="CustomFeeEIP1559Screen"
      component={CustomFeeEIP1559Screen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SendConfirmationScreen"
      component={SendConfirmationScreen}
      options={({ navigation, route }: NavigationProps) => ({
        headerRight: () => SwapCheckHeaderRight({ navigation, route }),
        title: route?.params?.screenTitle || 'Overview',
        headerLeft: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="AssetManagementScreen"
      component={AssetManagementScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="AssetToggleScreen"
      component={AssetToggleScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SwapScreen"
      component={WithPopupMenu(SwapScreen)}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SwapReviewScreen"
      component={WithPopupMenu(SwapReviewScreen)}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="SwapConfirmationScreen"
      component={WithPopupMenu(SwapConfirmationScreen)}
      options={({ navigation, route }: NavigationProps) => ({
        headerRight: () => SwapCheckHeaderRight({ navigation, route }),
        title: route?.params?.screenTitle || 'Overview',
        headerLeft: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="NftForSpecificChainScreen"
      component={NftForSpecificChainScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="NftDetailScreen"
      component={NftDetailScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
    <Stack.Screen
      name="NftSendScreen"
      component={NftSendScreen}
      options={() => ({
        headerRight: PlaceholderComp,
      })}
    />
  </Stack.Navigator>
)

const tabBarIcon = (focused: boolean, size: number, routeName: string) => {
  let whichIconToReturn
  if (routeName === 'SettingsScreen') {
    whichIconToReturn = <UserCog width={size} height={size} />
  } else if (routeName === 'ShowAllNftsScreen') {
    whichIconToReturn = <Text>NFT</Text>
  } else whichIconToReturn = <InfinityIcon height={size} />

  return (
    <View style={[styles.iconWrapper, focused && styles.tabFocused]}>
      {whichIconToReturn}
    </View>
  )
}

const TabSettingsScreenHeaderLeft = () => (
  <Text style={styles.settingsTitle} tx="settings" />
)

export const MainNavigator = () => (
  <Tab.Navigator
    initialRouteName="AppStackNavigator"
    screenOptions={({ route }) => ({
      headerShown: false,
      title: '',
      tabBarIcon: ({ focused, size }) => tabBarIcon(focused, size, route.name),
    })}>
    <Tab.Screen name="AppStackNavigator" component={AppStackNavigator} />
    <Tab.Screen
      name="ShowAllNftsScreen"
      component={ShowAllNftsScreen}
      options={({}) => ({
        headerShown: true,
        headerTitle: '',
        headerLeft: TabSettingsScreenHeaderLeft,
      })}
    />
    <Tab.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={({}) => ({
        headerShown: true,
        headerTitle: '',
        headerLeft: TabSettingsScreenHeaderLeft,
        /*    headerRight: () => (
          <SettingsHeaderRight navigate={navigation.navigate} />
        ), */
      })}
    />
  </Tab.Navigator>
)

export const StackMainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={() => ({
          headerShown: false,
          headerRight: PlaceholderComp,
        })}
      />
      <Stack.Screen
        name="BackupWarningScreen"
        component={BackupWarningScreen}
        options={({ navigation, route }: NavigationProps) => ({
          headerShown: true,
          headerTitle: '',
          headerLeft: BackupWarningHeaderLeft,
          headerRight: () => BackupWarningHeaderRight({ navigation, route }),
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
        name="BackupSeedScreen"
        component={BackupSeedScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
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
      <Stack.Screen name="UnlockWalletScreen" component={UnlockWalletScreen} />
      <Stack.Screen
        name="Entry"
        component={Entry}
        options={{
          headerTitle: '',
          headerShown: true,
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.gray,
  },
  tabFocused: {
    borderTopColor: palette.black2,
  },
  checkIcon: {
    marginRight: 20,
  },
  settingsTitle: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 20,
  },
})
