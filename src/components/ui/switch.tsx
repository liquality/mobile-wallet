import React from 'react'
import { useRecoilState } from 'recoil'
import { enabledAssetsStateFamily } from '../../atoms'
import { faceliftPalette } from '../../theme'
import { Switch } from 'react-native-switch'
import { scale } from 'react-native-size-matters'

const borderWidth = 1

const SettingsSwitch = ({ asset }: { asset: string }) => {
  const [isFeatureEnabled, toggleFeature] = useRecoilState(
    enabledAssetsStateFamily(asset),
  )

  const borderColor = isFeatureEnabled
    ? faceliftPalette.switchActiveColor
    : faceliftPalette.switchInactiveBorderColor

  return (
    <Switch
      onValueChange={() => toggleFeature(!isFeatureEnabled)}
      value={isFeatureEnabled}
      circleSize={scale(20)}
      activeText={''}
      inActiveText={''}
      circleBorderWidth={1}
      backgroundActive={faceliftPalette.white}
      backgroundInactive={faceliftPalette.white}
      circleActiveColor={faceliftPalette.switchActiveColor}
      circleInActiveColor={faceliftPalette.switchInactiveColor}
      circleBorderActiveColor={faceliftPalette.switchActiveColor}
      circleBorderInactiveColor={faceliftPalette.switchInactiveBorderColor}
      switchWidthMultiplier={2}
      containerStyle={{ borderColor, borderWidth }}
    />
  )
}

export default SettingsSwitch
