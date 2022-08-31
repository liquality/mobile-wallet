import React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { Theme } from './index'
import { Dropdown as Dd } from 'react-native-element-dropdown'

const Dropdown = createRestyleComponent<
  VariantProps<Theme, 'dropDownVariants'> & React.ComponentProps<typeof Dd>,
  Theme
>([createVariant({ themeKey: 'dropDownVariants' })], Dd)

export default Dropdown
