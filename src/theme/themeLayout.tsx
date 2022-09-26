import { createBox } from '@shopify/restyle'
import React from 'react'
import { ThemeType as Theme } from './theme'
import { useColorScheme, StatusBar } from 'react-native'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'
import { faceliftPalette } from './faceliftPalette'

const Box = createBox<Theme>()

type Props = React.ComponentProps<typeof Box>

export const ThemeLayout = (props: Props) => {
  const { children, style, ...rest } = props

  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() as string
  if (theme) {
    currentTheme = theme
  }

  const backgroundColor =
    currentTheme === 'dark'
      ? faceliftPalette.mainBackground
      : faceliftPalette.white

  const statusBar = currentTheme === 'dark' ? 'light-content' : 'dark-content'

  return (
    <Box {...rest} flex={1} style={[style, { backgroundColor }]}>
      <StatusBar barStyle={statusBar} />
      {children}
    </Box>
  )
}
