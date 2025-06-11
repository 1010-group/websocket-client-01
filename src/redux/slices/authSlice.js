// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    updateUserStatus: (state, action) => {
      if (state.user) {
        state.user.status = action.payload;
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, logout, updateUserStatus } = authSlice.actions
export default authSlice.reducer
