import React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { Dropdown as Dd } from 'react-native-element-dropdown'

export const Dropdown = createRestyleComponent<
  VariantProps<Theme, 'dropDownVariants'> & React.ComponentProps<typeof Dd>,
  Theme
>([createVariant({ themeKey: 'dropDownVariants' })], Dd)
