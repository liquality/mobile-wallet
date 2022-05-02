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
    appendChildren?: boolean
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
  appendChildren = false,
}: Props) => {
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
