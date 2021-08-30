import React, { createContext } from 'react'
import { StyleSheet } from 'react-native'

const theme = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
})

export const ThemeContext = createContext(theme)

export const LiqualityThemeProvider = ({
  children,
}: {
  children: React.ReactElement
}) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
