import React, { useEffect, useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/pro-light-svg-icons'
import { NetworkEnum } from '../../core/types'
import LiqualityButton from '../../components/button'
import AssetIcon from '../../components/asset-icon'
import SettingsSwitch from '../../components/ui/switch'
import { DarkModeEnum } from '../../types'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../hooks'
import { ChainId } from '@liquality/cryptoassets'

const WhatsNew = ({ onAction }: { onAction: (visible: boolean) => any }) => {
  const styles = StyleSheet.create({
    modalView: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentWrapper: {
      width: '90%',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderColor: '#D9DFE5',
      borderWidth: 1,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    content: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: '500',
      fontSize: 14,
      color: '#000D35',
      textAlign: 'justify',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    header: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      marginVertical: 5,
    },
  })

  const handleOkButtonPress = () => {
    onAction(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      style={styles.modalView}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.content, styles.header]}>What's New</Text>
          <Text style={styles.content}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In euismod
            ante in augue tristique convallis. Morbi pharetra, erat quis mattis
            tristique, sapien tortor convallis diam, elementum rhoncus erat
            massa vitae nibh. Ut suscipit nisi enim, ut dictum felis tristique
            sit amet.
          </Text>
          <LiqualityButton text={'OK'} action={handleOkButtonPress} />
        </View>
      </View>
    </Modal>
  )
}

const SettingsScreen = () => {
  const {
    activeNetwork,
    injectEthereum = false,
    injectEthereumChain,
    analytics,
    notifications = false,
    version = 'Version 0.2.1',
  } = useAppSelector((state) => ({
    activeNetwork: state.activeNetwork,
    injectEthereum: state.injectEthereum,
    injectEthereumChain: state.injectEthereumChain,
    analytics: state.analytics,
    notifications: state.notifications,
    version: state.version,
  }))
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false)
  const [shouldSyncDevices, setShouldSyncDevices] = useState(false)
  const [darkMode, setDarkMode] = useState<DarkModeEnum>(DarkModeEnum.Light)
  const [dappsNetwork, setDappsNetwork] = useState(injectEthereumChain)
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false)
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(true)
  const dispatch = useDispatch()

  const toggleDefaultWallet = () => {
    dispatch({
      type: 'DEFAULT_WALLET_UPDATE',
      payload: {
        injectEthereum: !injectEthereum,
      },
    })
  }

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

  const toggleNotifications = () => {
    dispatch({
      type: 'NOTIFICATIONS_UPDATE',
      payload: {
        notifications: !notifications,
      },
    })
  }

  const toggleDeviceSync = () => {
    setShouldSyncDevices(true)
  }

  const handleNetworkBtnPress = () => {
    setIsPickerVisible(!isPickerVisible)
    dispatch({
      type: 'ETHEREUM_CHAIN_UPDATE',
      payload: { injectEthereumChain: dappsNetwork },
    })
  }

  const toggleNetwork = (network: NetworkEnum) => {
    dispatch({
      type: 'NETWORK_UPDATE',
      payload: { activeNetwork: network },
    })
  }

  useEffect(() => {
    if (!activeNetwork) {
      Alert.alert('Please reload your app')
    }

    setIsAnalyticsEnabled(!!analytics?.acceptedDate)
  }, [activeNetwork, analytics])

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Default Wallet (Web3)</Text>
            <SettingsSwitch
              isFeatureEnabled={injectEthereum}
              enableFeature={toggleDefaultWallet}
            />
          </View>
          <Text style={styles.description}>
            Set Liquality as the default dApp wallet. Other wallets cannot
            interact with dApps while this is enabled.
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Network (Web3)</Text>
            <Pressable style={styles.switchBtn} onPress={handleNetworkBtnPress}>
              <AssetIcon asset={'ETH'} size={20} />
              <Text style={styles.btnLabel}>{dappsNetwork}</Text>
              <FontAwesomeIcon
                icon={isPickerVisible ? faAngleUp : faAngleDown}
              />
            </Pressable>
          </View>
          <Text style={styles.description}>
            Select which network should be used for dApps.
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
            <Text style={styles.label}>Wallet Logs</Text>
            <LiqualityButton
              text={'Download'}
              textColor={'#1D1E21'}
              backgroundColor={'#FFF'}
              width={100}
              action={() => ({})}
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
            <SettingsSwitch
              isFeatureEnabled={notifications}
              enableFeature={toggleNotifications}
            />
          </View>
          <Text style={styles.description}>
            Get informed about transaction status and funds received.
          </Text>
        </View>
        <View style={styles.row}>
          <View style={styles.action}>
            <Text style={styles.label}>Sync Devices</Text>
            <SettingsSwitch
              isFeatureEnabled={shouldSyncDevices}
              enableFeature={toggleDeviceSync}
            />
          </View>
          <Text style={styles.description}>
            Be up to date on all devices.which have access.
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
                    activeNetwork === NetworkEnum.Mainnet && styles.btnSelected,
                  ]}
                  onPress={() => toggleNetwork(NetworkEnum.Mainnet)}>
                  <Text>Mainnet</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    activeNetwork === NetworkEnum.Testnet && styles.btnSelected,
                  ]}
                  onPress={() => toggleNetwork(NetworkEnum.Testnet)}>
                  <Text>Testnet</Text>
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
                  <Text>light</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.btn,
                    styles.rightBtn,
                    darkMode === DarkModeEnum.Dark && styles.btnSelected,
                  ]}
                  onPress={() => setDarkMode(DarkModeEnum.Dark)}>
                  <Text>dark</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.info}>
            <Text style={styles.label}>{version}</Text>
            <Pressable onPress={() => setIsWhatsNewVisible(true)}>
              <Text style={[styles.label, styles.link]}>What's new</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {isPickerVisible && (
        <View style={styles.pickerWrapper}>
          <Picker
            prompt={'Choose a Web3 Network'}
            style={styles.picker}
            mode={'dropdown'}
            selectedValue={dappsNetwork}
            onValueChange={(itemValue) => setDappsNetwork(itemValue)}>
            {Object.keys(ChainId).map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>
      )}
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
    paddingVertical: 5,
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
    color: '#9D4DFA',
  },
  info: {
    flexDirection: 'row',
  },
  description: {
    color: '#646F85',
  },
  switchBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 14,
    color: '#000D35',
  },
  pickerWrapper: {
    width: '98%',
    justifyContent: 'center',
  },
  picker: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#9D4DFA',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
})

export default SettingsScreen
