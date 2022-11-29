import React, { useCallback, useEffect } from 'react'
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native'
import GeneralSwitch from '../../../components/ui/general-switch'
import {
  DarkModeEnum,
  CustomRootState,
  MainStackParamList,
} from '../../../types'
import { downloadWalletLogs, labelTranslateFn } from '../../../utils'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  networkState,
  optInAnalyticsState,
  walletState,
  themeMode,
  langSelected,
} from '../../../atoms'
import DeviceInfo from 'react-native-device-info'
import i18n from 'i18n-js'
import { toggleNetwork } from '../../../store/store'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Dropdown, Box, Text, faceliftPalette } from '../../../theme'
import { AppIcons, Fonts } from '../../../assets'
import CustomHeaderBar from '../../../components/header-bar/custom-header-bar'
import { scale } from 'react-native-size-matters'
import { CustomSwitch } from './custom-switch'
import SettingListComponent from './setting-list-component'
import { CommonActions } from '@react-navigation/native'

const {
  DropdownIcon,
  Refresh,
  ExportIcon,
  ChevronRightIcon,
  DarkMoon,
  DarkSun,
  LightMoon,
  LightSun,
  LockIcon,
} = AppIcons

type SettingsScreenProps = BottomTabScreenProps<MainStackParamList, 'Settings'>

