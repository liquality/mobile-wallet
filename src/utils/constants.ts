import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'
import { SvgProps } from 'react-native-svg'
import { AppIcons } from '../assets'
import { TxKeyPath } from '../i18n'

export const COPY_BUTTON_TIMEOUT = 2000
export const FADE_IN_OUT_DURATION = 400
export const GRADIENT_BACKGROUND_HEIGHT = scale(200)
export const LARGE_TITLE_HEADER_HEIGHT = scale(81)
export const RECEIVE_HEADER_HEIGHT = scale(160)
export const ICON_SIZE = scale(23)
export const ONBOARDING_PADDING = 36
export const SCREEN_PADDING = 20
export const DRAWER_PADDING = 32
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height
export const INPUT_OPACITY_INACTIVE = 0.6
export const INPUT_OPACITY_ACTIVE = 1
export const HORIZONTAL_CONTENT_HEIGHT = scale(65)

export const KEYS = {
  ACTIVE_NETWORK_KEY: 'activeNetworkKey',
  ACTIVE_THEME: 'activeTheme',
  ACTIVE_LANG: 'activeLang',
  ACCOUNTS_IDS_FOR_TESTNET: 'accountsIdsForTestnet',
  ACCOUNTS_IDS_FOR_MAINNET: 'accountsIdsForMainnet',
}

const {
  SendFilterIcon,
  SwapFilterIcon,
  NftFilterIcon,
  NftFilterInactiveIcon,
  PendingFilterIcon,
  CancelledFilterIcon,
  CompletedFilterIcon,
} = AppIcons

type IconType = React.FC<
  SvgProps & {
    fillSecondary?: string | undefined
  }
>

export type ButtonProps = {
  key: string
  value: TxKeyPath
  status: boolean
  icon: IconType
  inactiveIcon: IconType
}

export const transFilterBtns: Array<ButtonProps> = [
  {
    key: 'send',
    value: 'assetScreen.send',
    status: false,
    icon: SendFilterIcon,
    inactiveIcon: SendFilterIcon,
  },
  {
    key: 'swap',
    value: 'assetScreen.swap',
    status: false,
    icon: SwapFilterIcon,
    inactiveIcon: SwapFilterIcon,
  },
  {
    key: 'nft',
    value: 'nfts',
    status: false,
    icon: NftFilterIcon,
    inactiveIcon: NftFilterInactiveIcon,
  },
]

export const statusFilterBtn: Array<ButtonProps> = [
  {
    key: 'pending',
    value: 'sortPicker.pending',
    status: false,
    icon: PendingFilterIcon,
    inactiveIcon: PendingFilterIcon,
  },
  {
    key: 'completed',
    value: 'sortPicker.completed',
    status: false,
    icon: CompletedFilterIcon,
    inactiveIcon: CompletedFilterIcon,
  },
  {
    key: 'cancelled',
    value: 'sortPicker.canceled',
    status: false,
    icon: CancelledFilterIcon,
    inactiveIcon: CancelledFilterIcon,
  },
]
