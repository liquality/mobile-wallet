module.exports = {
  root: true,
  env: {
    jest: true,
    'react-native/react-native': true,
  },
  extends: ['@react-native-community/eslint-config', 'eslint-config-prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-native'],
  rules: {
    // 'prettier/prettier': 'off',
    semi: ['error', 'never'],
    'no-console': 2,
    'array-bracket-spacing': 2,
    quotes: 2,
    'comma-dangle': 2,
    'arrow-parens': 2,
    'no-multiple-empty-lines': 'error',

    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-single-element-style-arrays': 'warn',

    //TODO Update these once the whole team agrees on a coding styling standard
    // 'object-curly-spacing': 'error',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/strict-boolean-expressions': 'off',
    // '@typescript-eslint/no-floating-promises': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    // 'react/jsx-curly-spacing': ['error', {
    //   when: 'always',
    //   allowMultiline: true,
    //   children: true,
    // }],
    // 'eol-last': ['error', 'always'],
    // Indent with 2 spaces
    // indent: ['error', 2],
    // Indent JSX with 2 spaces
    // 'react/jsx-indent': ['error', 2],
    // Indent props with 2 spaces
    // 'react/jsx-indent-props': ['error', 2],
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
