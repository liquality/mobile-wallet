import { StyleSheet, Switch } from 'react-native'
import React from 'react'
import { useRecoilState } from 'recoil'
import { enabledAssetsStateFamily } from '../../atoms'
import { palette } from '../../theme'

const SettingsSwitch = ({ asset }: { asset: string }) => {
  const [isFeatureEnabled, toggleFeature] = useRecoilState(
    enabledAssetsStateFamily(asset),
  )

  const borderColor = isFeatureEnabled
    ? palette.blueVioletPrimary
    : palette.gray

  return (
    <Switch
      trackColor={{ false: palette.white, true: palette.white }}
      style={[styles.switch, { borderColor }]}
      thumbColor={isFeatureEnabled ? palette.blueVioletPrimary : palette.gray}
      ios_backgroundColor={palette.white}
      onValueChange={() => toggleFeature(!isFeatureEnabled)}
      value={isFeatureEnabled}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    borderWidth: 1,
  },
})

export default SettingsSwitch
