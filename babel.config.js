module.exports = {
  presets: ['module:metro-react-native-babel-preset',  ["babel-preset-expo", {
    lazyImports: true, // <<< The fix
  ]],
  plugins: [
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
