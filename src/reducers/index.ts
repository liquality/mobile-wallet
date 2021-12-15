import { StateType } from '../core/types'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'

const rootReducer: Reducer<StateType, PayloadAction<StateType>> = (
  state,
  action,
): StateType => {
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
      const accounts = action.payload.accounts
      return {
        ...state,
        accounts: { ...accounts },
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
    default:
      return {
        ...state,
      }
  }
}

export default rootReducer
