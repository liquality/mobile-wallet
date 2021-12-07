import {
  configureStore,
  Middleware,
  MiddlewareArray,
  PayloadAction,
} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { Alert } from 'react-native'
import rootReducer from '../reducers'
import StorageManager from '../core/storage-manager'
import EncryptionManager from '../core/encryption-manager'
import { SendOptions, Transaction } from '@liquality/types'
import Wallet from '@liquality/core/dist/wallet'
import { Config } from '@liquality/core/dist/config'
import { AccountType, NetworkEnum, StateType } from '@liquality/core/dist/types'
import { ChainId } from '@liquality/cryptoassets'
import { INFURA_API_KEY } from '@env'

const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
const encryptionManager = new EncryptionManager()
const config = new Config(INFURA_API_KEY)
const wallet = new Wallet(storageManager, encryptionManager, config)

const persistenceMiddleware: Middleware<
  (action: PayloadAction<StateType>) => StateType,
  StateType
> = ({ getState }) => {
  return (next) => (action) => {
    storageManager.write({
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

export const isNewInstallation = async (): Promise<boolean> => {
  try {
    const state = await wallet.restore()
    store.dispatch({ type: 'INIT_STORE', payload: state })
  } catch (e) {
    store.dispatch({ type: 'INIT_STORE', payload: {} })
  }
  return await wallet.isNewInstallation()
}

//TODO Use slices and async thunks instead
export const createWallet =
  (password: string, mnemonic: string) => async (dispatch: any) => {
    try {
      const walletState = await wallet.build(password, mnemonic, false)
      await wallet.store(walletState)
      return dispatch({
        type: 'SETUP_WALLET',
        payload: walletState,
      })
    } catch (error: any) {
      Alert.alert('Unable to create wallet. Try again!')
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
      const walletState: StateType = await wallet.restore(password)
      const { activeNetwork, activeWalletId } = walletState
      if (activeWalletId && activeNetwork) {
        wallet.subscribe((account: AccountType) => {
          if (walletState.accounts) {
            walletState.accounts[activeWalletId!][activeNetwork!] = [account]
          }
          Object.assign(walletState.fiatRates, account.fiatRates)

          if (
            walletState.fees?.[activeNetwork]?.[activeWalletId] &&
            account.feeDetails
          ) {
            walletState.fees[activeNetwork][activeWalletId][account.chain] =
              account.feeDetails
          }
        })
      }

      await wallet.refresh()
      //TODO Refresh balances, fees, and fiat rates
      return dispatch({
        type: 'RESTORE_WALLET',
        payload: {
          ...walletState,
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

export const sendTransaction = async (
  options: SendOptions,
): Promise<Transaction | Error> => {
  try {
    const { data, value, to } = options
    const account = await wallet.getAccount(
      ChainId.Ethereum,
      NetworkEnum.Testnet,
    )
    const assets = await account.getAssets()
    return await assets[0].transmit(value, to, data)
  } catch (e) {
    return new Error('Failed to send transaction')
  }
}

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>
