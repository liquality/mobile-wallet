import { ActivityIndicator, Pressable, PressableProps } from 'react-native'
import {
  ColorProps,
  useTheme,
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'

import Text from './text'
import { Theme } from './'
import React, { FC, useMemo } from 'react'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'buttonVariants' })], Pressable)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    type?: 'primary' | 'secondary' | 'tertiary'
    variant: 's' | 'm' | 'l'
    label: string | { tx: TxKeyPath }
    onPress: () => void
    children?: React.ReactElement
    appendChildren?: boolean
    isLoading?: boolean
    isActive?: boolean
    isBorderless?: boolean
    txOptions?: i18n.TranslateOptions
  }

const Button: FC<Props> = (props) => {
  const {
    type = 'primary',
    variant = 'm',
    onPress,
    label,
    isLoading = false,
    isActive = true,
    isBorderless = false,
    children,
    appendChildren = false,
    txOptions,
  } = props

  const theme = useTheme<Theme>()
  let content
  if (typeof label !== 'string') {
    const { tx } = label
    content = tx && translate(tx, txOptions)
  } else {
    content = label
  }

  const borderWidth = useMemo(
    () => ({
      borderWidth: isBorderless ? 0 : 1,
    }),
    [isBorderless],
  )

  const opacity = useMemo(
    () => ({
      opacity: isActive ? 1 : 0.7,
    }),
    [isActive],
  )

  const backgroundColor = useMemo(
    () => ({
      backgroundColor:
        theme.colors[
          type === 'primary'
            ? 'buttonBackgroundPrimary'
            : 'buttonBackgroundSecondary'
        ],
    }),
    [type, theme.colors],
  )

  return (
    <BaseButton
      disabled={!isActive}
      variant={variant}
      style={[borderWidth, opacity, backgroundColor]}
      onPress={onPress}>
      {!isLoading && !appendChildren && children}
      {isLoading ? (
        <ActivityIndicator color={theme.colors.spinner} />
      ) : (
        <Text
          variant={
            type === 'tertiary' ? 'tertiaryButtonLabel' : 'mainButtonLabel'
          }
          style={{
            color:
              theme.colors[
                type === 'primary'
                  ? 'buttonFontPrimary'
                  : type === 'secondary'
                  ? 'buttonFontSecondary'
                  : 'buttonFontTertiary'
              ],
          }}>
          {content}
        </Text>
      )}
      {!isLoading && appendChildren && children}
    </BaseButton>
  )
}

export default Button
