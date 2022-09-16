import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native'
import GeneralSwitch from '../../../components/ui/general-switch'
import {
  DarkModeEnum,
  RootTabParamList,
  RootStackParamList,
  CustomRootState,
} from '../../../types'
import WhatsNew from '../../../components/ui/whats-new'
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
import { NavigationProp, useNavigation } from '@react-navigation/core'
import i18n from 'i18n-js'
import { toggleNetwork } from '../../../store/store'
import { Network } from '@liquality/wallet-core/dist/src/store/types'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Dropdown, Box, Button, Text } from '../../../theme'
import { AppIcons, Fonts } from '../../../assets'

const { AngleRightIcon, SignOut: SignoutIcon, DropdownIcon } = AppIcons

type SettingsScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'SettingsScreen'
>

const SettingsScreen = ({ route }: SettingsScreenProps) => {
  const walletStateCopy = useRecoilValue(walletState)
  const [analytics, setAnalytics] = useRecoilState(optInAnalyticsState)
  const [activeNetwork, setActiveNetwork] = useRecoilState(networkState)
  const [theme, setTheme] = useRecoilState(themeMode)
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [lang, setLangSelected] = useRecoilState(langSelected)

  const toggleAnalyticsOptin = () => {
    setAnalytics({
      ...analytics,
      acceptedDate: analytics?.acceptedDate ? undefined : Date.now(),
    })
  }

  const handleLockPress = useCallback(() => {
    navigation.navigate('LoginScreen')
  }, [navigation])

  const handleBackupSeedPress = useCallback(() => {
    navigation.navigate('BackupWarningScreen', {
      screenTitle: 'Warning',
      includeBackBtn: false,
    })
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <View style={styles.action}>
            <View>
              <Text variant="settingLabel" tx="settingsScreen.networks" />
              <View style={styles.btnOptions}>
                <Pressable
                  style={[
                    styles.btn,
                    styles.leftBtn,
                    activeNetwork === 'mainnet' && styles.btnSelected,
                  ]}
                  onPress={() => handNetworkPress(Network.Mainnet)}>
                  <Text
                    style={[styles.label, styles.small]}
                    tx="settingsScreen.mainnet"
                  />
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    activeNetwork === 'testnet' && styles.btnSelected,
                  ]}
                  onPress={() => handNetworkPress(Network.Testnet)}>
                  <Text
                    style={[styles.label, styles.small]}
                    tx="settingsScreen.testnet"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/*
  This feature is not included in MVP, but will have to be done at some point so keeping it here
  <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <View>
                <Text style={styles.label}>Sync Devices</Text>
                <Text style={styles.description}>
                  Be up to date on all devices.
                </Text>
              </View>
              <View style={styles.btnOptions}>
                <Pressable
                  onPress={() =>
                    navigation.navigate('BackupWarningScreen', {
                      screenTitle: 'Warning',
                      includeBackBtn: false,
                    })
                  }>
                  <FontAwesomeIcon icon={faAngleRight} size={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </View> */}

        <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <View>
                <Text
                  variant="settingLabel"
                  tx="settingsScreen.backUpSeedPhrase"
                />
                <Text
                  style={styles.description}
                  tx="settingsScreen.alwayKeepSeedSafe"
                />
              </View>
              <View style={styles.btnOptions}>
                <Pressable onPress={handleBackupSeedPress}>
                  <AngleRightIcon width={40} height={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text variant="settingLabel" tx="settingsScreen.walletLogs" />
            <Button
              type="tertiary"
              variant="s"
              label={{ tx: 'settingsScreen.downloadLogs' }}
              onPress={handleDownload}
              isBorderless={false}
              isActive={true}
            />
          </View>
          <Text
            style={styles.description}
            tx="settingsScreen.walletLogPublicInfo"
          />
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text variant="settingLabel" tx="settingsScreen.analytics" />
            <GeneralSwitch
              isEnabled={!!analytics?.acceptedDate}
              onValueChange={toggleAnalyticsOptin}
            />
          </View>
          <Text style={styles.description} tx="settingsScreen.shareYouClick" />
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text variant="settingLabel" tx="settingsScreen.notifications" />
            <Pressable
              onPress={() => {
                Linking.openSettings()
              }}>
              <Text
                style={[styles.label, styles.link]}
                tx="settingsScreen.manage"
              />
            </Pressable>
          </View>
          <Text style={styles.description} tx="settingsScreen.getInfoAbout" />
        </View>
        <Box
          paddingHorizontal="xl"
          paddingVertical={'m'}
          borderTopWidth={1}
          borderTopColor="mainBorderColor">
          <Text variant="settingLabel" tx="settingsScreen.language" />
          <Dropdown
            data={supportedLanguages}
            variant="language"
            maxHeight={100}
            labelField="label"
            selectedTextStyle={[styles.description, styles.selectedFontStyle]}
            valueField="value"
            value={lang}
            autoScroll={false}
            renderRightIcon={() => <DropdownIcon width={15} height={15} />}
            onChange={(item) => {
              setLangSelected(item.value)
            }}
          />
        </Box>

        <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <Text variant="settingLabel" tx="settingsScreen.design" />
              <View style={styles.btnOptions}>
                <Pressable
                  style={[
                    styles.btn,
                    styles.leftBtn,
                    enableLight && styles.btnSelected,
                  ]}
                  onPress={() => setTheme(DarkModeEnum.Light)}>
                  <Text
                    style={[styles.label, styles.small]}
                    tx="settingsScreen.light"
                  />
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    enableDark && styles.btnSelected,
                  ]}
                  onPress={() => setTheme(DarkModeEnum.Dark)}>
                  <Text
                    style={[styles.label, styles.small]}
                    tx="settingsScreen.dark"
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <View>
                <Text
                  variant="settingLabel"
                  tx="settingsScreen.aboutLiquality"
                />
              </View>
              <View style={styles.toLiqualityWebsite}>
                <Pressable
                  onPress={() => Linking.openURL('https://liquality.io/')}>
                  <AngleRightIcon width={40} height={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.lockInfo}>
            <Pressable onPress={handleLockPress}>
              <SignoutIcon
                width={40}
                height={40}
                color={'#5F5F5F'}
                style={styles.signOutIcon}
              />
            </Pressable>
            <Text
              style={[styles.lockInfo, styles.lockLabel]}
              tx="settingsScreen.lock"
            />
          </View>
        </View>

        <View style={styles.lastRow}>
          <View style={styles.info}>
            <Text style={[styles.label, styles.version]}>
              {i18n.t('settingsScreen.version', { version })}
            </Text>
            <Pressable onPress={() => setIsWhatsNewVisible(true)}>
              <Text
                style={[styles.label, styles.link]}
                tx="settingsScreen.whatNew"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {isWhatsNewVisible && <WhatsNew onAction={setIsWhatsNewVisible} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  row: {
    borderTopWidth: 1,
    borderColor: '#D9DFE5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  lastRow: {
    borderColor: '#D9DFE5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  rowDesign: {
    borderTopWidth: 1,
    borderColor: '#D9DFE5',
    paddingVertical: 0,
    paddingHorizontal: 20,
    width: '100%',
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  label: {
    fontFamily: Fonts.Regular,
    fontWeight: '500',
    fontSize: 16,
    color: '#000D35',
    marginRight: 5,
  },
  lockLabel: {
    marginTop: 12,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  toLiqualityWebsite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#D9DFE5',
    paddingHorizontal: 10,
  },
  leftBtn: {
    borderRightWidth: 0,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
  },
  rightBtn: {
    borderLeftWidth: 1,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
  },
  btnSelected: {
    backgroundColor: '#F0F7F9',
  },
  link: {
    fontSize: 14,
    color: '#9D4DFA',
  },
  version: {
    fontSize: 14,
  },
  info: {
    flexDirection: 'row',
    marginTop: 20,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutIcon: {
    marginRight: 10,
  },
  description: {
    fontFamily: Fonts.Regular,
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#646F85',
  },
  small: {
    fontWeight: '300',
    fontSize: 11,
    lineHeight: 26,
    color: '#1D1E21',
  },
  selectedFontStyle: {
    fontSize: 14,
  },
})

export default SettingsScreen
