import { ViewStyle, StyleProp, TextStyle } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Fonts } from '../assets'
import { ONBOARDING_PADDING } from '../utils'
import { faceliftPalette } from './faceliftPalette'

export const FLEX_1: ViewStyle = {
  flex: 1,
}

export const GRADIENT_STYLE: ViewStyle = {
  flex: 1,
  paddingHorizontal: scale(ONBOARDING_PADDING),
}

export const OVERVIEW_TAB_BAR_STYLE: ViewStyle = {
  width: scale(90),
  padding: 0,
  alignItems: 'flex-start',
}

export const OVERVIEW_TAB_STYLE: ViewStyle = {
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: {
    height: 0,
    width: 0,
  },
  elevation: 0,
}

export const APP_BUTTON_STYLE: ViewStyle = {
  height: scale(50),
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}

export const APP_HALF_BUTTON_STYLE: ViewStyle = {
  ...APP_BUTTON_STYLE,
  height: scale(40),
  width: '50%',
}

export const APP_BUTTON_TEXT_STYLE: TextStyle = {
  fontFamily: Fonts.Regular,
  fontWeight: '500',
  fontSize: scale(15),
}

export const APP_HALF_BUTTON_TEXT_STYLE: TextStyle = {
  ...APP_BUTTON_TEXT_STYLE,
  fontSize: scale(13),
}

export const HEADER_TITLE_STYLE: StyleProp<
  Pick<TextStyle, 'fontFamily' | 'fontWeight' | 'fontSize'> & {
    color?: string | undefined
  }
> = {
  fontFamily: Fonts.Regular,
  fontWeight: '500',
  fontSize: scale(14),
  color: faceliftPalette.black,
}

export const MANAGE_ASSET_HEADER: StyleProp<
  Pick<TextStyle, 'fontFamily' | 'fontWeight' | 'fontSize'> & {
    color?: string | undefined
  }
> = {
  ...HEADER_TITLE_STYLE,
  color: faceliftPalette.darkGrey,
}
