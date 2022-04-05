import React, { useCallback, useState } from 'react'
import { Modal, Pressable, StyleSheet, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCalendar, faTimes } from '@fortawesome/pro-light-svg-icons'
import Label from '../ui/label'
import DateRangePicker from './date-range-picker'
import SectionTitle from './section-title'

const DateRange = () => {
  const [isDateRangeModalVisible, setIsDateRangeModalVisible] = useState(false)
  const handlePickStartDate = useCallback(() => {
    setIsDateRangeModalVisible(true)
  }, [])
  const [dateRange, setDateRange] = useState<string[]>(['', ''])
  const [startDate, endDate] = dateRange

  return (
    <View style={styles.container}>
      <SectionTitle title="DATE RANGE" />
      <View style={styles.content}>
        <Pressable style={styles.button} onPress={handlePickStartDate}>
          <Text style={styles.label}>{startDate || 'Start'}</Text>
          {calendarIcon}
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondButton]}
          onPress={handlePickStartDate}>
          <Text style={styles.label}>{endDate || 'End'}</Text>
          {calendarIcon}
        </Pressable>
        <Modal
          transparent
          animationType={'slide'}
          visible={isDateRangeModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Label text="Date Range" variant="strong" />
                <Pressable onPress={() => setIsDateRangeModalVisible(false)}>
                  <FontAwesomeIcon icon={faTimes} color={'#000'} />
                </Pressable>
              </View>
              <DateRangePicker
                initialRange={dateRange}
                onSuccess={(_startDate: string, _endDate: string) =>
                  setDateRange([_startDate, _endDate])
                }
              />
            </View>
          </View>
        </Modal>
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
  icon: {
    marginLeft: 5,
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    color: '#1D1E21',
    fontSize: 13,
  },
  day: {
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '90%',
    borderColor: '#D9DFE5',
    borderWidth: 1,
    paddingVertical: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
})

const calendarIcon = (
  <FontAwesomeIcon
    icon={faCalendar}
    style={styles.icon}
    size={16}
    color={'#646F85'}
  />
)

export default DateRange
