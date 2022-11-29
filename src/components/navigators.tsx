import React, { createContext, useEffect, useState } from 'react'
import {
  Pressable,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import {
  createNativeStackNavigator,
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
import CustomFeeScreen from '../screens/wallet-features/custom-fee/custom-fee-screen'
import SendConfirmationScreen from '../screens/wallet-features/send/send-confirmation-screen'
import {
  LoginStackParamList,
  MainStackParamList,
  NavigationProps,
  RootParentStackList,
  RootStackParamList,
  RootTabParamList,
  SettingStackParamList,
} from '../types'
import WithPopupMenu from './with-popup-menu'
import BuyCryptoDrawer from './buy-crpto-drawer'
import SwapProviderModal from './swap-provider-modal'
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
  NORMAL_HEADER,
  palette,
  Text,
  ThemeIcon,
  ThemeType,
  WHITE_HEADER,
} from '../theme'
import ShowAllNftsScreen from '../screens/wallet-features/NFT/show-all-nfts-screen'
import NftDetailScreen from '../screens/wallet-features/NFT/nft-detail-screen'
import NftSendScreen from '../screens/wallet-features/NFT/nft-send-screen'
import NftForSpecificChainScreen from '../screens/wallet-features/NFT/nft-for-specific-chain-screen'

import NftCollectionScreen from '../screens/wallet-features/NFT/nft-collection-screen'
import SelectChainScreen from '../screens/wallet-features/settings/select-chain-screen'
import { AppIcons, Fonts } from '../assets'
import {
  aboutVisitedState,
  assetScreenPopupMenuVisible,
  historyItemsState,
  networkState,
  showSearchBarInputState,
  themeMode,
} from '../atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { scale } from 'react-native-size-matters'
import { downloadAssetAcitivity, labelTranslateFn } from '../utils'
import NftOverviewScreen from '../screens/wallet-features/NFT/nft-overview-screen'
import BackupPrivateKeyScreen from '../screens/wallet-features/backup/backup-private-key-screen'
import { useNavigation, NavigationProp } from '@react-navigation/core'
import SwapDetailsScreen from '../screens/wallet-features/swap/swap-details-screen'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import InitInjectionScreen from '../screens/wallet-injection/initiate-injection-screen'
import WalletConnectController from '../controllers/walletConnectController'
import ApproveTransactionInjectionScreen from '../screens/wallet-injection/approve-transaction-injection'
import { emitterController } from '../controllers/emitterController'
import { INJECTION_REQUESTS } from '../controllers/constants'
import SwitchChainScreen from '../screens/wallet-injection/switch-chain-screen'
const { ON_SESSION_REQUEST } = INJECTION_REQUESTS
import ActivityFilterScreen from '../screens/wallet-features/home/activity-filter-screen'
import AdvancedFilterModal from '../screens/wallet-features/home/advanced-filter-modal'
import SortingModal from '../screens/wallet-features/home/sorting-modal'
import AccountManagementScreen from '../screens/wallet-features/asset/account-management-screen'
import SwapProviderInfoDrawer from './swap-provider-info-drawer'
import AccountDetailScreen from '../screens/wallet-features/asset/account-detail-screen'
import AssetIcon from './asset-icon'
import AboutLiqualityDrawer from './about-liquality-drawer'
import { useTheme } from '@shopify/restyle'

const {
  NetworkActiveDot,
  Ellipses,
  ChevronLeft,
  TabNFT,
  TabSetting,
  TabWallet,
  TabNFTInactive,
  TabSettingInactive,
  TabWalletInactive,
  BuyCryptoCloseDark,
  Connect,
  ConnectSolid,
  XIcon,
  BuyCryptoCloseLight,
  SwapQuotes,
  ExportIcon,
  ConnectionIndicator,
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

const AboutScreenRightBtn = (showDoneBtn: boolean) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  const theme = useTheme<ThemeType>()

  const setAboutVisited = useSetRecoilState(aboutVisitedState)

  const onPress = () => {
    setAboutVisited(true)
    navigation.goBack()
  }

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: theme.spacing.l }}
      onPress={onPress}>
      <Text
        variant={'listText'}
        color="white"
        tx={showDoneBtn ? 'common.done' : 'skip'}
        marginTop={'s'}
      />
    </TouchableOpacity>
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

