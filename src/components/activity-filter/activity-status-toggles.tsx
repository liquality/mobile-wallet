import React, { useCallback, useState } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'

import { ActivityStatusEnum } from '../../types'
import { capitalizeFirstLetter } from '../../utils'
import PendingIcon from '../../assets/icons/activity-status/pending.svg'
import CompletedIcon from '../../assets/icons/activity-status/completed.svg'
import CancelledIcon from '../../assets/icons/activity-status/canceled.svg'
import RefundedIcon from '../../assets/icons/activity-status/refunded.svg'
import NeedsAttentionIcon from '../../assets/icons/activity-status/needs_attention.svg'
import FailedIcon from '../../assets/icons/activity-status/failed.svg'
import SectionTitle from './section-title'

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

const ActivityStatusToggles = () => {
  const [activityStatuses, setActivityStatuses] = useState<
    ActivityStatusEnum[]
  >([])
  const renderItem = useCallback(
    (key: ActivityStatusEnum) => {
      const { icon: Icon, width: iconWidth, height: iconHeight } = ICON_MAP[key]
      const isSelected = activityStatuses.includes(key)
      return (
        <Pressable
          style={isSelected ? styles.selectedButton : styles.button}
          onPress={() =>
            setActivityStatuses(
              isSelected
                ? activityStatuses.filter((type) => type !== key)
                : [...new Set([...activityStatuses, key])],
            )
          }>
          <Icon width={iconWidth} height={iconHeight} />
          <Text style={styles.label}>
            {capitalizeFirstLetter(key.toLowerCase())}
          </Text>
        </Pressable>
      )
    },
    [activityStatuses],
  )

  return (
    <View style={styles.container}>
      <SectionTitle title="ACTIVITIES" />
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
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    fontSize: 13,
  },
})

export default ActivityStatusToggles
