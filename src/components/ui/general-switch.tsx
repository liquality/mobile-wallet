import { StyleSheet, Switch, SwitchProps } from 'react-native'
import * as React from 'react'
import { palette } from '../../theme'

interface GeneralSwitchProps extends SwitchProps {
  isEnabled: boolean
}

const SwitchEnabledColor = palette.blueVioletPrimary
const SwitchDisabledColor = palette.gray

const trackColor = {
  false: palette.white,
  true: palette.white,
}

const GeneralSwitch = (props: GeneralSwitchProps) => {
  const { isEnabled, style: additionStyles, ...rest } = props
  const borderColorStyle = React.useMemo(
    () => ({
      borderColor: isEnabled ? SwitchEnabledColor : SwitchDisabledColor,
    }),
    [isEnabled],
  )
  return (
    <Switch
      {...rest}
      trackColor={trackColor}
      style={[styles.switch, borderColorStyle, additionStyles]}
      thumbColor={isEnabled ? SwitchEnabledColor : SwitchDisabledColor}
      ios_backgroundColor="#FFF"
      value={isEnabled}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    borderWidth: 1,
  },
})

export default GeneralSwitch