const SettingsScreen = ({ route, navigation }: SettingsScreenProps) => {
  const walletStateCopy = useRecoilValue(walletState)
  const [analytics, setAnalytics] = useRecoilState(optInAnalyticsState)
  const [activeNetwork, setActiveNetwork] = useRecoilState(networkState)
  const [theme, setTheme] = useRecoilState(themeMode)
  const [lang, setLangSelected] = useRecoilState(langSelected)

  const toggleAnalyticsOptin = () => {
    setAnalytics({
      ...analytics,
      acceptedDate: analytics?.acceptedDate ? undefined : Date.now(),
    })
  }

  const handleLockPress = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    )
  }, [navigation])

  const handleBackupSeedPress = useCallback(() => {
    navigation.navigate('BackupWarningScreen', { isPrivateKey: false })
  }, [navigation])

  const handleBackupPrivateKeyPress = useCallback(() => {
    navigation.navigate('SelectChainScreen', {})
  }, [navigation])

  const handNetworkPress = useCallback(
    (state: Network) => {
      setActiveNetwork(state)
      toggleNetwork(state)
    },
    [setActiveNetwork],
  )

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert(labelTranslateFn('settingsScreen.reloadApp')!)
    }

    //Used for handle-lock-wallet-and-background-tasks.tsx
    if (route?.params?.shouldLogOut) {
      handleLockPress()
    }
  }, [activeNetwork, handleLockPress, route?.params?.shouldLogOut])

  const supportedLanguages = React.useMemo(
    () => [
      { label: labelTranslateFn('settingsScreen.english'), value: 'en' },
      { label: labelTranslateFn('settingsScreen.spanish'), value: 'es' },
      { label: labelTranslateFn('settingsScreen.mandarin'), value: 'zh' },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  )

  const onWhatNewPress = () => {
    navigation.navigate('WhatNewScreen', {})
  }

  const handleDownload = useCallback(() => {
    const walletStateDownload: Partial<CustomRootState> = { ...walletStateCopy }

    delete walletStateDownload.encryptedWallets
    delete walletStateDownload.keySalt

    // Thsi is not in web app, newly added
    delete walletStateDownload.wallets

    downloadWalletLogs(walletStateDownload)
  }, [walletStateCopy])

  const version = DeviceInfo.getVersion()
  const deviceTheme = useColorScheme()
  const enableDark = theme
    ? DarkModeEnum.Dark === theme
    : DarkModeEnum.Dark === deviceTheme
  const enableLight = theme
    ? DarkModeEnum.Light === theme
    : DarkModeEnum.Light === deviceTheme

  const isMainnet = activeNetwork === 'mainnet'
  const isTestnet = activeNetwork === 'testnet'

  return (
    <Box flex={1} backgroundColor={'mainBackground'}>
      <CustomHeaderBar title={{ tx: 'settings' }} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: scale(20),
          paddingBottom: scale(20),
        }}>
        <Box
          borderBottomWidth={1}
          borderBottomColor={'mediumGrey'}
          flexDirection={'row'}
          marginTop="l"
          alignItems="center"
          justifyContent={'space-between'}
          height={scale(70)}>
          <Text
            variant={'listText'}
            color="greyMeta"
            tx="settingsScreen.networks"
          />
          <CustomSwitch
            width={150}
            firstItemValue={isMainnet}
            firstItemPress={() => handNetworkPress(Network.Mainnet)}
            firstItemElement={
              <Text
                variant={'networkStatus'}
                color={isMainnet ? 'white' : 'activeButton'}
                tx={'settingsScreen.mainnet'}
              />
            }
            secondItemValue={isTestnet}
            secondItemPress={() => handNetworkPress(Network.Testnet)}
            secondItemElement={
              <Text
                variant={'networkStatus'}
                color={isTestnet ? 'white' : 'activeButton'}
                tx={'settingsScreen.testnet'}
              />
            }
          />
        </Box>
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.syncDevices')!}
          sublabel={labelTranslateFn('settingsScreen.beUpToDate')!}
          icon={<Refresh />}
          onPress={() => Alert.alert('Coming Soon')}
        />
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.backUpSeedPhrase')!}
          sublabel={labelTranslateFn('settingsScreen.alwayKeepSeedSafe')!}
          icon={<ChevronRightIcon height={scale(15)} width={scale(15)} />}
          onPress={handleBackupSeedPress}
        />
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.backUpPrivateKey')!}
          sublabel={labelTranslateFn('settingsScreen.alwayKeepPrivateKeySafe')!}
          icon={<ChevronRightIcon height={scale(15)} width={scale(15)} />}
          onPress={handleBackupPrivateKeyPress}
        />
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.walletLogs')!}
          sublabel={labelTranslateFn('settingsScreen.walletLogPublicInfo')!}
          icon={<ExportIcon />}
          onPress={handleDownload}
        />
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.analytics')!}
          sublabel={labelTranslateFn('settingsScreen.shareYouClick')!}
          reactElementPlusOnPress={
            <GeneralSwitch
              isEnabled={!!analytics?.acceptedDate}
              onValueChange={toggleAnalyticsOptin}
            />
          }
        />
        <SettingListComponent
          mainLabel={labelTranslateFn('settingsScreen.notifications')!}
          sublabel={labelTranslateFn('settingsScreen.notifyInfo')!}
          reactElementPlusOnPress={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={Linking.openSettings}>
              <Text
                variant={'listText'}
                color={'defaultButton'}
                tx="settingsScreen.manage"
              />
            </TouchableOpacity>
          }
        />
        <Box marginTop={'l'}>
          <Text
            variant={'listText'}
            color="greyMeta"
            tx="settingsScreen.language"
          />
          <Dropdown
            data={supportedLanguages}
            variant="language"
            labelField="label"
            selectedTextStyle={[styles.description]}
            valueField="value"
            value={lang}
            style={styles.marginAdjust}
            autoScroll={false}
            renderRightIcon={() => (
              <Box style={styles.marginAdjust}>
                <DropdownIcon width={scale(15)} height={scale(15)} />
              </Box>
            )}
            onChange={(item) => {
              setLangSelected(item.value)
            }}
          />
        </Box>
        <Box style={{ display: 'none' }}>
          <SettingListComponent
            mainLabel={labelTranslateFn('settingsScreen.screenMode')!}
            sublabel={labelTranslateFn('settingsScreen.screenModeInfo')!}
            reactElementPlusOnPress={
              <CustomSwitch
                width={80}
                firstItemValue={enableLight}
                firstItemPress={() => setTheme(DarkModeEnum.Light)}
                firstItemElement={enableLight ? <LightSun /> : <DarkSun />}
                secondItemValue={enableDark}
                secondItemPress={() => setTheme(DarkModeEnum.Dark)}
                secondItemElement={enableDark ? <DarkMoon /> : <LightMoon />}
              />
            }
          />
        </Box>
        <TouchableOpacity activeOpacity={0.7} onPress={handleLockPress}>
          <Box
            flexDirection={'row'}
            justifyContent="space-between"
            alignItems={'center'}
            marginTop={'l'}
            borderBottomColor={'mediumGrey'}
            borderBottomWidth={1}
            height={scale(50)}>
            <Text
              variant={'listText'}
              color={'defaultButton'}
              tx="settingsScreen.lock"
            />
            <LockIcon height={scale(15)} width={scale(15)} />
          </Box>
        </TouchableOpacity>
        <Box
          flexDirection={'row'}
          justifyContent="space-between"
          alignItems={'center'}
          marginTop={'xxl'}>
          <Text variant={'listText'} color={'greyMeta'}>
            {i18n.t('settingsScreen.version', { version })}
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={onWhatNewPress}>
            <Text
              variant={'listText'}
              color={'defaultButton'}
              tx="settingsScreen.whatNew"
            />
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  description: {
    fontFamily: Fonts.Regular,
    fontSize: scale(15),
    fontWeight: '400',
    color: faceliftPalette.greyBlack,
  },
  marginAdjust: {
    marginTop: -scale(10),
  },
})

export default SettingsScreen
