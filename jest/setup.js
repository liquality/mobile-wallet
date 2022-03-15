require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests()
import 'react-native-gesture-handler/jestSetup'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: '',
}))
jest.mock('react-native-qrcode-svg', () => {
  const RN = require('react-native')
  return RN.View
})
jest.mock('react-native-error-boundary', () => {
  const RN = require('react-native')
  return RN.View
})
