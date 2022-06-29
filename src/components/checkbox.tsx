import React from 'react'
import CheckIcon from '../assets/icons/swap-check.svg'

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'

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
    {selected ? (
      <CheckIcon width={size} height={size} color={color} style={styles.icon} />
    ) : (
      <View style={styles.icon} />
    )}
    <Text style={textStyle}> {text} </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    borderWidth: 1,
    width: 20,
    height: 20,
  },
})

export default CheckBox
