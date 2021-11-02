import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import StorageManager from './core/storage-manager'
import { AccountType, StateType } from './core/types'
import EncryptionManager from './core/encryption-manager'
import WalletManager from './core/wallet-manager'
import { SendOptions, Transaction } from '@liquality/types'

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

export const hydrateStore = async (): Promise<StateType> => {
  try {
    const state = await walletManager.retrieveWallet()
    store.dispatch({ type: 'INIT_STORE', payload: state })
    return state
  } catch (e) {
    store.dispatch({ type: 'INIT_STORE', payload: {} })
    return {}
  }
}

export const openSesame = async (
  wallet: Omit<StateType['wallets'], 'id' | 'at' | 'name'>,
  password: string,
): Promise<StateType> => {
  let newState = await walletManager.createWallet(wallet, password)
  newState = await walletManager.restoreWallet(password, newState)
  newState = await walletManager.updateAddressesAndBalances(newState)
  const { accounts, activeWalletId, activeNetwork } = newState

  const assets = accounts![activeWalletId!]?.[activeNetwork!]?.reduce(
    (assetNames: Array<string>, account: AccountType) => {
      assetNames.push(...Object.keys(account.balances || {}))
      return assetNames
    },
    [],
  )

  if (assets && assets.length > 0) {
    newState.fiatRates = await walletManager.getPricesForAssets(assets, 'usd')
  }

  return newState
}

export const createWallet =
  (
    wallet: Omit<StateType['wallets'], 'id' | 'at' | 'name'>,
    password: string,
  ) =>
  async (dispatch: any) => {
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

export const sendTransaction = async (
  options: SendOptions,
): Promise<Transaction | Error> => {
  try {
    return await walletManager.sendTransaction(options)
  } catch (e) {
    return new Error('Failed to send transaction')
  }
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
