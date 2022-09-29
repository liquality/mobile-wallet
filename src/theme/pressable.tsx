import {
  Pressable as Press,
  PressableProps,
  StyleProp,
  ActivityIndicator,
  ViewStyle,
} from 'react-native'
import {
  ColorProps,
  createRestyleComponent,
  useTheme,
  VariantProps,
  createVariant,
} from '@shopify/restyle'

import { Text } from './text'
import React, { FC } from 'react'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { faceliftPalette } from './faceliftPalette'
import { useRecoilValue } from 'recoil'
import { Box } from '.'
import { ThemeType as Theme } from './theme'

import { AppIcons } from '../assets'
const { ArrowLeft } = AppIcons

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'pressableVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'pressableVariants' })], Press)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string | { tx: TxKeyPath }
    txOptions?: i18n.TranslateOptions
    variant?: 'solid' | 'outline'
    style?: StyleProp<ViewStyle>
    icon?: boolean
    isLoading?: boolean
  }

export const Pressable: FC<Props> = (props) => {
  const {
    variant = 'solid',
    icon = false,
    label,
    disabled,
    txOptions,
    style: styles,
    isLoading = false,
    ...rest
  } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected

  let content
  if (typeof label !== 'string') {
    const { tx } = label
    content = tx && translate(tx, txOptions)
  } else {
    content = label
  }

  let backgroundColor = faceliftPalette.buttonDefault

  let borderColor = faceliftPalette.white

  if (variant === 'solid') {
    borderColor = faceliftPalette.transparent
  } else {
    backgroundColor = faceliftPalette.transparent
  }

  const theme = useTheme<Theme>()

  const opacity = disabled ? 0.4 : 1

  return (
    <BaseButton
      {...rest}
      variant={variant}
      style={[styles, { backgroundColor, borderColor, opacity }]}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.spinner} />
      ) : icon ? (
        <Box
          alignItems={'center'}
          flexDirection={'row'}
          width="100%"
          height={'100%'}
          paddingHorizontal="m"
          justifyContent="space-between">
          <Text variant={'pressableLabel'}>{content}</Text>
          <ArrowLeft />
        </Box>
      ) : (
        <Text variant={'pressableLabel'}>{content}</Text>
      )}
    </BaseButton>
  )
}
