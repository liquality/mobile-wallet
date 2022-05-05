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
import React, { FC } from 'react'

const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'buttonVariants' })], Pressable)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    type?: 'primary' | 'secondary' | 'tertiary'
    variant: 's' | 'm' | 'l'
    label: string
    onPress: () => void
    children?: React.ReactElement
    appendChildren?: boolean
    isLoading?: boolean
    isActive?: boolean
    isBorderless?: boolean
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
  } = props

  const theme = useTheme<Theme>()

  return (
    <BaseButton
      variant={variant}
      style={{
        borderWidth: isBorderless ? 0 : 1,
        opacity: isActive ? 1 : 0.7,
        backgroundColor:
          theme.colors[
            type === 'primary'
              ? 'buttonBackgroundPrimary'
              : 'buttonBackgroundSecondary'
          ],
      }}
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
          {label}
        </Text>
      )}
      {!isLoading && appendChildren && children}
    </BaseButton>
  )
}

export default Button
