import React, { Fragment } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLock, faPlug } from '@fortawesome/pro-light-svg-icons'
import BackupIcon from '../assets/icons/backup.svg'
import LedgerIcon from '../assets/icons/ledger.svg'
import ManageAssetsIcon from '../assets/icons/manage-assets.svg'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../types'

type FctType = (...args: any) => any
type Props = StackScreenProps<
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

    return (
      <Fragment>
        <Component navigation={navigation} route={route} />
        {route?.params?.showPopup && (
          <View style={styles.modalContainer}>
            <Pressable style={styles.menuItem}>
              <FontAwesomeIcon icon={faPlug} style={styles.icon} />
              <Text>Connected Sites</Text>
            </Pressable>
            <Pressable style={styles.menuItem}>
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
            <Pressable style={styles.menuItem}>
              <BackupIcon style={styles.icon} />
              <Text>Backup Seed</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleLockPress}>
              <FontAwesomeIcon icon={faLock} style={styles.icon} />
              <Text>Lock</Text>
            </Pressable>
          </View>
        )}
      </Fragment>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: '#FFF',
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
  menuLabel: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 12,
    color: '#000D35',
  },
  icon: {
    marginRight: 10,
  },
})

export default WithPopupMenu