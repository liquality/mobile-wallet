import { ColorValue, TextInput as TxtInp, TextInputProps } from 'react-native'
import {
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'
import { ThemeType as Theme } from './theme'
import React, { FC } from 'react'
import i18n from 'i18n-js'
import { TxKeyPath, translate } from '../i18n'
import { langSelected as LS } from '../../src/atoms'
import { useRecoilValue } from 'recoil'
import { faceliftPalette } from './faceliftPalette'

const BaseTextInput = createRestyleComponent<
  VariantProps<Theme, 'textInputVariants'> & TextInputProps,
  Theme
>([createVariant({ themeKey: 'textInputVariants' })], TxtInp)

type Props = React.ComponentProps<typeof BaseTextInput> & {
  placeholderTx?: TxKeyPath
  txOptions?: i18n.TranslateOptions
  cursorColor?: ColorValue
}

export const TextInput: FC<Props> = (props) => {
  const {
    placeholderTx,
    txOptions,
    cursorColor = faceliftPalette.white,
    ...rest
  } = props
  const langSelected = useRecoilValue(LS)
  i18n.locale = langSelected

  if (placeholderTx) {
    const i18nText = translate(placeholderTx, txOptions)
    return (
      <BaseTextInput
        {...rest}
        selectionColor={cursorColor}
        placeholder={i18nText!}
      />
    )
  } else {
    return <BaseTextInput {...rest} selectionColor={cursorColor} />
  }
}
