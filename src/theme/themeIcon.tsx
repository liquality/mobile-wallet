import React from 'react'
import { AppIcons } from '../assets'
import { useColorScheme } from 'react-native'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'

const { OnlyLqLogoDark, OnlyLqLogoLight } = AppIcons

const icons: any = {
  OnlyLqLogolight: OnlyLqLogoDark,
  OnlyLqLogodark: OnlyLqLogoLight,
}

type IconName = 'OnlyLqLogo'

type IconProps = {
  iconName: IconName
}

export const ThemeIcon = ({ iconName }: IconProps) => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() || 'light'
  if (theme) {
    currentTheme = theme
  }

  const Icon = icons[`${iconName}${currentTheme}`]

  return <Icon />
}
