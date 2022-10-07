import React, { createContext } from 'react'
import { StyleSheet, Pressable, useColorScheme } from 'react-native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
  NativeStackNavigationOptions,
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
import { HeaderBackButtonProps } from '@react-navigation/elements'
import ReceiveScreen from '../screens/wallet-features/receive/receive-screen'
import SendScreen from '../screens/wallet-features/send/send-screen'
import SendReviewScreen from '../screens/wallet-features/send/send-review-screen'
import CustomFeeScreen from '../screens/wallet-features/custom-fee/custom-fee-screen'
import SendConfirmationScreen from '../screens/wallet-features/send/send-confirmation-screen'
import {
  MainStackParamList,
  RootStackParamList,
  RootTabParamList,
  SettingStackParamList,
} from '../types'
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
import {
  Box,
  faceliftPalette,
  HEADER_TITLE_STYLE,
  palette,
  Text,
  ThemeIcon,
} from '../theme'
import ShowAllNftsScreen from '../screens/wallet-features/NFT/show-all-nfts-screen'
import NftDetailScreen from '../screens/wallet-features/NFT/nft-detail-screen'
import NftSendScreen from '../screens/wallet-features/NFT/nft-send-screen'
import NftForSpecificChainScreen from '../screens/wallet-features/NFT/nft-for-specific-chain-screen'
import NftCollectionScreen from '../screens/wallet-features/NFT/nft-collection-screen'

import { AppIcons, Fonts } from '../assets'
import { networkState, themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'
import { labelTranslateFn } from '../utils'

const {
  SwapCheck,
  TimesIcon,
  NetworkActiveDot,
  Ellipses,
  ChevronLeft,
  TabNFT,
  TabSetting,
  TabWallet,
  TabNFTInactive,
  TabSettingInactive,
  TabWalletInactive,
} = AppIcons

const WalletCreationStack = createNativeStackNavigator<RootStackParamList>()
const MainStack = createNativeStackNavigator<MainStackParamList>()
const SettingStack = createNativeStackNavigator<SettingStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()

export const OnboardingContext = createContext({})

const PlaceholderComp = () => <Box />

const screenNavOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTitle: '',
  headerShadowVisible: false,
  headerBackVisible: false,
}

const LiqLogoHeaderLeft = () => {
  return (
    <Box marginLeft={'onboardingHeaderPadding'}>
      <ThemeIcon iconName="OnlyLqLogo" />
    </Box>
  )
}

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
      <WalletCreationStack.Navigator
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
        <WalletCreationStack.Screen
          name="Entry"
          component={Entry}
          options={{ ...screenNavOptions, headerTransparent: true }}
        />
        <WalletCreationStack.Screen
          name="TermsScreen"
          component={TermsScreen}
          options={{
            ...screenNavOptions,
            headerStyle: { backgroundColor },
            headerLeft: LiqLogoHeaderLeft,
          }}
        />
        <WalletCreationStack.Screen
          name="PasswordCreationScreen"
          component={PasswordCreationScreen}
          options={{ ...screenNavOptions, headerTransparent: true }}
        />
        <WalletCreationStack.Screen
          name="SeedPhraseScreen"
          component={SeedPhraseScreen}
        />
        <WalletCreationStack.Screen
          name="SeedPhraseConfirmationScreen"
          component={SeedPhraseConfirmationScreen}
        />
        <WalletCreationStack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
        />
        <WalletCreationStack.Screen
          name="CongratulationsScreen"
          component={CongratulationsScreen}
        />
        <WalletCreationStack.Screen
          name="UnlockWalletScreen"
          component={UnlockWalletScreen}
          options={{
            ...screenNavOptions,
            headerTitleStyle: HEADER_TITLE_STYLE,
            headerStyle: { backgroundColor },
            headerLeft: LiqLogoHeaderLeft,
          }}
        />
      </WalletCreationStack.Navigator>
    </OnboardingContext.Provider>
  )
}

type NavigationProps = NativeStackScreenProps<
  MainStackParamList,
  | 'OverviewScreen'
  | 'SendConfirmationScreen'
  | 'BackupWarningScreen'
  | 'SwapConfirmationScreen'
>

const SwapCheckHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  return (
    <Pressable onPress={() => navigation.navigate('OverviewScreen', {})}>
      <SwapCheck style={styles.checkIcon} width={20} height={20} />
    </Pressable>
  )
}

const BackupWarningHeaderLeft = () => (
  <Text style={styles.settingsTitle} tx="warning" />
)

const BackupWarningHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps

  return (
    <Pressable onPress={navigation.goBack}>
      <TimesIcon
        width={30}
        height={30}
        color={palette.timesIconColor}
        style={styles.checkIcon}
      />
    </Pressable>
  )
}

const AppStackHeaderLeft = (
  headerProps: HeaderBackButtonProps,
  navProps: NavigationProps,
) => {
  const { navigation } = navProps

  const canGoBack = navigation.canGoBack()

  return (
    <Box flexDirection={'row'} alignItems="center">
      {canGoBack ? (
        <TouchableWithoutFeedback onPress={navigation.goBack}>
          <Box paddingHorizontal={'s'} paddingVertical="m">
            <ChevronLeft width={scale(15)} height={scale(15)} />
          </Box>
        </TouchableWithoutFeedback>
      ) : null}
      <Box paddingLeft={'s'}>
        <ThemeIcon iconName="OnlyLqLogo" />
      </Box>
    </Box>
  )
}

const AppStackHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  const activeNetwork = useRecoilValue(networkState)

  return (
    <Box flexDirection={'row'} alignItems={'center'} padding="s">
      <Box
        backgroundColor={'mediumWhite'}
        flexDirection={'row'}
        alignItems={'center'}
        paddingVertical={'s'}
        paddingHorizontal={'m'}
        marginRight="s">
        <NetworkActiveDot />
        <Text paddingLeft={'s'} color="darkGrey" variant="networkStatus">
          {`${activeNetwork}`.toUpperCase()}
        </Text>
      </Box>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('WithPopupMenu')
        }}>
        <Box padding="s">
          <Ellipses width={20} height={20} />
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const appStackScreenNavOptions = (
  screentitle = '',
): NativeStackNavigationOptions => ({
  headerShown: true,
  headerTitle: screentitle,
  headerShadowVisible: false,
  headerBackVisible: false,
})

