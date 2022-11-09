import React, { FC } from 'react'
import { Modal, View, Pressable, StyleSheet, Dimensions } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import { Theme } from 'react-native-calendars/src/types'
import { AppIcons, Fonts } from '../../assets'
import { faceliftPalette, palette } from '../../theme'
import Label from '../ui/label'

const { TimesIcon } = AppIcons

const CALENDAR_THEME = {
  textSectionTitleColor: palette.darkGray,
  todayTextColor: palette.blueVioletPrimary,
  dayTextColor: palette.black2,
  textDisabledColor: palette.textDisabledColor,
  arrowColor: palette.darkGray,
  monthTextColor: palette.black2,
  textDayFontFamily: Fonts.Regular,
  textMonthFontFamily: Fonts.Regular,
  textDayHeaderFontFamily: Fonts.Regular,
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
    backgroundColor: faceliftPalette.semiTransparentGrey,
  },
  modalContent: {
    backgroundColor: palette.white,
    width: '90%',
    borderColor: palette.gray,
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
            <TimesIcon />
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
