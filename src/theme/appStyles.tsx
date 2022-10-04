import { ViewStyle } from 'react-native'
import { scale } from 'react-native-size-matters'
import { ONBOARDING_SCREEN_DEFAULT_PADDING } from '../utils'

export const FLEX_1: ViewStyle = {
  flex: 1,
}

export const GRADIENT_STYLE: ViewStyle = {
  flex: 1,
  paddingHorizontal: ONBOARDING_SCREEN_DEFAULT_PADDING,
}

export const OVERVIEW_TAB_BAR_STYLE: ViewStyle = {
  width: scale(70),
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
