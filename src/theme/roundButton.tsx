import * as React from 'react'
import { FC, useCallback } from 'react'
import { Pressable, PressableProps } from 'react-native'
import { Text } from './text'
import {
  ColorProps,
  createRestyleComponent,
  createVariant,
  useTheme,
  VariantProps,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import { Box } from './box'
import { TxKeyPath } from '../i18n'
import i18n from 'i18n-js'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'
import { AppIcons } from '../assets'
const { Exchange: SwapIcon, UpIcon: SendIcon, DownIcon: ReceiveIcon } = AppIcons

export const RoundBaseButton = createRestyleComponent<
  VariantProps<Theme, 'roundButtonVariants'> & PressableProps,
  Theme
>([createVariant({ themeKey: 'roundButtonVariants' })], Pressable)

type RoundButtonProps = React.ComponentProps<typeof RoundBaseButton> &
  ColorProps<Theme> & {
    type: 'SEND' | 'SWAP' | 'RECEIVE'
    variant: string
    onPress: () => void
    label?: string
    tx?: TxKeyPath
    txOptions?: i18n.TranslateOptions
  }

export const RoundButton: FC<RoundButtonProps> = (props) => {
  const theme = useTheme<Theme>()
  const { onPress, label, tx, txOptions, type, variant } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected
  const { buttonFontSecondary, buttonFontPrimary } = theme.colors
  const iconFontColor =
    variant === 'largePrimary'
      ? buttonFontSecondary
      : variant === 'secondary'
      ? buttonFontPrimary
      : buttonFontSecondary

  const computeIconSize = useCallback(() => {
    if (variant === 'secondary') {
      return variant === 'largePrimary' || type === 'SWAP' ? 25 : 15
    }

    return variant === 'largePrimary' ? 35 : 20
  }, [type, variant])

  return (
    <Box justifyContent="flex-end" alignItems="center" marginHorizontal="m">
      <RoundBaseButton variant={variant} onPress={onPress}>
        {type === 'SEND' ? (
          <SendIcon width={computeIconSize()} height={computeIconSize()} />
        ) : type === 'SWAP' ? (
          <SwapIcon
            width={computeIconSize()}
            height={computeIconSize()}
            fill={iconFontColor}
            stroke={iconFontColor}
          />
        ) : (
          <ReceiveIcon width={computeIconSize()} height={computeIconSize()} />
        )}
      </RoundBaseButton>
      {tx ? (
        <Text variant="mainButtonLabel" tx={tx} txOptions={txOptions} />
      ) : label ? (
        <Text variant="mainButtonLabel">{label}</Text>
      ) : null}
    </Box>
  )
}
