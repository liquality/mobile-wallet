import React from 'react'
import { StyleSheet } from 'react-native'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'
import { AppIcons } from '../assets'
import { Text, TouchableOpacity } from '../theme'
import { scale } from 'react-native-size-matters'

const { UncheckedWhiteBox, CheckedWhiteBox } = AppIcons

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
      {selected ? <CheckedWhiteBox /> : <UncheckedWhiteBox />}
      <Text
        opacity={0.8}
        variant={'whiteLabel'}
        lineHeight={scale(30)}
        marginLeft="m">
        {content}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default CheckBox
