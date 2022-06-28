require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests()
import 'react-native-gesture-handler/jestSetup'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-qrcode-svg', () => {
  const RN = require('react-native')
  return RN.View
})
jest.mock('react-native-error-boundary', () => {
  const RN = require('react-native')
  return RN.View
})
jest.mock('react-native-calendars', () => {
  return {
    Calendar: () => null,
  }
})

jest.mock('react-native-modal-filter-picker', () => {
  const RN = require('react-native')
  return RN.View
})

jest.mock('react-native-fs', () => {
  return {}
})

jest.mock('react-native-share', () => {
  return {}
})

jest.mock('rn-flipper-async-storage-advanced', () => {
  return {}
})
