import { StateType } from '../core/types'
import { PayloadAction, Reducer } from '@reduxjs/toolkit'

const rootReducer: Reducer<StateType, PayloadAction<StateType>> = (
  state,
  action,
): StateType => {
  switch (action.type) {
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
    default:
      return {
        ...state,
      }
  }
}

export default rootReducer
