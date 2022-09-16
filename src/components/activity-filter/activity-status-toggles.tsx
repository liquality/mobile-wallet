import React, { FC, useCallback } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import { AppIcons, Fonts } from '../../assets'

import { ActivityStatusEnum } from '../../types'
import { capitalizeFirstLetter } from '../../utils'
import SectionTitle from './section-title'

const {
  PendingIcon,
  CompletedIcon,
  CancelledIcon,
  RefundedIcon,
  NeedsAttentionIcon,
  FailedIcon,
} = AppIcons

const ITEMS = Object.values(ActivityStatusEnum)
const ICON_MAP = {
  [ActivityStatusEnum.PENDING]: {
    icon: PendingIcon,
    width: 22,
    height: 30,
  },
  [ActivityStatusEnum.COMPLETED]: {
    icon: CompletedIcon,
    width: 20,
    height: 20,
  },
  [ActivityStatusEnum.CANCELLED]: {
    icon: CancelledIcon,
    width: 20,
    height: 20,
  },
  [ActivityStatusEnum.REFUNDED]: {
    icon: RefundedIcon,
    width: 25,
    height: 25,
  },
  [ActivityStatusEnum.NEEDS_ATTENTION]: {
    icon: NeedsAttentionIcon,
    width: 25,
    height: 30,
  },
  [ActivityStatusEnum.FAILED]: {
    icon: FailedIcon,
    width: 19,
    height: 19,
  },
}

const ActivityStatusToggles: FC<{
  value: ActivityStatusEnum[]
  onChange: (actionTypes: ActivityStatusEnum[]) => void
}> = ({ value, onChange }) => {
  const renderItem = useCallback(
    (key: ActivityStatusEnum) => {
      const { icon: Icon, width: iconWidth, height: iconHeight } = ICON_MAP[key]
      const isSelected = value.includes(key)
      return (
        <Pressable
          style={isSelected ? styles.selectedButton : styles.button}
          onPress={() =>
            onChange(
              isSelected
                ? value.filter((type) => type !== key)
                : [...new Set([...value, key])],
            )
          }>
          <Icon width={iconWidth} height={iconHeight} />
          <Text style={styles.label}>
            {capitalizeFirstLetter(key.toLowerCase())}
          </Text>
        </Pressable>
      )
    },
    [onChange, value],
  )

  return (
    <View style={styles.container}>
      <SectionTitle tx="common.activities" />
      <View style={styles.content}>{ITEMS.map(renderItem)}</View>
    </View>
  )
}

const commonStyles = StyleSheet.create({
  button: {
    height: 34,
    borderWidth: 1,
    borderColor: '#646F85',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 7,
    marginTop: 12,
  },
})

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  selectedButton: {
    ...commonStyles.button,
    backgroundColor: '#1CE5C3',
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#D9DFE5',
  },
  label: {
    marginLeft: 5,
    fontFamily: Fonts.Regular,
    color: '#1D1E21',
    fontSize: 13,
  },
})

export default ActivityStatusToggles
