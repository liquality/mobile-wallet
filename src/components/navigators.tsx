import React, { createContext } from 'react'
import {
  StyleSheet,
  Pressable,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
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
import BuyCryptoDrawer from './buy-crpto-drawer'
import AssetChooserScreen from '../screens/wallet-features/asset/asset-chooser-screen'
import AssetManagementScreen from '../screens/wallet-features/asset/asset-management-screen'

import AssetToggleScreen from '../screens/wallet-features/asset/asset-toggle-screen'
import SwapScreen from '../screens/wallet-features/swap/swap-screen'
import SwapReviewScreen from '../screens/wallet-features/swap/swap-review-screen'
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
  MANAGE_ASSET_HEADER,
  palette,
  Text,
  ThemeIcon,
} from '../theme'
import ShowAllNftsScreen from '../screens/wallet-features/NFT/show-all-nfts-screen'
import NftDetailScreen from '../screens/wallet-features/NFT/nft-detail-screen'
import NftSendScreen from '../screens/wallet-features/NFT/nft-send-screen'
import NftForSpecificChainScreen from '../screens/wallet-features/NFT/nft-for-specific-chain-screen'
import NftCollectionScreen from '../screens/wallet-features/NFT/nft-collection-screen'
import SelectChainScreen from '../screens/wallet-features/settings/select-chain-screen'
import { AppIcons, Fonts } from '../assets'
import { networkState, showSearchBarInputState, themeMode } from '../atoms'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'
import { labelTranslateFn } from '../utils'
import NftOverviewScreen from '../screens/wallet-features/NFT/nft-overview-screen'
import BackupPrivateKeyScreen from '../screens/wallet-features/backup/backup-private-key-screen'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import SwapDetailsScreen from '../screens/wallet-features/swap/swap-details-screen'

