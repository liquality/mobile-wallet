import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import ModalFilterPicker from 'react-native-modal-filter-picker'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

export const SORT_OPTIONS = [
  { key: 'needs_attention', label: 'Needs attention' },
  { key: 'pending', label: 'Pending' },
  { key: 'canceled', label: 'Canceled' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
  { key: 'by_date', label: 'By date (newest first)' },
  { key: 'by_type', label: 'By type (A to Z)' },
  { key: 'by_token', label: 'By Token (A to Z)' },
]

const SorterPicker = ({
  isOpen,
  value,
  onSelect,
  onCancel,
}: {
  isOpen: boolean
  value: string | undefined
  onSelect: (key: string) => void
  onCancel: () => void
}) => (
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
