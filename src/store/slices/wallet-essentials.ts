import { createSlice } from '@reduxjs/toolkit'
import { StateType } from '@liquality/core/dist/types'

export const initializeState = createSlice({
  name: 'wallet',
  reducers: {
    init: (state: StateType) => {
      state.version = 1
    },
  },
})