export const AppStackNavigator = () => (
  <MainStack.Navigator
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
      headerLeft: (props) => AppStackHeaderLeft(props, { navigation, route }),
      headerRight: () => AppStackHeaderRight({ navigation, route }),
    })}>
    <MainStack.Group>
      <MainStack.Screen
        name="OverviewScreen"
        options={{
          ...appStackScreenNavOptions(),
        }}>
        {(props) => OverviewScreen(props)}
      </MainStack.Screen>
      <MainStack.Screen
        name="AssetChooserScreen"
        options={() => ({
          headerRight: PlaceholderComp,
        })}>
        {(props) => AssetChooserScreen(props)}
      </MainStack.Screen>
      <MainStack.Screen name="AssetScreen">
        {(props) => AssetScreen(props)}
      </MainStack.Screen>
      <MainStack.Screen
        name="ReceiveScreen"
        component={ReceiveScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SendScreen"
        component={SendScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SendReviewScreen"
        component={SendReviewScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="CustomFeeScreen"
        component={CustomFeeScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="CustomFeeEIP1559Screen"
        component={CustomFeeEIP1559Screen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SendConfirmationScreen"
        component={SendConfirmationScreen}
        options={({ navigation, route }: NavigationProps) => ({
          headerRight: () => SwapCheckHeaderRight({ navigation, route }),
          title: route?.params?.screenTitle || 'Overview',
          headerLeft: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="AssetManagementScreen"
        component={AssetManagementScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="AssetToggleScreen"
        component={AssetToggleScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SwapScreen"
        component={SwapScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SwapReviewScreen"
        component={SwapReviewScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="SwapConfirmationScreen"
        component={SwapConfirmationScreen}
        options={({ navigation, route }: NavigationProps) => ({
          headerRight: () => SwapCheckHeaderRight({ navigation, route }),
          title: route?.params?.screenTitle || 'Overview',
          headerLeft: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="NftForSpecificChainScreen"
        component={NftForSpecificChainScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="NftDetailScreen"
        component={NftDetailScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="NftSendScreen"
        component={NftSendScreen}
        options={() => ({
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="NftCollectionScreen"
        component={NftCollectionScreen}
        options={() => ({
          headerShown: false,

          headerRight: PlaceholderComp,
        })}
      />
    </MainStack.Group>
    <MainStack.Group
      screenOptions={{
        presentation: 'transparentModal',
        headerLeft: undefined,
        headerRight: undefined,
      }}>
      <MainStack.Screen
        name="WithPopupMenu"
        component={WithPopupMenu}
        options={{ headerShown: true, headerTransparent: true }}
      />
    </MainStack.Group>
  </MainStack.Navigator>
)

const tabIcons = {
  [`${labelTranslateFn('wallet')!}`]: TabWallet,
  [`${labelTranslateFn('tabNFT')!}`]: TabNFT,
  [`${labelTranslateFn('settings')!}`]: TabSetting,
}

const tabInactiveIcons = {
  [`${labelTranslateFn('wallet')!}`]: TabWalletInactive,
  [`${labelTranslateFn('tabNFT')!}`]: TabNFTInactive,
  [`${labelTranslateFn('settings')!}`]: TabSettingInactive,
}

const TabSettingsScreenHeaderLeft = () => (
  <Box paddingHorizontal={'s'}>
    <ThemeIcon iconName="OnlyLqLogo" />
  </Box>
)

const TabBarOption = (title: string) => {
  return {
    tabBarLabel: title,
    tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => {
      const Icon = focused ? tabIcons[title] : tabInactiveIcons[title]
      return <Icon width={size} height={size} />
    },
  }
}

const SettingStackNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white

  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          ...screenNavOptions,
          headerStyle: { backgroundColor },
          headerLeft: TabSettingsScreenHeaderLeft,
        }}
      />
    </SettingStack.Navigator>
  )
}

export const MainNavigator = () => (
  <Tab.Navigator
    initialRouteName="AppStackNavigator"
    screenOptions={{
      headerShown: false,
      headerTitle: '',
      tabBarLabelStyle: {
        fontFamily: Fonts.JetBrainsMono,
        fontWeight: '500',
        fontSize: scale(11),
      },
      tabBarActiveTintColor: palette.buttonDefault,
      tabBarInactiveTintColor: palette.nestedColor,
    }}>
    <Tab.Screen
      name="AppStackNavigator"
      component={AppStackNavigator}
      options={{ ...TabBarOption(labelTranslateFn('wallet')!) }}
    />
    <Tab.Screen
      name="ShowAllNftsScreen"
      component={ShowAllNftsScreen}
      options={{ ...TabBarOption(labelTranslateFn('tabNFT')!) }}
    />
    <Tab.Screen
      name="SettingsScreen"
      component={SettingStackNavigator}
      options={{
        ...TabBarOption(labelTranslateFn('settings')!),
        headerShown: false,
        headerLeft: undefined,
      }}
    />
  </Tab.Navigator>
)

export const StackMainNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white

  return (
    <MainStack.Navigator initialRouteName="LoginScreen">
      <MainStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ ...screenNavOptions, headerTransparent: true }}
      />
      <MainStack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={() => ({
          headerShown: false,
          headerRight: PlaceholderComp,
        })}
      />
      <MainStack.Screen
        name="BackupWarningScreen"
        component={BackupWarningScreen}
        options={({ navigation, route }: NavigationProps) => ({
          headerShown: true,
          headerTitle: '',
          headerLeft: BackupWarningHeaderLeft,
          headerRight: () => BackupWarningHeaderRight({ navigation, route }),
        })}
      />
      <MainStack.Screen
        name="BackupLoginScreen"
        component={BackupLoginScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="BackupSeedScreen"
        component={BackupSeedScreen}
        options={({}) => ({
          headerShown: false,
        })}
      />
      <MainStack.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{
          ...screenNavOptions,
          headerStyle: { backgroundColor },
          headerLeft: LiqLogoHeaderLeft,
        }}
      />
      <MainStack.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
        options={{ ...screenNavOptions, headerTransparent: true }}
      />
      <MainStack.Screen name="SeedPhraseScreen" component={SeedPhraseScreen} />
      <MainStack.Screen
        name="SeedPhraseConfirmationScreen"
        component={SeedPhraseConfirmationScreen}
      />
      <MainStack.Screen name="LoadingScreen" component={LoadingScreen} />
      <MainStack.Screen
        name="CongratulationsScreen"
        component={CongratulationsScreen}
      />
      <MainStack.Screen
        name="UnlockWalletScreen"
        component={UnlockWalletScreen}
        options={{
          ...screenNavOptions,
          headerTitleStyle: HEADER_TITLE_STYLE,
          headerStyle: { backgroundColor },
          headerLeft: LiqLogoHeaderLeft,
        }}
      />
    </MainStack.Navigator>
  )
}

const styles = StyleSheet.create({
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
