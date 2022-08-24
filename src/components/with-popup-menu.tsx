import React, { Suspense } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import LockIcon from '../assets/icons/lock.svg'
import ManageAssetsIcon from '../assets/icons/manage-assets.svg'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import Text from '../theme/text'

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
        includeBackBtn: true,
      })
    }

    return (
      <View style={styles.container}>
        <Suspense
          fallback={
            <View>
              <Text tx="common.load" />
            </View>
          }>
          <Component navigation={navigation} route={route} />
        </Suspense>
        {route?.params?.showPopup && (
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.menuItem}
              onPress={handleManageAssetsBtnPress}>
              <ManageAssetsIcon style={styles.icon} />
              <Text tx="manageAssets" />
            </Pressable>
            <Pressable style={styles.menuItem}>
              <LockIcon style={styles.icon} />
              <Text tx="accountDetails" />
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleLockPress}>
              <LockIcon style={styles.icon} />
              <Text tx="lock" />
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
    backgroundColor: '#FFF',
  },
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
  icon: {
    marginRight: 10,
    width: 15,
  },
})

export default WithPopupMenu
