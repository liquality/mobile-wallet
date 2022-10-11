import { StyleSheet } from 'react-native'
import * as React from 'react'
import { faceliftPalette } from '../../theme'
import { Switch, SwitchProps } from 'react-native-switch'
import { scale } from 'react-native-size-matters'

interface GeneralSwitchProps extends SwitchProps {
  isEnabled: boolean
}

const GeneralSwitch = (props: GeneralSwitchProps) => {
  const { isEnabled, ...rest } = props
  const borderColorStyle = React.useMemo(
    () => ({
      borderColor: isEnabled
        ? faceliftPalette.switchActiveColor
        : faceliftPalette.switchInactiveBorderColor,
    }),
    [isEnabled],
  )
  return (
    <Switch
      {...rest}
      value={isEnabled}
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
      containerStyle={[borderColorStyle, styles.switch]}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    borderWidth: 1,
  },
})

export default GeneralSwitch
