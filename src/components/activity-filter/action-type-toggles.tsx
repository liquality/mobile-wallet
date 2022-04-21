import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faExchange,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/pro-light-svg-icons'

import { ActionEnum } from '../../types'
import { capitalizeFirstLetter } from '../../utils'

const ITEMS = Object.values(ActionEnum)
const ICON_MAP = {
  [ActionEnum.SEND]: faArrowUp,
  [ActionEnum.SWAP]: faExchange,
  [ActionEnum.RECEIVE]: faArrowDown,
}

const ActionTypeToggles: FC<{
  value: ActionEnum[]
  onChange: (actionTypes: ActionEnum[]) => void
}> = ({ value, onChange }) => {
  const renderItem = useCallback(
    (key: ActionEnum) => {
      const isSelected = value?.includes(key)
      return (
        <Pressable
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
          <FontAwesomeIcon icon={ICON_MAP[key]} {...commonIconProps} />
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
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    fontSize: 13,
  },
})

const commonIconProps = {
  style: styles.icon,
  size: 16,
  color: '#646F85',
}

export default ActionTypeToggles
