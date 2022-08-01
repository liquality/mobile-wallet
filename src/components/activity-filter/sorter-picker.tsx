import React, { FC } from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import ModalFilterPicker from 'react-native-modal-filter-picker'
import { labelTranslateFn } from '../../utils'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

export const SORT_OPTIONS = [
  {
    key: 'needs_attention',
    label: labelTranslateFn('sortPicker.needs_attention')!,
  },
  { key: 'pending', label: labelTranslateFn('sortPicker.pending')! },
  { key: 'canceled', label: labelTranslateFn('sortPicker.canceled')! },
  { key: 'refunded', label: labelTranslateFn('sortPicker.refunded')! },
  { key: 'completed', label: labelTranslateFn('sortPicker.completed')! },
  { key: 'failed', label: labelTranslateFn('sortPicker.failed')! },
  { key: 'by_date', label: labelTranslateFn('sortPicker.by_date')! },
  { key: 'by_type', label: labelTranslateFn('sortPicker.by_type')! },
  { key: 'by_token', label: labelTranslateFn('sortPicker.by_token')! },
]

const SorterPicker: FC<{
  isOpen: boolean
  value: string | undefined
  onSelect: (key: string) => void
  onCancel: () => void
}> = ({ isOpen, value, onSelect, onCancel }) => (
  <ModalFilterPicker
    visible={isOpen}
    onSelect={onSelect as unknown as (key: string) => void}
    onCancel={onCancel}
    options={SORT_OPTIONS}
    selectedOption={value}
    showFilter={false}
    modal={{ transparent: true, animationType: 'slide' }}
    overlayStyle={styles.sortOverlay}
    listContainerStyle={styles.sortList}
    optionTextStyle={styles.optionText}
    selectedOptionTextStyle={[styles.optionText, styles.selectedOptionText]}
    cancelButtonStyle={styles.cancelButton}
    cancelButtonTextStyle={styles.optionText}
  />
)

const styles = StyleSheet.create({
  sortOverlay: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sortList: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 15,
    marginLeft: screenWidth * 0.1,
    marginTop: (screenHeight - 560) * 0.5,
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    color: '#1D1E21',
    fontSize: 14,
  },
  selectedOptionText: {
    fontWeight: '700',
  },
  cancelButton: {
    flex: 0,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
})

export default SorterPicker
