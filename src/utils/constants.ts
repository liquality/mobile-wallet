import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'
import { SvgProps } from 'react-native-svg'
import { AppIcons } from '../assets'
import { SortFunctionKeyType } from '../custom-hooks/use-filtered-history'
import { TxKeyPath } from '../i18n'
import { ActionEnum, ActivityStatusEnum } from '../types'

export const COPY_BUTTON_TIMEOUT = 2000
export const FADE_IN_OUT_DURATION = 400
export const GRADIENT_BACKGROUND_HEIGHT = scale(200)
export const LARGE_TITLE_HEADER_HEIGHT = scale(81)
export const RECEIVE_HEADER_HEIGHT = scale(160)
export const ICON_SIZE = scale(23)
export const ONBOARDING_PADDING = 36
export const DRAWER_PADDING = 32
export const SCREEN_PADDING = 40
export const SCREEN_WIDTH = Dimensions.get('screen').width
export const SCREEN_HEIGHT = Dimensions.get('screen').height
export const INPUT_OPACITY_INACTIVE = 0.6
export const CONGRATULATIONS_MESSAGE_MARGIN_TOP = 300
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
  ReceiveIcon,
  RefundedFilterIcon,
  NeedsAttentionFilterIcon,
  FailedFilterIcon,
} = AppIcons

type IconType = React.FC<
  SvgProps & {
    fillSecondary?: string | undefined
  }
>

export type ButtonProps = {
  key: ActivityStatusEnum | ActionEnum
  value: TxKeyPath
  status: boolean
  icon: IconType
  inactiveIcon: IconType
}

export const transFilterBtns: Array<ButtonProps> = [
  {
    key: ActionEnum.SEND,
    value: 'assetScreen.send',
    status: false,
    icon: SendFilterIcon,
    inactiveIcon: SendFilterIcon,
  },
  {
    key: ActionEnum.SWAP,
    value: 'assetScreen.swap',
    status: false,
    icon: SwapFilterIcon,
    inactiveIcon: SwapFilterIcon,
  },
  // advanced attributes
  {
    key: ActionEnum.NFT,
    value: 'nfts',
    status: false,
    icon: NftFilterIcon,
    inactiveIcon: NftFilterInactiveIcon,
  },
  {
    key: ActionEnum.RECEIVE,
    value: 'assetScreen.receive',
    status: false,
    icon: ReceiveIcon,
    inactiveIcon: ReceiveIcon,
  },
]

export const statusFilterBtn: Array<ButtonProps> = [
  {
    key: ActivityStatusEnum.PENDING,
    value: 'sortPicker.pending',
    status: false,
    icon: PendingFilterIcon,
    inactiveIcon: PendingFilterIcon,
  },
  {
    key: ActivityStatusEnum.COMPLETED,
    value: 'sortPicker.completed',
    status: false,
    icon: CompletedFilterIcon,
    inactiveIcon: CompletedFilterIcon,
  },
  {
    key: ActivityStatusEnum.CANCELLED,
    value: 'sortPicker.canceled',
    status: false,
    icon: CancelledFilterIcon,
    inactiveIcon: CancelledFilterIcon,
  },
  {
    key: ActivityStatusEnum.REFUNDED,
    value: 'sortPicker.refunded',
    status: false,
    icon: RefundedFilterIcon,
    inactiveIcon: RefundedFilterIcon,
  },
  {
    key: ActivityStatusEnum.NEEDS_ATTENTION,
    value: 'needsAttention',
    status: false,
    icon: NeedsAttentionFilterIcon,
    inactiveIcon: NeedsAttentionFilterIcon,
  },
  {
    key: ActivityStatusEnum.FAILED,
    value: 'failed',
    status: false,
    icon: FailedFilterIcon,
    inactiveIcon: FailedFilterIcon,
  },
]

export type SortRadioButtonProp = {
  key: SortFunctionKeyType
  value: TxKeyPath
}

export const sortRadioButtons: Array<SortRadioButtonProp> = [
  {
    key: 'by_date',
    value: 'sortPicker.by_date',
  },
  {
    key: 'needs_attention',
    value: 'sortPicker.needs_attention',
  },
  {
    key: 'pending',
    value: 'sortPicker.pending',
  },
  {
    key: 'canceled',
    value: 'sortPicker.canceled',
  },
  {
    key: 'refunded',
    value: 'sortPicker.refunded',
  },
  {
    key: 'failed',
    value: 'sortPicker.failed',
  },
  {
    key: 'completed',
    value: 'sortPicker.completed',
  },
]
