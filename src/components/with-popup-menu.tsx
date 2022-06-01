import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLock, faPlug } from '@fortawesome/pro-light-svg-icons'
import BackupIcon from '../assets/icons/backup.svg'
import LedgerIcon from '../assets/icons/ledger.svg'
import ManageAssetsIcon from '../assets/icons/manage-assets.svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'

type FctType = (...args: any) => any
type Props = NativeStackScreenProps<
  RootStackParamList,
  'OverviewScreen' | 'AssetScreen' | 'AssetChooserScreen'
>
const WithPopupMenu = <T extends FctType>(
  Component: (componentProps: Parameters<T>[0]) => ReturnType<T>,
) => {
  return (props: Props) => {
    const { navigation, route } = props

    const handleLockPress = () => {
      navigation.navigate('LoginScreen')
    }

    const handleManageAssetsBtnPress = () => {
      navigation.setParams({ showPopup: !route?.params?.showPopup })
      navigation.navigate('AssetManagementScreen', {
        screenTitle: 'Manage Assets',
      })
    }

    const handleBackupSeedBtnPress = () => {
      navigation.setParams({ showPopup: !route?.params?.showPopup })
      navigation.navigate('BackupWarningScreen', {
        screenTitle: 'Warning',
      })
    }

    return (
      <View style={styles.container}>
        <Component navigation={navigation} route={route} />
        {route?.params?.showPopup && (
          <View style={styles.modalContainer}>
            <Pressable style={styles.menuItem}>
              <FontAwesomeIcon icon={faPlug} style={styles.icon} />
              <Text>Connected Sites</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={handleManageAssetsBtnPress}>
              <ManageAssetsIcon style={styles.icon} />
              <Text>Manage Assets</Text>
            </Pressable>
            <Pressable style={styles.menuItem}>
              <FontAwesomeIcon icon={faLock} style={styles.icon} />
              <Text>Account Details</Text>
            </Pressable>
            <Pressable style={styles.menuItem}>
              <LedgerIcon style={styles.icon} />
              <Text>Ledger</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={handleBackupSeedBtnPress}>
              <BackupIcon style={styles.icon} />
              <Text>Backup Seed</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleLockPress}>
              <FontAwesomeIcon icon={faLock} style={styles.icon} />
              <Text>Lock</Text>
            </Pressable>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9DFE5',
  },
  modalContainer: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: '#D9DFE5',
    borderWidth: 1,
    borderColor: '#D9DFE5',
    top: 0,
    right: 0,
    width: '50%',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#D9DFE5',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
})

export default WithPopupMenu
