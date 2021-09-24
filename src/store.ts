import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import StorageManager from './core/storageManager'
import { AccountType, StateType, WalletType } from './core/types'
import EncryptionManager from './core/encryptionManager'
import WalletManager from './core/walletManager'

const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
let encryptionManager = new EncryptionManager()
let walletManager = new WalletManager(storageManager, encryptionManager)

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
  middleware: new MiddlewareArray().concat([persistenceMiddleware, thunk]),
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

export const createWallet =
  (wallet: WalletType, password: string) => async (dispatch: any) => {
    const newState = await walletManager.createWallet(wallet, password)
    try {
      return dispatch({
        type: 'SETUP_WALLET',
        payload: newState,
      })
    } catch (error: any) {
      return dispatch({
        type: 'ERROR',
        payload: {
          errorMessage: 'Unable to create wallet. Try again!',
        } as StateType,
      })
    }
  }

/**
 * A dispatch action that restores/decrypts the wallet
 * @param password
 */
export const restoreWallet =
  (password: string) =>
  async (dispatch: any): Promise<any> => {
    try {
      const freshWallet: StateType = await walletManager.restoreWallet(
        password,
        store.getState(),
      )
      return dispatch({
        type: 'RESTORE_WALLET',
        payload: {
          ...freshWallet,
        },
      })
    } catch (error: any) {
      return dispatch({
        type: 'ERROR',
        payload: {
          errorMessage: error.message,
        } as StateType,
      })
    }
  }

export const updateAddressesAndBalances =
  () =>
  async (dispatch: AppDispatch, getState: () => StateType): Promise<any> => {
    const updatedState: StateType =
      await walletManager.updateAddressesAndBalances(getState())
    return dispatch({
      type: 'UPDATE_ADDRESSES_AND_BALANCES',
      payload: {
        ...getState(),
        ...updatedState,
      },
    })
  }

export const fetchFiatRatesForAssets =
  () => async (dispatch: any, getState: any) => {
    try {
      const { accounts, activeWalletId, activeNetwork } =
        getState() as StateType
      if (!accounts || !activeWalletId || !activeNetwork) {
        return dispatch({
          type: 'ERROR',
          payload: {
            errorMessage: 'Please import/create your wallet again',
          },
        })
      }

      const assets = accounts![activeWalletId!]?.[activeNetwork!]?.reduce(
        (assetNames: Array<string>, account: AccountType) => {
          assetNames.push(...Object.keys(account.balances || {}))
          return assetNames
        },
        [],
      )

      if (assets && assets.length > 0) {
        const fiatRates = await walletManager.getPricesForAssets(assets, 'usd')
        return dispatch({
          type: 'FIAT_RATES',
          payload: {
            fiatRates,
          },
        })
      }
    } catch (error) {
      return dispatch({
        type: 'ERROR',
        payload: {
          errorMessage: 'Failed to fetch fiat rates',
        },
      })
    }
  }

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
