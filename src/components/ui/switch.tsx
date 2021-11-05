import { StyleSheet, Switch } from 'react-native'
import React from 'react'

const SettingsSwitch = ({
  isFeatureEnabled,
  enableFeature,
}: {
  isFeatureEnabled: boolean
  enableFeature: any
}) => {
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
      onValueChange={() => enableFeature(!isFeatureEnabled)}
      value={isFeatureEnabled}
    />
  )
}

export default SettingsSwitch
