require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests()
import 'react-native-gesture-handler/jestSetup'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-webview', () => {
  const RN = require('react-native')
  return RN.View
})
