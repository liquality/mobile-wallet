import React from 'react'
import CheckIcon from '../assets/icons/swap-check.svg'

import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type CheckBoxProps = {
  chi: React.ReactElement[]
  selected?: boolean
  onPress: (params: any) => any
  style: object
  textStyle: object
  size: number
  color: string
  text: string
}

const CheckBox: React.FC<CheckBoxProps> = ({
  selected,
  onPress,
  style,
  textStyle,
  size = 20,
  color = '#FFF',
  text = '',
  ...props
}) => (
  <TouchableOpacity
    style={[styles.checkBox, style]}
    onPress={onPress}
    {...props}>
    {selected ? <CheckIcon width={size} height={size} color={color} /> : null}
    <Text style={textStyle}> {text} </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
})

export default CheckBox
