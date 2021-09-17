import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import rootReducer from './reducers'
import StorageManager from './core/storageManager'
import { StateType } from './core/types'

const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)

const persistenceMiddleware: Middleware<
  (action: PayloadAction<StateType>) => StateType,
  StateType
> = ({ getState }) => {
  return (next) => (action) => {
    storageManager.persist({
      ...getState(),
      ...action.payload,
    })
    return next(action)
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {},
  middleware: new MiddlewareArray().concat(persistenceMiddleware),
})

export const hydrateStore = (): Promise<StateType> => {
  return storageManager
    .read()
    .then((state) => {
      store.dispatch({ type: 'INIT_STORE', payload: state })
      return state
    })
    .catch(() => {
      store.dispatch({ type: 'INIT_STORE', payload: {} })
      return {}
    })
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
