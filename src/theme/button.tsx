import { ActivityIndicator, Pressable, PressableProps } from 'react-native'
import {
  ColorProps,
  useTheme,
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'

import { Text } from './text'
import { ThemeType as Theme } from './theme'
import React, { FC, useMemo } from 'react'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'

export const BaseButton = createRestyleComponent<
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
    onlyDisabled?: boolean
  }

export const Button: FC<Props> = (props) => {
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
    onlyDisabled,
  } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
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

  const backgroundColor = useMemo(
    () => ({
      backgroundColor:
        theme.colors[
          type === 'primary'
            ? isActive
              ? 'defaultButton'
              : 'inactiveButton'
            : 'buttonBackgroundSecondary'
        ],
    }),
    [theme.colors, type, isActive],
  )

  return (
    <BaseButton
      disabled={onlyDisabled ? onlyDisabled : !isActive}
      variant={variant}
      style={[borderWidth, backgroundColor]}
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
                  ? isActive
                    ? 'buttonFontPrimary'
                    : 'inactiveText'
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
