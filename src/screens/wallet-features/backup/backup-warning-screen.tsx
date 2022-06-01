import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
/* import { useAppDispatch, useAppSelector } from '../../../hooks'
 */
import Button from '../../../theme/button'

const BackupWarningScreen: FC = () => {
  /*   const [myEnabledAssets, setMyEnabledAssets] = useState<string[]>([])
  const { activeNetwork, activeWalletId, enabledAssets } = useAppSelector(
    (state) => ({
      activeNetwork: state.activeNetwork,
      enabledAssets: state.enabledAssets,
      activeWalletId: state.activeWalletId,
    }),
  ) */

  const handleBackupSeedBtnPress = () => {
    /*    navigation.setParams({ showPopup: !route?.params?.showPopup })
    navigation.navigate('BackupWarningScreen', {
      screenTitle: 'Warning',
    }) */
  }

  return (
    <View style={styles.overviewBlock}>
      <Text style={styles.balanceInUSD}>Warning</Text>
      <Button
        type="primary"
        variant="l"
        label="Go to Seed"
        onPress={handleBackupSeedBtnPress}
        isBorderless={false}
        isActive={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  overviewBlock: {
    justifyContent: 'center',
    width: '100%',
    height: 225,
    paddingVertical: 10,
  },
  balanceInUSD: {
    color: 'red',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 24,
    textAlignVertical: 'bottom',
  },
  balanceInNative: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 36,
    textAlignVertical: 'bottom',
  },
})

export default BackupWarningScreen
