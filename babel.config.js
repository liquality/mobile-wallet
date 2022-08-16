module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          // crypto: 'react-native-quick-crypto',commented to avoid crash issue on aOS and iOS while creating seed phrase
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        allowUndefined: true,
      },
    ],
  ],
}
