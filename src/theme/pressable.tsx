import { Pressable as Press, PressableProps } from 'react-native'
import {
  ColorProps,
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'

import { Text } from './text'
import { ThemeType as Theme } from './theme'
import React, { FC } from 'react'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { faceliftPalette } from './faceliftPalette'
import { useRecoilValue } from 'recoil'

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'pressableVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'pressableVariants' })], Press)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string | { tx: TxKeyPath }
    txOptions?: i18n.TranslateOptions
    variant?: 'solid' | 'outline'
  }

export const Pressable: FC<Props> = (props) => {
  const { variant = 'solid', label, txOptions, ...rest } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected

  let content
  if (typeof label !== 'string') {
    const { tx } = label
    content = tx && translate(tx, txOptions)
  } else {
    content = label
  }

  let backgroundColor = faceliftPalette.buttonActive

  let borderColor = faceliftPalette.white

  if (variant === 'solid') {
    borderColor = faceliftPalette.transparent
  } else {
    backgroundColor = faceliftPalette.transparent
  }

  return (
    <BaseButton
      {...rest}
      variant={variant}
      style={{ backgroundColor, borderColor }}>
      <Text variant={'pressableLabel'}>{content}</Text>
    </BaseButton>
  )
}
