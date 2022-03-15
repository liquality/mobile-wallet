import { PayloadAction, Reducer } from '@reduxjs/toolkit'

const rootReducer: Reducer<any, PayloadAction<any>> = (state, action): any => {
  switch (action.type) {
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: {},
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
    case 'UPDATE_MARKET_DATA':
      const marketData = action.payload.marketData || []
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
    case 'TRANSACTION_UPDATE':
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
