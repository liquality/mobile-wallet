import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { AppIcons, Fonts } from '../../assets'
import { palette } from '../../theme'
import { ActionEnum } from '../../types'
import { capitalizeFirstLetter } from '../../utils'
const { SendIcon, SwapIcon, ReceiveIcon } = AppIcons

const ITEMS = Object.values(ActionEnum)
const ICON_MAP: Record<ActionEnum, typeof SendIcon> = {
  [ActionEnum.SEND]: SendIcon,
  [ActionEnum.SWAP]: SwapIcon,
  [ActionEnum.RECEIVE]: ReceiveIcon,
}

const ActionTypeToggles: FC<{
  value: ActionEnum[]
  onChange: (actionTypes: ActionEnum[]) => void
}> = ({ value, onChange }) => {
  const renderItem = useCallback(
    (key: ActionEnum, index: number) => {
      const isSelected = value?.includes(key)
      return (
        <Pressable
          key={`id is ${index}`}
          style={isSelected ? styles.selectedButton : styles.button}
          onPress={() => {
            const newActionTypes = isSelected
              ? value.filter((type) => type !== key)
              : [...new Set([...value, key])]
            onChange(newActionTypes)
          }}>
          <Text style={styles.label}>
            {capitalizeFirstLetter(key.toLowerCase())}
          </Text>
          {ICON_MAP[key]({ ...commonIconProps })}
        </Pressable>
      )
    },
    [onChange, value],
  )

  return <View style={styles.container}>{ITEMS.map(renderItem)}</View>
}

const commonStyles = StyleSheet.create({
  button: {
    height: 34,
    borderWidth: 1,
    borderColor: palette.darkGray,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 7,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 12,
  },
  selectedButton: {
    ...commonStyles.button,
    backgroundColor: palette.lightGreen,
  },
  button: {
    ...commonStyles.button,
    backgroundColor: palette.gray,
  },
  icon: {
    marginLeft: 5,
  },
  label: {
    fontFamily: Fonts.Regular,
    color: palette.black,
    fontSize: 13,
  },
})

const commonIconProps = {
  style: styles.icon,
  width: 16,
  height: 16,
  color: palette.darkGray,
}

export default ActionTypeToggles
