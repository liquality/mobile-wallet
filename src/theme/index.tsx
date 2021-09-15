import React, { createContext } from 'react'
import { StyleSheet } from 'react-native'

const theme = StyleSheet.create({
  buttonText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    // white: '#FFFFFF',
    // black: '#000000',
    // lightBlueGray1: '#F0F7F9',
    // lightBlueGray2: '#F8FAFF',
    // lightBlueGray3: '#D9DFE5',
    // lightBlueGray4: '#A8AEB7',
    // middleGray1: '#9A99A2',
    // middleGray2: '#646F85',
    // darkGray1: '#3D4767',
    // darkGray2: '#1D1E21',
    // darkGray3: '#000D35',
    // purple: '#9D4DFA',
    // green: '#2CD2CF',
    // lightGreen: '#38FFFB',
    // red: '#F12274',
    // darkPink: '#D421EB',
    // orange: '#FE7F6B',
    // gradient: 'rgb(48,46,120)', //#302e78 -> #1ce4c3
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
