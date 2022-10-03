import React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { Box } from './box'

export const RefreshIndBox = createRestyleComponent<
  VariantProps<Theme, 'refreshIndicatorVariants'> &
    React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'refreshIndicatorVariants' })], Box)
