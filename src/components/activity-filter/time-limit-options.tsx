import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { AppIcons, Fonts } from '../../assets'
import { palette } from '../../theme'
import { TimeLimitEnum } from '../../types'

const { Circle } = AppIcons
const ITEMS = Object.values(TimeLimitEnum)

const TimeLimitOptions: FC<{
  value: TimeLimitEnum | undefined
  onChange: (timeLimit: TimeLimitEnum) => void
}> = ({ value, onChange }) => {
  const renderItem = useCallback(
    (key: TimeLimitEnum, index: number) => (
      <Pressable
        key={`id is ${index}`}
        style={styles.button}
        onPress={() => {
          onChange(key)
        }}>
        {value === key ? (
          <Circle
            width={16}
            height={16}
            fill={palette.turquoise}
            {...commonIconProps}
          />
        ) : (
          <Circle
            width={16}
            height={16}
            stroke={palette.darkGray}
            fill={palette.white}
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
    fontFamily: Fonts.Regular,
    color: palette.black,
    marginLeft: 5,
    fontSize: 14,
  },
})

const commonIconProps = {
  style: styles.icon,
}

export default TimeLimitOptions
