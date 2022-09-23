import { createBox } from '@shopify/restyle'
import React from 'react'
import { ThemeType as Theme } from './theme'
import { useColorScheme } from 'react-native'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'
import { faceliftPalette } from './faceliftPalette'

const Box = createBox<Theme>()

export const ThemeLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark'
      ? faceliftPalette.mainBackground
      : faceliftPalette.white

  return (
    <Box flex={1} style={{ backgroundColor }}>
      {children}
    </Box>
  )
}
