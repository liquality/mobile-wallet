import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'

export const COPY_BUTTON_TIMEOUT = 2000
export const FADE_IN_OUT_DURATION = 400
export const GRADIENT_BACKGROUND_HEIGHT = scale(175)
export const LARGE_TITLE_HEADER_HEIGHT = scale(81)
export const RECEIVE_HEADER_HEIGHT = scale(160)
export const ICON_SIZE = scale(23)
export const ONBOARDING_PADDING = 36
export const SCREEN_PADDING = 20
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height
export const INPUT_OPACITY_INACTIVE = 0.6
export const CONGRATULATIONS_MESSAGE_MARGIN_TOP = 300
export const INPUT_OPACITY_ACTIVE = 1
export const KEYS = {
  ACTIVE_NETWORK_KEY: 'activeNetworkKey',
  ACTIVE_THEME: 'activeTheme',
  ACTIVE_LANG: 'activeLang',
  ACCOUNTS_IDS_FOR_TESTNET: 'accountsIdsForTestnet',
  ACCOUNTS_IDS_FOR_MAINNET: 'accountsIdsForMainnet',
}
