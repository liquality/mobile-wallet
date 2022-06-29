import { PayloadAction, Reducer } from '@reduxjs/toolkit'
import { RootState } from '@liquality/wallet-core/dist/store/types'
import produce from 'immer'
import { Asset, FiatRates } from '@liquality/wallet-core/src/store/types'
import { AccountType } from '../types'

export interface CustomRootState extends RootState {
  digestedState?: {
    totalFiatBalance: number
    accounts: Record<Asset, AccountType>
    fiatRates: FiatRates
  }
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
        ...action.payload,
        accounts: action.payload.accounts,
      }
    case 'UPDATE_DIGESTED_STATE':
      return {
        ...action.payload,
        digestedState: {
          accounts: {
            ...(state?.digestedState?.accounts || {}),
            ...action.payload.digestedState?.accounts,
          },
        },
      }
    case 'INIT_STORE':
      return {
        ...action.payload,
      }
    case 'SETUP_WALLET':
      return {
        ...action.payload,
      }
    case 'RESTORE_WALLET':
      return {
        ...state,
        ...action.payload,
      }
    case 'UPDATE_FIAT_RATES':
      return produce(state, (draft) => {
        if (draft?.digestedState)
          draft.digestedState.fiatRates = action.payload.fiatRates
      })
    // return {
    //   ...action.payload,
    //   digestedState: {
    //     accounts: {
    //       ...(state?.digestedState?.accounts || {}),
    //       ...action.payload.digestedState?.accounts,
    //     },
    //   },
    // }
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