const AssetScreenHeaderRight = () => {
  const [isAssetScreenPopupMenuVisible, setAssetScreenPopuMenuVisible] =
    useRecoilState(assetScreenPopupMenuVisible)

  return (
    <Box flexDirection={'row'} alignItems={'center'} padding="s">
      <ConnectionIndicator />

      <TouchableWithoutFeedback
        onPress={() =>
          setAssetScreenPopuMenuVisible(!isAssetScreenPopupMenuVisible)
        }>
        <Box padding="s" marginLeft={'l'}>
          <Ellipses width={20} height={20} />
        </Box>
      </TouchableWithoutFeedback>
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
        <WalletCreationStack.Group>
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
            options={{
              headerShown: false,
            }}
          />
          <WalletCreationStack.Screen
            name="CongratulationsScreen"
            component={CongratulationsScreen}
            options={{
              headerShown: false,
            }}
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
        </WalletCreationStack.Group>
        <WalletCreationStack.Group>
          <WalletCreationStack.Screen
            name="AboutLiqualityDrawer"
            component={AboutLiqualityDrawer}
            options={({ route }: NavigationProps) => {
              const { showDoneBtn = false } = route.params
              return {
                ...screenNavOptions,
                headerTransparent: true,
                presentation: 'fullScreenModal',
                headerTitleStyle: WHITE_HEADER,
                headerTitle: labelTranslateFn('aboutLiquality')!,
                headerLeft: undefined,
                headerRight: () => AboutScreenRightBtn(showDoneBtn),
              }
            }}
          />
        </WalletCreationStack.Group>
      </WalletCreationStack.Navigator>
    </OnboardingContext.Provider>
  )
}

const SwapCheckHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  return (
    <Pressable onPress={() => navigation.navigate('OverviewScreen', {})}>
      <Text variant={'headerLink'} tx={'common.done'} />
    </Pressable>
  )
}

const AppStackHeaderLeft = (navProps: NavigationProps) => {
  const { navigation, route } = navProps

  const canGoBack = route.name !== 'OverviewScreen' && navigation.canGoBack()

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

const ManageScreenHeaderLeft = (navProps: NavigationProps) => {
  const { navigation } = navProps

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <Box paddingHorizontal={'s'} paddingVertical="m">
        <ChevronLeft width={scale(15)} height={scale(15)} />
      </Box>
    </TouchableWithoutFeedback>
  )
}

const SwapHeaderRight = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()

  const onPress = () =>
    navigation.navigate('SwapProviderInfoDrawer', { isScrolledUp: false })

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Box paddingHorizontal={'s'} paddingVertical="m">
        <SwapQuotes width={scale(25)} />
      </Box>
    </TouchableOpacity>
  )
}

const ActivityFilterScreenHeaderRight = () => {
  const historyItem = useRecoilValue(historyItemsState)

  const onExportIconPress = async () => {
    try {
      await downloadAssetAcitivity(historyItem)
    } catch (error) {}
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onExportIconPress()}>
      <Box paddingHorizontal={'s'} paddingVertical="m">
        <ExportIcon width={scale(25)} />
      </Box>
    </TouchableOpacity>
  )
}

const AppStackHeaderRight = (navProps: NavigationProps) => {
  const { navigation } = navProps
  const activeNetwork = useRecoilValue(networkState)
  const [walletConnectData, setWalletConnectData] = useState(null)

  const [showQRScanner, setShowQRScanner] = useState(false)
  const onSuccess = (e) => {
    new WalletConnectController(e.data)
    navigation.navigate('InitInjectionScreen', { uri: e.data })
    setShowQRScanner(false)
  }

  //To check if there is a session connected or not
  useEffect(() => {
    emitterController.on(ON_SESSION_REQUEST, ({ params }: any) => {
      const [data] = params
      setWalletConnectData(data)
    })
  }, [])

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
      <Box>
        {showQRScanner ? (
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.torch}
            topContent={
              <Text style={styles.centerText}>
                Go to{' '}
                <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text>{' '}
                on your computer and scan the QR code.
              </Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>OK. Got it!</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <Box style={styles.container}>
            <Pressable onPress={() => setShowQRScanner(true)}>
              {walletConnectData ? <ConnectSolid /> : <Connect />}
            </Pressable>
          </Box>
        )}
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

const WalletConnectHeader = () => {
  const [walletConnectData, setWalletConnectData] = useState(null)
  const [, setShowQRScanner] = useState(false)
  //To check if there is a session connected or not
  useEffect(() => {
    emitterController.on(ON_SESSION_REQUEST, ({ params }: any) => {
      const [data] = params
      setWalletConnectData(data)
    })
  }, [])
  return (
    <Box
      flexDirection={'row'}
      alignItems={'center'}
      padding="s"
      justifyContent={'space-between'}>
      <Box>
        <Box style={styles.container}>
          <Pressable onPress={() => setShowQRScanner(true)}>
            {walletConnectData ? <ConnectSolid /> : <Connect />}
          </Pressable>
        </Box>
      </Box>
    </Box>
  )
}

const GoBackHeader = (navProps: NavigationProps) => {
  const { navigation } = navProps
  return (
    <Box>
      <Box>
        <Pressable
          onPress={() => {
            navigation.goBack()
          }}>
          <XIcon />
        </Pressable>
      </Box>
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
          component={OverviewScreen}
          options={{
            headerStyle: { backgroundColor },
            ...appStackScreenNavOptions(),
          }}
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
          name="AssetToggleScreen"
          component={AssetToggleScreen}
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
          height: 88,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.JetBrainsMono,
          fontWeight: '500',
          fontSize: scale(10.5),
          marginTop: scale(-10),
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

const CloseButtonPlaceholder = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  return (
    <Box paddingHorizontal={'m'}>
      <TouchableOpacity
        disabled
        activeOpacity={0.7}
        onPress={navigation.goBack}
      />
    </Box>
  )
}

const CloseButton = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  return (
    <Box paddingHorizontal={'m'}>
      <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
        <BuyCryptoCloseDark />
      </TouchableOpacity>
    </Box>
  )
}

const CloseButtonLight = () => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>()
  return (
    <Box paddingHorizontal={'m'}>
      <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
        <BuyCryptoCloseLight />
      </TouchableOpacity>
    </Box>
  )
}

