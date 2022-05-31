import { PayloadAction, Reducer } from '@reduxjs/toolkit'
import { RootState } from '@liquality/wallet-core/dist/store/types'

export interface CustomRootState extends RootState {
  assetFilter?: {
    timeLimit?: string
    actionTypes?: string[]
    dateRange?: {
      start: string | undefined
      end: string | undefined
    }
    activityStatuses?: string[]
    assetToggles?: string[]
    sorter?: string | undefined
  }
}

//TODO clean up the unused cases
const rootReducer: Reducer<CustomRootState, PayloadAction<CustomRootState>> = (
  state,
  action,
): any => {
  switch (action.type) {
    case 'UPDATE_ACCOUNTS':
      return {
        ...state,
        accounts: action.payload.accounts,
      }
    case 'INIT_STORE':
      return {
        ...action.payload,
      }
    case 'SETUP_WALLET':
      return {
        ...state,
        ...action.payload,
      }
    case 'RESTORE_WALLET':
      return {
        ...state,
        ...action.payload,
      }
    case 'UPDATE_WALLET':
      return {
        ...state,
        ...action.payload,
      }
    case 'UPDATE_FIAT_RATES':
      return {
        ...state,
        fiatRates: action.payload.fiatRates,
      }
    case 'UPDATE_MARKET_DATA':
      const marketData = action.payload.marketData || {}
      return {
        ...state,
        marketData: [...marketData],
      }
    case 'NETWORK_UPDATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'ANALYTICS_UPDATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'DEFAULT_WALLET_UPDATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'ETHEREUM_CHAIN_UPDATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'NOTIFICATIONS_UPDATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'TOGGLE_ASSET':
      return {
        ...state,
        ...action.payload,
      }
    case 'NEW_TRANSACTION':
      return {
        ...state,
        history: action.payload.history,
      }
    case 'TRANSACTION_UPDATE':
      return {
        ...state,
        history: action.payload.history,
      }
    case 'UPDATE_ASSET_FILTER':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return {
        ...state,
      }
  }
}

export default rootReducer
