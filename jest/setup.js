require('../shim.js')
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests()
import 'react-native-gesture-handler/jestSetup'
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.mock('react-native-qrcode-scanner', () => jest.fn())
jest.mock('react-native-camera', () => jest.fn())

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
)

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

jest.mock('@react-native-community/push-notification-ios', () => ({
  checkPermissions: jest.fn(),
  requestPermissions: jest.fn(),
  addEventListener: jest.fn(),
  addNotificationRequest: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}))

jest.mock('react-native-push-notification', () => ({
  checkPermissions: jest.fn(),
  requestPermissions: jest.fn(),
  addEventListener: jest.fn(),
  addNotificationRequest: jest.fn(),
  cancelLocalNotifications: jest.fn(),
}))
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.mock('react-native-background-actions', () => ({
  on: jest.fn(),
  stop: jest.fn(),
  start: jest.fn(),
  updateNotification: jest.fn(),
  isRunning: jest.fn(),
}))
jest.mock('react-native-vision-camera', () => {
  return {}
})
jest.mock('expo-localization', () => {
  return {}
})
jest.mock('i18n-js', () => {
  return {
    t: (key) => `${key}.test`,
  }
})

jest.mock('@react-native-firebase/analytics', () => ({
  analytics: jest.fn(() => ({
    logEvent: jest.fn(),
  })),
}))

Object.defineProperty(global.window, 'crypto', {
  getRandomValues: () => '',
})

global.window = {
  ...global.window,
  crypto: { getRandomValues: () => '' },
}