const AssetScreenHeaderTitle = (navProps: NavigationProps) => {
  const { route } = navProps
  return (
    <Box flexDirection={'row'} alignItems={'center'} paddingVertical={'s'}>
      <Box
        borderLeftWidth={3}
        height={scale(1.3 * 16)}
        style={{
          borderLeftColor: route.params.assetData?.color,
        }}
      />
      <Text variant={'headerTitle'} marginLeft={'m'}>
        {route.params.screenTitle?.toUpperCase()}
      </Text>
    </Box>
  )
}

const AccountDetailScreenHeaderRight = () => {
  const activeNetwork = useRecoilValue(networkState)
  return (
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
  )
}

const AccountDetailScreenHeaderTitle = (navProps: NavigationProps) => {
  const { route } = navProps
  const { assetData } = route.params
  return (
    <Box flexDirection={'row'}>
      {assetData && assetData.chain ? (
        <Box height={scale(1.3 * 16)}>
          <AssetIcon chain={assetData?.chain} />
        </Box>
      ) : null}
      <Text variant={'headerTitle'} marginLeft={'m'} tx="details" />
    </Box>
  )
}

const semiTransparentDrawerStyle = (
  isScrolledUp: boolean,
  activeScreenTitle: string,
  inactiveScreenTitle: string,
): NativeStackNavigationOptions => {
  return {
    ...screenNavOptions,
    presentation: isScrolledUp ? 'fullScreenModal' : 'transparentModal',
    headerStyle: {
      backgroundColor: isScrolledUp
        ? faceliftPalette.white
        : faceliftPalette.transparent,
    },
    headerTransparent: !isScrolledUp,
    headerTitleStyle: NORMAL_HEADER,
    headerTitle: isScrolledUp ? activeScreenTitle : inactiveScreenTitle,
    headerLeft: undefined,
    headerRight: isScrolledUp ? CloseButton : CloseButtonPlaceholder,
  }
}

