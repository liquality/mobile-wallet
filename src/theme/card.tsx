import React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { Box } from './box'

export const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'cardVariants' })], Box)
