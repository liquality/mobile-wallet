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

import SettingsSwitch from '../../../components/ui/switch'
import { DarkModeEnum } from '../../../types'
import { useAppSelector } from '../../../hooks'
import WhatsNew from '../../../components/ui/whats-new'
import Button from '../../../theme/button'
import { downloadWalletLogs } from '../../../utils'
import DeviceInfo from 'react-native-device-info'
import { useNavigation } from '@react-navigation/core'

const SettingsScreen = () => {
  const reduxState = useAppSelector((state) => state)
  const { activeNetwork, analytics = false } = reduxState
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false)
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

  /*   const toggleNotifications = () => {
    dispatch({
      type: 'NOTIFICATIONS_UPDATE',
      payload: {
        notifications: !notifications,
      },
    })
  }
 */
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
            <Text style={styles.label}>Backup Seed Phrase</Text>

            <Pressable
              onPress={() =>
                navigation.navigate('BackupWarningScreen', {
                  screenTitle: 'Warning',
                  includeBackBtn: false,
                })
              }>
              <Text style={[styles.label, styles.link]}>show</Text>
            </Pressable>
          </View>
          <Text style={styles.description}>
            Always keep your seed phrase safe.
          </Text>
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
            <Text style={styles.label}>Notifications</Text>
            {/*  <SettingsSwitch
              isFeatureEnabled={notifications}
              enableFeature={toggleNotifications}
            /> */}
            <Button
              type="tertiary"
              variant="s"
              label="Settings"
              onPress={() => {
                Linking.openSettings()
              }}
              isBorderless={false}
              isActive={true}
            />
          </View>
          <Text style={styles.description}>
            Get informed about transaction status and funds received.
          </Text>
        </View>
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
            <View>
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
  btnOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    marginTop: 40,
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
  appVersion: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 18,
    color: '#646F85',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
})

export default SettingsScreen
