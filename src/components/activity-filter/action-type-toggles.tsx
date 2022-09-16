import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { AppIcons, Fonts } from '../../assets'
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
    borderColor: '#646F85',
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
    backgroundColor: '#1CE5C3',
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#D9DFE5',
  },
  icon: {
    marginLeft: 5,
  },
  label: {
    fontFamily: Fonts.Regular,
    color: '#1D1E21',
    fontSize: 13,
  },
})

const commonIconProps = {
  style: styles.icon,
  width: 16,
  height: 16,
  color: '#646F85',
}

export default ActionTypeToggles
