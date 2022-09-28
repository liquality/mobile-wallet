import React, { Suspense } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from '../types'
import { palette, Text } from '../theme'
import { AppIcons } from '../assets'

const { LockIcon, ManageAssetsIcon } = AppIcons

type FctType = (...args: any) => any
type Props = NativeStackScreenProps<
  RootStackParamList,
  | 'OverviewScreen'
  | 'AssetScreen'
  | 'AssetChooserScreen'
  | 'SwapScreen'
  | 'SwapReviewScreen'
  | 'SwapConfirmationScreen'
  | 'AssetManagementScreen'
  | 'LoginScreen'
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
    backgroundColor: palette.white,
  },
  modalContainer: {
    zIndex: 5,
    position: 'absolute',
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.gray,
    top: 0,
    right: 0,
    width: '50%',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: palette.gray,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
    width: 15,
  },
})

export default WithPopupMenu
