import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import Circle from '../../assets/icons/circle.svg'
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
        {value === key ? (
          <Circle width={16} height={16} fill="#2CD2CF" {...commonIconProps} />
        ) : (
          <Circle
            width={16}
            height={16}
            stroke="#646F85"
            fill="#FFFFFF"
            {...commonIconProps}
          />
        )}
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
}

export default TimeLimitOptions
