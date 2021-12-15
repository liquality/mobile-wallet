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
import { AccountType, StateType } from '@liquality/core/dist/types'
import { ChainId } from '@liquality/cryptoassets'
import { INFURA_API_KEY } from '@env'
import { NetworkEnum } from '../core/types'

const excludedProps: Array<keyof StateType> = ['key', 'wallets', 'unlockedAt']
const storageManager = new StorageManager('@liquality-storage', excludedProps)
const encryptionManager = new EncryptionManager()
const config = new Config(INFURA_API_KEY)
const wallet = new Wallet(storageManager, encryptionManager, config)
wallet.subscribe((account: AccountType) => {
  const walletState = store.getState()
  const { activeWalletId, activeNetwork } = walletState

  if (activeWalletId && activeNetwork) {
    const existingAccounts: AccountType[] =
      walletState?.accounts?.[activeWalletId][activeNetwork] || []

    if (walletState.accounts) {
      if (existingAccounts.length === 0) {
        walletState.accounts[activeWalletId][activeNetwork] = [account]
      } else {
        const index = existingAccounts.findIndex(
          (item) => item.name === account.name,
        )
        if (index >= 0) {
          walletState.accounts[activeWalletId][activeNetwork][index] = account
        } else {
          walletState.accounts[activeWalletId][activeNetwork]?.push(account)
        }
      }
    }

    Object.assign(walletState.fiatRates, account.fiatRates)

    if (walletState.fees && account.feeDetails) {
      walletState.fees[activeNetwork][activeWalletId][account.chain] =
        account.feeDetails
    }

    store.dispatch({
      type: 'UPDATE_WALLET',
      payload: walletState,
    })
  }
})

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
export const createWallet = async (
  password: string,
  mnemonic: string,
): Promise<StateType> => {
  return await wallet.init(password, mnemonic, false)
}

export const populateWallet = () => async (dispatch: any) => {
  try {
    await wallet.addAccounts(
      store.getState().activeNetwork || NetworkEnum.Mainnet,
    )
    await wallet.store(store.getState())
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
export const restoreWallet = async (password: string): Promise<StateType> => {
  return await wallet.restore(password)
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
