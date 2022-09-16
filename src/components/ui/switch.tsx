import { StyleSheet, Switch } from 'react-native'
import React from 'react'
import { useRecoilState } from 'recoil'
import { enabledAssetsStateFamily } from '../../atoms'
import { palette } from '../../theme'

const SettingsSwitch = ({ asset }: { asset: string }) => {
  const [isFeatureEnabled, toggleFeature] = useRecoilState(
    enabledAssetsStateFamily(asset),
  )
  const styles = StyleSheet.create({
    switch: {
      borderColor: isFeatureEnabled ? palette.blueVioletPrimary : palette.gray,
      borderWidth: 1,
    },
  })
  return (
    <Switch
      trackColor={{ false: palette.white, true: palette.white }}
      style={styles.switch}
      thumbColor={isFeatureEnabled ? palette.blueVioletPrimary : palette.gray}
      ios_backgroundColor={palette.white}
      onValueChange={() => toggleFeature(!isFeatureEnabled)}
      value={isFeatureEnabled}
    />
  )
}

export default SettingsSwitch