//If you dont want your screen to include tabbar, add it to StackMainNavigator obj
export const StackMainNavigator = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white
  const showSearchBar = useRecoilValue(showSearchBarInputState)

  return (
    <MainStack.Navigator>
      <MainStack.Group>
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
          options={{ ...screenNavOptions, headerTransparent: true }}
        />
        <MainStack.Screen
          name="BackupSeedScreen"
          component={BackupSeedScreen}
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
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: StackMainNavigatorHeaderLeft,
          })}
        />
        <MainStack.Screen
          name="AssetManagementScreen"
          component={AssetManagementScreen}
          options={() => ({
            headerBackVisible: false,
            title: showSearchBar ? '' : labelTranslateFn('manageAssetsCaps')!,
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerShadowVisible: false,
            headerShown: false,
          })}
        />
        <MainStack.Screen
          name="AccountManagementScreen"
          component={AccountManagementScreen}
          options={({ navigation, route }: NavigationProps) => ({
            headerBackVisible: false,
            title: labelTranslateFn('manageChainAcc')!,
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerShadowVisible: false,
            headerRight: undefined,
            headerLeft: () => ManageScreenHeaderLeft({ navigation, route }),
          })}
        />
        <MainStack.Screen
          name="AssetChooserScreen"
          component={AssetChooserScreen}
          options={({ navigation, route }: NavigationProps) => ({
            headerShadowVisible: false,
            headerBackVisible: false,
            title: route.params.screenTitle || '',
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerRight: undefined,
            headerLeft: () => ManageScreenHeaderLeft({ navigation, route }),
          })}
        />
        <MainStack.Screen
          name="SendScreen"
          component={SendScreen}
          options={({ route }: NavigationProps) => ({
            headerShadowVisible: false,
            title: route.params.screenTitle || '',
            headerBackVisible: false,
            headerRight: undefined,
            headerTitleStyle: HEADER_TITLE_STYLE,
            headerLeft: StackMainNavigatorHeaderLeft,
          })}
        />
        <MainStack.Screen
          name="SwapScreen"
          component={SwapScreen}
          options={() => ({
            headerBackVisible: false,
            headerShadowVisible: false,
            title: labelTranslateFn('assetScreen.swap') || '',
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerLeft: StackMainNavigatorHeaderLeft,
            headerRight: SwapHeaderRight,
          })}
        />
        <MainStack.Screen
          name="SwapDetailsScreen"
          component={SwapDetailsScreen}
          options={({ navigation, route }: NavigationProps) => ({
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTitle: labelTranslateFn('swapDetails')!,
            headerTitleStyle: NORMAL_HEADER,
            headerStyle: { backgroundColor },
            headerRight: () => SwapCheckHeaderRight({ navigation, route }),
            headerLeft: undefined,
          })}
        />
        <MainStack.Screen
          name="AssetScreen"
          component={AssetScreen}
          options={({ route, navigation }: NavigationProps) => ({
            ...screenNavOptions,
            headerTitle: () => AssetScreenHeaderTitle({ route, navigation }),
            headerStyle: { backgroundColor },
            headerRight: AssetScreenHeaderRight,
            headerLeft: StackMainNavigatorHeaderLeft,
          })}
        />
        <MainStack.Screen
          name="AccountDetailScreen"
          component={AccountDetailScreen}
          options={({ route, navigation }: NavigationProps) => ({
            ...screenNavOptions,
            headerTitle: () =>
              AccountDetailScreenHeaderTitle({ route, navigation }),
            headerStyle: { backgroundColor },
            headerRight: AccountDetailScreenHeaderRight,
            headerLeft: StackMainNavigatorHeaderLeft,
          })}
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
        <MainStack.Screen
          name="InitInjectionScreen"
          component={InitInjectionScreen}
          options={({ navigation, route }: NavigationProps) => ({
            ...screenNavOptions,
            headerRight: () => WalletConnectHeader(),
            headerLeft: () => GoBackHeader({ navigation, route }),
          })}
        />
        <MainStack.Screen
          name="SwitchChainScreen"
          component={SwitchChainScreen}
          options={({ navigation, route }: NavigationProps) => ({
            ...screenNavOptions,
            headerRight: () => WalletConnectHeader(),
            headerLeft: () => GoBackHeader({ navigation, route }),
          })}
        />

        <MainStack.Screen
          name="ApproveTransactionInjectionScreen"
          component={ApproveTransactionInjectionScreen}
          options={({ navigation, route }: NavigationProps) => ({
            ...screenNavOptions,
            headerRight: () => WalletConnectHeader(),
            headerLeft: () => GoBackHeader({ navigation, route }),
          })}
        />
        <MainStack.Screen
          name="SendConfirmationScreen"
          component={SendConfirmationScreen}
          options={({ navigation, route }: NavigationProps) => ({
            headerShadowVisible: false,
            headerRight: () => SwapCheckHeaderRight({ navigation, route }),
            headerTitleStyle: NORMAL_HEADER,
            title: route?.params?.screenTitle || 'Overview',
            headerLeft: PlaceholderComp,
          })}
        />
      </MainStack.Group>
      <MainStack.Group>
        <MainStack.Screen
          name="BuyCryptoDrawer"
          component={BuyCryptoDrawer}
          options={({ route }: NavigationProps) => {
            const { isScrolledUp = false, screenTitle = '' } = route.params
            const empty = ''
            return semiTransparentDrawerStyle(isScrolledUp, screenTitle, empty)
          }}
        />
        <MainStack.Screen
          name="SwapProviderModal"
          component={SwapProviderModal}
          options={({ route }: NavigationProps) => {
            const { screenTitle = '' } = route.params
            return {
              ...screenNavOptions,
              presentation: 'fullScreenModal',
              headerStyle: {
                backgroundColor,
              },
              headerTitleStyle: NORMAL_HEADER,
              headerTitle: screenTitle,
              headerLeft: CloseButton,
              headerRight: SwapHeaderRight,
            }
          }}
        />
        <MainStack.Screen
          name="SwapProviderInfoDrawer"
          component={SwapProviderInfoDrawer}
          options={({ route }: NavigationProps) => {
            const { isScrolledUp = false } = route.params
            const empty = ''
            return {
              ...screenNavOptions,
              presentation: 'fullScreenModal',
              headerStyle: {
                backgroundColor: faceliftPalette.white,
              },
              headerTitleStyle: NORMAL_HEADER,
              headerTitle: isScrolledUp
                ? labelTranslateFn('swapProviders')!
                : empty,
              headerLeft: CloseButton,
            }
          }}
        />
        <MainStack.Screen
          name="ActivityFilterScreen"
          component={ActivityFilterScreen}
          options={{
            presentation: 'fullScreenModal',
            ...screenNavOptions,
            headerStyle: {
              backgroundColor,
            },
            headerTitleStyle: NORMAL_HEADER,
            headerTitle: labelTranslateFn('activityFilter')!,
            headerLeft: CloseButton,
            headerRight: ActivityFilterScreenHeaderRight,
          }}
        />
        <MainStack.Screen
          name="SortingModal"
          component={SortingModal}
          options={{
            ...screenNavOptions,
            headerTransparent: true,
            animation: 'none',
            presentation: 'transparentModal',
          }}
        />
        <MainStack.Screen
          name="AdvancedFilterModal"
          component={AdvancedFilterModal}
          options={{
            ...screenNavOptions,
            presentation: 'transparentModal',
            headerStyle: {
              backgroundColor: faceliftPalette.transparent,
            },
            headerTransparent: true,
            headerTitle: '',
            headerLeft: undefined,
            headerRight: undefined,
          }}
        />
        <MainStack.Screen
          name="SwapReviewScreen"
          component={SwapReviewScreen}
          options={{
            ...screenNavOptions,
            presentation: 'transparentModal',
            headerStyle: {
              backgroundColor: faceliftPalette.transparent,
            },
            headerTransparent: true,
            headerTitle: '',
            headerLeft: undefined,
            headerRight: CloseButtonLight,
          }}
        />
      </MainStack.Group>
    </MainStack.Navigator>
  )
}

