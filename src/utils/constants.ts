import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'
// import { faceliftPalette } from '../theme'

export const COPY_BUTTON_TIMEOUT = 2000
export const FADE_IN_OUT_DURATION = 400
export const GRADIENT_BACKGROUND_HEIGHT = 225
export const ICON_SIZE = scale(25)
export const ONBOARDING_SCREEN_DEFAULT_PADDING = scale(40)
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height

// export const GRADIENT_COLORS = [
//   faceliftPalette.gradientEndColor,
//   faceliftPalette.gradientMiddeColor,
//   faceliftPalette.gradientMiddeColor,
//   faceliftPalette.gradientStartColor,
// ]

export const KEYS = {
  ACTIVE_NETWORK_KEY: 'activeNetworkKey',
  ACTIVE_THEME: 'activeTheme',
  ACTIVE_LANG: 'activeLang',
  ACCOUNTS_IDS_FOR_TESTNET: 'accountsIdsForTestnet',
  ACCOUNTS_IDS_FOR_MAINNET: 'accountsIdsForMainnet',
}
