module.exports = {
  root: true,
  env: {
    jest: true,
    'react-native/react-native': true,
  },
  extends: [
    '@react-native-community/eslint-config',
    'eslint-config-prettier',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native'],
  rules: {
    semi: ['error', 'never'],
    'no-console': 2,
    'array-bracket-spacing': 2,
    quotes: 2,
    'comma-dangle': 2,
    'arrow-parens': 2,
    'no-multiple-empty-lines': 'error',

    'react-native/jsx-bracket-same-line': 0,
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-single-element-style-arrays': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
