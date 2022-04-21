import React, { FC } from 'react'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Modal, View, Pressable, StyleSheet, Dimensions } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'
import Label from '../ui/label'

const CALENDAR_THEME = {
  textSectionTitleColor: '#646F85',
  todayTextColor: '#9D4DFA',
  dayTextColor: '#000D35',
  textDisabledColor: 'rgba(0, 13, 53, 0.5)',
  arrowColor: '#646F85',
  monthTextColor: '#000D35',
  textDayFontFamily: 'Montserrat-Regular',
  textMonthFontFamily: 'Montserrat-Regular',
  textDayHeaderFontFamily: 'Montserrat-Light',
  textDayFontWeight: '300',
  textMonthFontWeight: '400',
  textDayHeaderFontWeight: '500',
  textDayFontSize: 13,
  textMonthFontSize: 13,
  textDayHeaderFontSize: 13,
}

type Props = {
  open: boolean
  date: string
  title: string
  onChange: (date: string) => void
  onClose: () => void
}

const styles = StyleSheet.create({
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
    zIndex: 1,
  },
  close: {
    width: 32,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    width: (331 * Dimensions.get('screen').width) / 375,
  },
})

const DatePicker: FC<Props> = ({ title, open, date, onChange, onClose }) => (
  <Modal transparent animationType={'slide'} visible={open}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Label text={title} variant="strong" />
          <Pressable style={styles.close} onPress={onClose}>
            <FontAwesomeIcon icon={faTimes} color={'#000'} />
          </Pressable>
        </View>
        <Calendar
          style={styles.calendar}
          disableMonthChange
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          theme={CALENDAR_THEME as Theme}
          onDayPress={(_date: DateData): void => {
            onChange(_date.dateString)
          }}
          current={date}
          markedDates={{
            [date]: { selected: true },
          }}
        />
      </View>
    </View>
  </Modal>
)

export default DatePicker
