import React from 'react'
import {
  createRestyleComponent,
  createVariant,
  VariantProps,
} from '@shopify/restyle'
import { Theme } from './index'
import Box from './box'

const RefIndBox = createRestyleComponent<
  VariantProps<Theme, 'refreshIndicatorVariants'> &
    React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'refreshIndicatorVariants' })], Box)

export default RefIndBox
