import React, { FC } from 'react'
import { ScrollView as SV, ScrollViewProps } from 'react-native'
import { SCREEN_HEIGHT } from '../utils'
import {
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'

const BaseScrollView = createRestyleComponent<
  VariantProps<Theme, 'scrollViewVariants'> & ScrollViewProps,
  Theme
>([createVariant({ themeKey: 'scrollViewVariants' })], SV)

type Props = React.ComponentProps<typeof BaseScrollView>

export const ScrollView: FC<Props> = (props) => {
  const { children, ...rest } = props
  const enableScroll = SCREEN_HEIGHT < 700
  return (
    <BaseScrollView {...rest} scrollEnabled={enableScroll}>
      {children}
    </BaseScrollView>
  )
}
