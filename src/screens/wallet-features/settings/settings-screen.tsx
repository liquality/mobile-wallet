import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { faAngleRight, faSignOut } from '@fortawesome/pro-light-svg-icons'

import SettingsSwitch from '../../../components/ui/switch'
import { DarkModeEnum } from '../../../types'
import { useAppSelector } from '../../../hooks'
import WhatsNew from '../../../components/ui/whats-new'
import Button from '../../../theme/button'
import { downloadWalletLogs } from '../../../utils'
import DeviceInfo from 'react-native-device-info'
import { useNavigation } from '@react-navigation/core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const SettingsScreen = () => {
  const reduxState = useAppSelector((state) => state)
  const { activeNetwork, analytics = false } = reduxState
  const isAnalyticsEnabledFromStart =
    analytics.acceptedDate === undefined ? false : true
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(
    isAnalyticsEnabledFromStart,
  )
  const [darkMode, setDarkMode] = useState<DarkModeEnum>(DarkModeEnum.Light)
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const toggleAnalyticsOptin = () => {
    setIsAnalyticsEnabled(!isAnalyticsEnabled)
    dispatch({
      type: 'ANALYTICS_UPDATE',
      payload: {
        analytics: {
          ...analytics,
          acceptedDate: analytics?.acceptedDate ? undefined : Date.now(),
        },
      },
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

  const toggleNetwork = (network: any) => {
    toggleNetwork(network)
  }

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your app')
    }

    setIsAnalyticsEnabled(!!analytics?.acceptedDate)
  }, [activeNetwork, analytics])

  const handleDownload = useCallback(() => {
    const walletState = { ...reduxState }

    delete walletState.encryptedWallets
    delete walletState.keySalt

    // Thsi is not in web app, newly added
    delete walletState.wallets

    downloadWalletLogs(walletState)
  }, [reduxState])

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <View style={styles.action}>
            <View>
              <Text style={styles.label}>Networks</Text>
              <View style={styles.btnOptions}>
                <Pressable
                  style={[
                    styles.btn,
                    styles.leftBtn,
                    activeNetwork === 'mainnet' && styles.btnSelected,
                  ]}
                  onPress={() => toggleNetwork('mainnet')}>
                  <Text style={[styles.label, styles.small]}>Mainnet</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    activeNetwork === 'testnet' && styles.btnSelected,
                  ]}
                  onPress={() => toggleNetwork('testnet')}>
                  <Text style={[styles.label, styles.small]}>Testnet</Text>
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
                <Text style={styles.label}>Back-up Seed Phrase</Text>
                <Text style={styles.description}>
                  Always keep your seed phrase safe.
                </Text>
              </View>
              <View style={styles.btnOptions}>
                <Pressable onPress={handleBackupSeedPress}>
                  <FontAwesomeIcon icon={faAngleRight} size={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Wallet Logs</Text>
            <Button
              type="tertiary"
              variant="s"
              label="Download logs"
              onPress={handleDownload}
              isBorderless={false}
              isActive={true}
            />
          </View>
          <Text style={styles.description}>
            The wallet logs contain your public information such as addresses
            and transactions.
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Analytics</Text>
            <SettingsSwitch
              isFeatureEnabled={isAnalyticsEnabled}
              enableFeature={toggleAnalyticsOptin}
            />
          </View>
          <Text style={styles.description}>
            Share where you click. No identifying data is collected.
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Notifications</Text>
            <Pressable
              onPress={() => {
                Linking.openSettings()
              }}>
              <Text style={[styles.label, styles.link]}>manage</Text>
            </Pressable>
          </View>
          <Text style={styles.description}>
            Get informed about transaction status and funds received.
          </Text>
        </View>

        <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <Text style={styles.label}>Design</Text>
              <View style={styles.btnOptions}>
                <Pressable
                  style={[
                    styles.btn,
                    styles.leftBtn,
                    darkMode === DarkModeEnum.Light && styles.btnSelected,
                  ]}
                  onPress={() => setDarkMode(DarkModeEnum.Light)}>
                  <Text style={[styles.label, styles.small]}>light</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    darkMode === DarkModeEnum.Dark && styles.btnSelected,
                  ]}
                  onPress={() => setDarkMode(DarkModeEnum.Dark)}>
                  <Text style={[styles.label, styles.small]}>dark</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rowDesign}>
          <View style={styles.action}>
            <View style={styles.btnContainer}>
              <View>
                <Text style={styles.label}>About Liquality</Text>
              </View>
              <View style={styles.toLiqualityWebsite}>
                <Pressable
                  onPress={() => Linking.openURL('https://liquality.io/')}>
                  <FontAwesomeIcon icon={faAngleRight} size={40} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.lockInfo}>
            <Pressable onPress={handleLockPress}>
              <FontAwesomeIcon
                icon={faSignOut}
                size={20}
                color={'#5F5F5F'}
                style={styles.signOutIcon}
              />
            </Pressable>
            <Text style={styles.label}>Lock</Text>
          </View>
        </View>

        <View style={styles.lastRow}>
          <View style={styles.info}>
            <Text style={[styles.label, styles.version]}>
              Version: {DeviceInfo.getVersion()}
            </Text>
            <Pressable onPress={() => setIsWhatsNewVisible(true)}>
              <Text style={[styles.label, styles.link]}>What's new</Text>
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
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 16,
    color: '#000D35',
    marginRight: 5,
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
  },
  signOutIcon: {
    marginRight: 10,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
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
})

export default SettingsScreen