const LoginStackCreation = createNativeStackNavigator<LoginStackParamList>()

export const LoginStack = () => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }
  const backgroundColor =
    currentTheme === 'dark' ? faceliftPalette.darkGrey : faceliftPalette.white
  return (
    <LoginStackCreation.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <LoginStackCreation.Screen
        component={LoginScreen}
        name={'LoginScreen'}
        options={{ ...screenNavOptions, headerTransparent: true }}
      />
      <LoginStackCreation.Screen
        name="TermsScreen"
        component={TermsScreen}
        options={{
          ...screenNavOptions,
          headerStyle: { backgroundColor },
          headerLeft: LiqLogoHeaderLeft,
        }}
      />
      <LoginStackCreation.Screen
        name="UnlockWalletScreen"
        component={UnlockWalletScreen}
        options={{
          ...screenNavOptions,
          headerTitleStyle: HEADER_TITLE_STYLE,
          headerStyle: { backgroundColor },
          headerLeft: LiqLogoHeaderLeft,
        }}
      />
      <LoginStackCreation.Screen
        name="PasswordCreationScreen"
        component={PasswordCreationScreen}
        options={{ ...screenNavOptions, headerTransparent: true }}
      />
      <LoginStackCreation.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{
          headerShown: false,
        }}
      />
      <LoginStackCreation.Screen
        name="CongratulationsScreen"
        component={CongratulationsScreen}
        options={{
          headerShown: false,
        }}
      />
    </LoginStackCreation.Navigator>
  )
}
const ParentStackCreation = createNativeStackNavigator<RootParentStackList>()

export const ParentStack = ({
  initialRouteName,
}: {
  initialRouteName: keyof RootParentStackList
}) => {
  return (
    <ParentStackCreation.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}>
      <ParentStackCreation.Screen
        component={WalletCreationNavigator}
        name={'WalletCreationNavigator'}
      />
      <ParentStackCreation.Screen
        component={StackMainNavigator}
        name={'StackMainNavigator'}
      />
      <ParentStackCreation.Screen component={LoginStack} name={'LoginStack'} />
    </ParentStackCreation.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
})
