import React, { FC, useCallback, useState } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import SectionTitle from './section-title'
import DatePicker from './date-picker'
import { labelTranslateFn } from '../../utils'
import { AppIcons, Fonts } from '../../assets'

const { CalendarIcon } = AppIcons

const DateRange: FC<{
  start: string | undefined
  end: string | undefined
  onChange: (_start: string, _end: string) => void
}> = ({ start, end, onChange }) => {
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false)
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false)
  const handleOpenStartDate = useCallback(() => {
    setStartDatePickerVisible(true)
  }, [])
  const handleCloseStartDate = useCallback(() => {
    setStartDatePickerVisible(false)
  }, [])
  const handleOpenPickEndDate = useCallback(() => {
    setEndDatePickerVisible(true)
  }, [])
  const handleCloseEndDate = useCallback(() => {
    setEndDatePickerVisible(false)
  }, [])

  const handleChangeStartDate = useCallback(
    (date) => {
      onChange(date, end)
    },
    [end, onChange],
  )

  const handleChangeEndDate = useCallback(
    (date) => {
      onChange(start, date)
    },
    [onChange, start],
  )

  return (
    <View style={styles.container}>
      <SectionTitle tx="common.dateRange" />
      <View style={styles.content}>
        <Pressable style={styles.button} onPress={handleOpenStartDate}>
          <Text style={styles.label}>
            {start || labelTranslateFn('common.start')}
          </Text>
          <CalendarIcon />
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondButton]}
          onPress={handleOpenPickEndDate}>
          <Text style={styles.label}>
            {end || labelTranslateFn('common.end')}
          </Text>
          <CalendarIcon />
        </Pressable>
        <DatePicker
          title={labelTranslateFn('common.startDate')!}
          open={isStartDatePickerVisible}
          onClose={handleCloseStartDate}
          date={start}
          onChange={handleChangeStartDate}
        />
        <DatePicker
          title={labelTranslateFn('common.endDate')!}
          open={isEndDatePickerVisible}
          onClose={handleCloseEndDate}
          date={end}
          onChange={handleChangeEndDate}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    height: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#646F85',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 7,
  },
  secondButton: {
    marginLeft: 12,
  },
  label: {
    fontFamily: Fonts.Regular,
    color: '#1D1E21',
    fontSize: 13,
  },
})

export default DateRange
