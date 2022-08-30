import React from 'react'
import CheckIcon from '../assets/icons/swap-check.svg'

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'

type CheckBoxProps = {
  chi?: React.ReactElement[]
  selected?: boolean
  onPress: (params: any) => any
  style: object
  textStyle: object
  size?: number
  color?: string
  text: string | { tx: TxKeyPath }
  txOptions?: i18n.TranslateOptions
}

const CheckBox: React.FC<CheckBoxProps> = ({
  selected,
  onPress,
  style,
  textStyle,
  size = 20,
  color = '#FFF',
  text = '',
  txOptions,
  ...props
}) => {
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  let content
  if (typeof text !== 'string') {
    const { tx } = text
    content = tx && translate(tx, txOptions)
  } else {
    content = text
  }

  return (
    <TouchableOpacity
      style={[styles.checkBox, style]}
      onPress={onPress}
      {...props}>
      {selected ? (
        <CheckIcon
          width={size}
          height={size}
          color={color}
          style={styles.icon}
        />
      ) : (
        <View style={styles.icon} />
      )}
      <Text style={textStyle}> {content} </Text>
    </TouchableOpacity>
  )
}

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
