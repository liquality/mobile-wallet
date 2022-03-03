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
import React from 'react'

// const BaseButton = createBox<Theme, PressableProps>(Pressable)
const BaseButton = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'buttonVariants' })], Pressable)

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string
    onPress: () => void
    children?: React.ReactElement
    isLoading?: boolean
    isActive?: boolean
    isBorderless?: boolean
    type?: 'primary' | 'secondary' | 'tertiary'
  }

const Button = ({
  type = 'primary',
  variant = 'm',
  onPress,
  label,
  isLoading = false,
  isActive = true,
  isBorderless = false,
  children,
}: Props) => {
  const theme = useTheme<Theme>()

  return (
    <BaseButton
      variant={variant}
      style={[
        {
          borderWidth: isBorderless ? 0 : 1,
          opacity: isActive ? 1 : 0.7,
        },
        type === 'primary'
          ? {
              backgroundColor: theme.colors.buttonBackgroundPrimary,
            }
          : {
              backgroundColor: theme.colors.buttonBackgroundSecondary,
            },
      ]}
      onPress={onPress}>
      {!isLoading && !!children && children}
      {isLoading ? (
        <ActivityIndicator color={theme.colors.spinner} />
      ) : (
        <Text
          variant={
            type === 'tertiary' ? 'tertiaryButtonLabel' : 'mainButtonLabel'
          }
          style={
            type === 'primary'
              ? {
                  color: theme.colors.buttonFontPrimary,
                }
              : type === 'secondary'
              ? {
                  color: theme.colors.buttonFontSecondary,
                }
              : {
                  color: theme.colors.buttonFontTertiary,
                }
          }>
          {label}
        </Text>
      )}
    </BaseButton>
  )
}

export default Button
