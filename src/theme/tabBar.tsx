import * as React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
  useTheme,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { TabBar as TB, TabBarProps, Route } from 'react-native-tab-view'

export const BaseTabBar = createRestyleComponent<
  VariantProps<Theme, 'tabBarStyleVariants'> & TabBarProps<Route>,
  Theme
>([createVariant({ themeKey: 'tabBarStyleVariants' })], TB)

type Props = React.ComponentProps<typeof BaseTabBar> & {
  variant: 'light' | 'dark'
}

export const TabBar: React.FC<Props> = ({ variant = 'light', ...rest }) => {
  const theme = useTheme<Theme>()
  const indicatorStyle = theme.indicatorStyle[`${variant}`]
  return (
    <BaseTabBar {...rest} indicatorStyle={indicatorStyle} variant={variant} />
  )
}