const {
  SwapCheck,
  NetworkActiveDot,
  Ellipses,
  ChevronLeft,
  TabNFT,
  TabSetting,
  TabWallet,
  TabNFTInactive,
  TabSettingInactive,
  TabWalletInactive,
  SearchIcon,
  // BuyCryptoCloseDark,
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

const DoneButton = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const onDonePress = () => {
    navigation.navigate('AppStackNavigator')
  }
  return (
    <Box paddingHorizontal={'s'}>
      <Text
        variant={'listText'}
        color="defaultButton"
        tx="receiveScreen.done"
        onPress={onDonePress}
      />
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
          options={{
            ...screenNavOptions,
            headerTitleStyle: HEADER_TITLE_STYLE,
            headerStyle: { backgroundColor },
            headerLeft: LiqLogoHeaderLeft,
          }}
        />
        <WalletCreationStack.Screen
          name="SeedPhraseConfirmationScreen"
          component={SeedPhraseConfirmationScreen}
          options={{
            ...screenNavOptions,
            headerStyle: { backgroundColor },
            headerLeft: LiqLogoHeaderLeft,
          }}
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
  | 'AssetManagementScreen'
  | 'AssetChooserScreen'
  | 'ReceiveScreen'
  | 'SwapDetailsScreen'
>

const SwapCheckHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  return (
    <Pressable onPress={() => navigation.navigate('OverviewScreen', {})}>
      <SwapCheck style={styles.checkIcon} width={20} height={20} />
    </Pressable>
  )
}

const AppStackHeaderLeft = (navProps: NavigationProps) => {
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

const AssetManageScreenHeaderLeft = (navProps: NavigationProps) => {
  const { navigation } = navProps

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <Box paddingHorizontal={'s'} paddingVertical="m">
        <ChevronLeft width={scale(15)} height={scale(15)} />
      </Box>
    </TouchableWithoutFeedback>
  )
}

const AssetManageScreenHeaderRight = () => {
  const setShowSearchBar = useSetRecoilState(showSearchBarInputState)

  const setNavigationOpt = () => {
    setShowSearchBar((prev) => !prev)
  }

  return (
    <Box paddingHorizontal={'s'} paddingVertical="m">
      <TouchableOpacity activeOpacity={0.7} onPress={setNavigationOpt}>
        <SearchIcon width={scale(15)} height={scale(15)} />
      </TouchableOpacity>
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

export const AppStackNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white
  const showSearchBar = useRecoilValue(showSearchBarInputState)

  return (
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
        headerShadowVisible: false,
        title: '',
        headerLeft: () => AppStackHeaderLeft({ navigation, route }),
        headerRight: () => AppStackHeaderRight({ navigation, route }),
      })}>
      <MainStack.Group>
        <MainStack.Screen
          name="OverviewScreen"
          options={{
            headerStyle: { backgroundColor },
            ...appStackScreenNavOptions(),
          }}>
          {(props) => OverviewScreen(props)}
        </MainStack.Screen>
        <MainStack.Screen
          name="AssetChooserScreen"
          component={AssetChooserScreen}
          options={({ navigation, route }: NavigationProps) => ({
            headerBackVisible: false,
            title: route.params.screenTitle || '',
            headerTitleStyle: MANAGE_ASSET_HEADER,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: () =>
              AssetManageScreenHeaderLeft({ navigation, route }),
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
          options={({ navigation, route }: NavigationProps) => ({
            headerBackVisible: false,
            title: showSearchBar ? '' : labelTranslateFn('manageAssetsCaps')!,
            headerTitleStyle: MANAGE_ASSET_HEADER,
            headerStyle: { backgroundColor },
            headerRight: () => AssetManageScreenHeaderRight(),
            headerLeft: showSearchBar
              ? undefined
              : () => AssetManageScreenHeaderLeft({ navigation, route }),
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
          name="NftForSpecificChainScreen"
          component={NftForSpecificChainScreen}
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
        <MainStack.Screen
          name="NftOverviewScreen"
          component={NftOverviewScreen}
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
        <MainStack.Screen
          name="BuyCryptoDrawer"
          component={BuyCryptoDrawer}
          options={{ headerShown: true, headerTransparent: true }}
        />
      </MainStack.Group>
    </MainStack.Navigator>
  )
}

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

export const MainNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white
  return (
    <Tab.Navigator
      initialRouteName="AppStackNavigator"
      screenOptions={{
        headerShown: false,
        headerTitle: '',
        tabBarStyle: {
          backgroundColor,
        },
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
}

const StackMainNavigatorHeaderLeft = () => {
  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <Box paddingHorizontal={'s'} paddingVertical="m">
        <ChevronLeft width={scale(15)} height={scale(15)} />
      </Box>
    </TouchableWithoutFeedback>
  )
}

// const BuyCryptoDrawerHeaderRight = () => {
//   const navigation = useNavigation<NavigationProp<MainStackParamList>>()
//   return (
//     <Box paddingHorizontal={'m'}>
//       <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
//         <BuyCryptoCloseDark />
//       </TouchableOpacity>
//     </Box>
//   )
// }

//If you dont want your screen to include tabbar, add it to StackMainNavigator obj
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
      <MainStack.Group>
        <MainStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ ...screenNavOptions, headerTransparent: true }}
        />
        <MainStack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{
            headerShown: false,
            headerRight: PlaceholderComp,
          }}
        />
        <MainStack.Screen
          name="BackupWarningScreen"
          component={BackupWarningScreen}
          options={screenNavOptions}
        />
        <MainStack.Screen
          name="BackupPrivateKeyScreen"
          component={BackupPrivateKeyScreen}
          options={{ ...screenNavOptions, headerRight: DoneButton }}
        />
        <MainStack.Screen
          name="SelectChainScreen"
          component={SelectChainScreen}
          options={{
            ...screenNavOptions,
            headerTitle: labelTranslateFn('selectChain')!,
            headerTitleStyle: HEADER_TITLE_STYLE,
            headerLeft: StackMainNavigatorHeaderLeft,
            headerStyle: { backgroundColor },
          }}
        />
        <MainStack.Screen
          name="BackupLoginScreen"
          component={BackupLoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <MainStack.Screen
          name="BackupSeedScreen"
          component={BackupSeedScreen}
          options={{
            headerShown: false,
          }}
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
        <MainStack.Screen
          name="SeedPhraseScreen"
          component={SeedPhraseScreen}
          options={{
            ...screenNavOptions,
            headerTitleStyle: HEADER_TITLE_STYLE,
            headerStyle: { backgroundColor },
            headerLeft: LiqLogoHeaderLeft,
          }}
        />
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
        <MainStack.Screen
          name="ReceiveScreen"
          component={ReceiveScreen}
          options={({ route }: NavigationProps) => ({
            headerShadowVisible: false,
            headerBackVisible: false,
            title: route.params.screenTitle || '',
            headerTitleStyle: MANAGE_ASSET_HEADER,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: undefined,
          })}
        />
        <MainStack.Screen
          name="SwapDetailsScreen"
          component={SwapDetailsScreen}
          options={{
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTitle: labelTranslateFn('swapDetails')!,
            headerTitleStyle: MANAGE_ASSET_HEADER,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: StackMainNavigatorHeaderLeft,
          }}
        />
        <MainStack.Screen
          name="AssetScreen"
          component={AssetScreen}
          options={{
            ...screenNavOptions,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: StackMainNavigatorHeaderLeft,
          }}
        />
        <MainStack.Screen
          name="NftDetailScreen"
          component={NftDetailScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <MainStack.Screen
          name="NftSendScreen"
          component={NftSendScreen}
          options={() => ({
            headerShown: false,
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
          name="BuyCryptoDrawer"
          component={BuyCryptoDrawer}
          options={{
            ...screenNavOptions,
            // headerStyle: {
            //   backgroundColor: faceliftPalette.white,
            // },
            headerTransparent: true,
            // headerTitle: () => (
            //   <Box
            //     marginLeft={'l'}
            //     width={SCREEN_WIDTH}
            //     flexDirection="row"
            //     justifyContent={'space-between'}
            //     alignItems="flex-start">
            //     <Text variant={'buyCryptoHeader'} color="darkGrey">
            //       BuyCrypto
            //     </Text>
            //   </Box>
            // ),
            headerLeft: undefined,
            // headerRight: BuyCryptoDrawerHeaderRight,
          }}
        />
      </MainStack.Group>
    </MainStack.Navigator>
  )
}

const styles = StyleSheet.create({
  checkIcon: {
    marginRight: 20,
  },
})
