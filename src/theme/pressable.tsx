import {
  Pressable as Press,
  PressableProps,
  StyleProp,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
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
import { useRecoilValue } from 'recoil'
import {
  APP_BUTTON_STYLE,
  APP_HALF_BUTTON_STYLE,
  APP_BUTTON_TEXT_STYLE,
  APP_HALF_BUTTON_TEXT_STYLE,
  Box,
  faceliftPalette,
} from '.'
import { ThemeType as Theme } from './theme'

import { AppIcons } from '../assets'
const { ArrowLeft } = AppIcons

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'pressableVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'pressableVariants' })], Press)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label?: string | { tx: TxKeyPath }
    txOptions?: i18n.TranslateOptions
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    icon?: boolean
    isLoading?: boolean
    buttonSize?: 'full' | 'half'
    customView?: React.ReactElement
  }

export const Pressable: FC<Props> = (props) => {
  const {
    variant = 'solid',
    buttonSize = 'full',
    icon = false,
    label = '',
    disabled,
    txOptions,
    style: styles,
    textStyle: overrideTextStyle,
    isLoading = false,
    customView: CV,
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

  const theme = useTheme<Theme>()

  const currentVariant =
    disabled && variant === 'solid' ? 'solidDisabled' : variant

  const buttonStyle =
    buttonSize === 'full' ? APP_BUTTON_STYLE : APP_HALF_BUTTON_STYLE

  const textStyle =
    buttonSize === 'full' ? APP_BUTTON_TEXT_STYLE : APP_HALF_BUTTON_TEXT_STYLE

  const borderColor =
    disabled === undefined
      ? faceliftPalette.active
      : disabled
      ? faceliftPalette.grey
      : faceliftPalette.white

  return (
    <BaseButton
      {...rest}
      variant={currentVariant}
      disabled={disabled}
      style={[buttonStyle, styles, { borderColor }]}>
      {isLoading ? (
        <ActivityIndicator color={theme.colors.spinner} />
      ) : icon ? (
        CV || (
          <Box
            alignItems={'center'}
            flexDirection={'row'}
            width="100%"
            height={'100%'}
            paddingHorizontal="xl"
            justifyContent="space-between">
            <Text
              variant={currentVariant}
              style={[
                textStyle,
                overrideTextStyle,
                {
                  color: disabled
                    ? faceliftPalette.grey
                    : faceliftPalette.white,
                },
              ]}>
              {content}
            </Text>
            <ArrowLeft
              fill={disabled ? faceliftPalette.grey : faceliftPalette.white}
            />
          </Box>
        )
      ) : (
        CV || (
          <Text variant={currentVariant} style={[textStyle, overrideTextStyle]}>
            {content}
          </Text>
        )
      )}
    </BaseButton>
  )
}
