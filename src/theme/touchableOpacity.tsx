import {
  TouchableOpacity as TouchOpa,
  TouchableOpacityProps,
} from 'react-native'
import {
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'
import React, { FC } from 'react'
import { ThemeType as Theme } from './theme'

const BaseTouchableOpa = createRestyleComponent<
  VariantProps<Theme, 'touchableOpacityVariants'> & TouchableOpacityProps,
  Theme
>([createVariant({ themeKey: 'touchableOpacityVariants' })], TouchOpa)

type Props = React.ComponentProps<typeof BaseTouchableOpa>

export const TouchableOpacity: FC<Props> = ({ children, ...rest }: Props) => {
  return (
    <BaseTouchableOpa activeOpacity={0.7} {...rest}>
      {children}
    </BaseTouchableOpa>
  )
}
