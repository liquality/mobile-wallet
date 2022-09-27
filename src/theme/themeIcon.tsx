import React from 'react'
import { AppIcons } from '../assets'
import { useColorScheme } from 'react-native'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'

const {
  OnlyLqLogoDark,
  OnlyLqLogoLight,
  InactiveRadioButtonDark,
  InactiveRadioButtonLight,
  ActiveRadioButton,
} = AppIcons

const icons: any = {
  OnlyLqLogolight: OnlyLqLogoDark,
  OnlyLqLogodark: OnlyLqLogoLight,
  InactiveRadioButtondark: InactiveRadioButtonDark,
  InactiveRadioButtonlight: InactiveRadioButtonLight,
  ActiveRadioButtondark: ActiveRadioButton,
  ActiveRadioButtonlight: ActiveRadioButton,
}

type IconName = 'OnlyLqLogo' | 'InactiveRadioButton' | 'ActiveRadioButton'

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
