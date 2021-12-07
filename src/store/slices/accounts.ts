import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountType } from '../../core/types'
import { RootState } from '../store'

const initialState: AccountType[] = []

export const AccountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updateAccounts: (state, action: PayloadAction<AccountType>) => {
      const { name } = action.payload
      state.map((account) => {
        if (account.name === name) {
          return Object.assign(account, action.payload)
        } else {
          return account
        }
      })
    },
  },
})

export const { updateAccounts } = AccountSlice.actions
export const updateAccountsAsync = (account: AccountType) => (dispatch) => {
  setTimeout(() => {
    dispatch(updateAccounts(account))
  }, 1000)
}
export const selectAccount = (state: RootState) => state.accounts
export default AccountSlice.reducer
