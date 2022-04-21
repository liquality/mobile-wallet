import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircle } from '@fortawesome/pro-light-svg-icons'
import { faCircle as faSolidCircle } from '@fortawesome/pro-solid-svg-icons'

import { TimeLimitEnum } from '../../types'

const ITEMS = Object.values(TimeLimitEnum)

const TimeLimitOptions: FC<{
  value: TimeLimitEnum | undefined
  onChange: (timeLimit: TimeLimitEnum) => void
}> = ({ value, onChange }) => {
  const renderItem = useCallback(
    (key: TimeLimitEnum) => (
      <Pressable
        style={styles.button}
        onPress={() => {
          onChange(key)
        }}>
        <FontAwesomeIcon
          icon={value === key ? faSolidCircle : faCircle}
          color={value === key ? '#2CD2CF' : '#646F85'}
          {...commonIconProps}
        />
        <Text style={styles.label}>{key}</Text>
      </Pressable>
    ),
    [onChange, value],
  )

  return <View style={styles.container}>{ITEMS.map(renderItem)}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 21,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    marginLeft: 5,
    fontSize: 14,
  },
})

const commonIconProps = {
  style: styles.icon,
  size: 18,
}

export default TimeLimitOptions
