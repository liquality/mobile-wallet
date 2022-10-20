import React from 'react'
import { AppIcons } from '../assets'
import { useColorScheme } from 'react-native'
import { themeMode } from '../atoms'
import { useRecoilValue } from 'recoil'
import { SvgProps } from 'react-native-svg'
import { ICON_SIZE } from '../utils'

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
  width?: number
  height?: number
}

export const ThemeIcon = ({
  iconName,
  width = ICON_SIZE,
  height = ICON_SIZE,
}: IconProps) => {
  const theme = useRecoilValue(themeMode)
  let currentTheme = useColorScheme() || 'light'
  if (theme) {
    currentTheme = theme
  }

  const Icon: React.FC<SvgProps> = icons[`${iconName}${currentTheme}`]

  return <Icon width={width} height={height} />
}
