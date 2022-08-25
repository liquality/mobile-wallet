import { StyleSheet, Switch } from 'react-native'
import React from 'react'
import { useRecoilState } from 'recoil'
import { enabledAssetsStateFamily } from '../../atoms'

const SettingsSwitch = ({ asset }: { asset: string }) => {
  const [isFeatureEnabled, toggleFeature] = useRecoilState(
    enabledAssetsStateFamily(asset),
  )
  const styles = StyleSheet.create({
    switch: {
      borderColor: isFeatureEnabled ? '#9D4DFA' : '#D9DFE5',
      borderWidth: 1,
    },
  })
  return (
    <Switch
      trackColor={{ false: '#FFF', true: '#FFF' }}
      style={styles.switch}
      thumbColor={isFeatureEnabled ? '#9D4DFA' : '#D9DFE5'}
      ios_backgroundColor="#FFF"
      onValueChange={() => toggleFeature(!isFeatureEnabled)}
      value={isFeatureEnabled}
    />
  )
}

export default SettingsSwitch
