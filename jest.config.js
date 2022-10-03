const config = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest/setup.js'],
  transform: {
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-reanimated|@liquality|react-native-background-actions|react-native-flipper|react-native-mmkv-flipper-plugin|react-native-size-matters|react-native-linear-gradient|react-native-bottom-drawer-view)/)',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
}

module.exports = config
