import React from 'react'
import { faSquare, faCheckSquare } from '@fortawesome/pro-light-svg-icons'

import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

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
    <FontAwesomeIcon
      size={size}
      color={color}
      icon={selected ? faCheckSquare : faSquare}
    />
    <Text style={textStyle}> {text} </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default CheckBox
