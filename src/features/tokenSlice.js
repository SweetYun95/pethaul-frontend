import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { checkTokenStatus, getToken, readToken, refreshToken } from '../api/tokenApi'
import { getTokenErrorMessage } from '../utils/getTokenErrorMessage'

// 토큰 발급
export const getTokenThunk = createAsyncThunk('token/getToken', async (_, { rejectWithValue }) => {
   try {
      const response = await getToken()

      return response.data.token
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '토큰 발급 실패')
   }
})

// 토큰 조회
export const readTokenThunk = createAsyncThunk('token/readToken', async (_, { rejectWithValue }) => {
   try {
      const response = await readToken()
      const token = response.data.token
      localStorage.setItem('token', token)
      return token
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '토큰 조회 실패')
   }
})

// 토큰 재발급
export const refreshTokenThunk = createAsyncThunk('token/refreshToken', async (_, { rejectWithValue }) => {
   try {
      const response = await refreshToken()
      return response.data.token
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '토큰 재발급 실패')
   }
})

// 토큰 상태 확인
export const checkTokenStatusThunk = createAsyncThunk('token/checkTokenStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkTokenStatus()
      return 'valid'
   } catch (error) {
      if (error.response?.status === 419) return rejectWithValue('expired')
      if (error.response?.status === 401) return rejectWithValue('invalid')
      return rejectWithValue('unknown')
   }
})

const tokenSlice = createSlice({
   name: 'token',
   initialState: {
      token: null,
      loading: false,
      error: null,
      tokenStatus: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 토큰 발급
         .addCase(getTokenThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getTokenThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload
         })
         .addCase(getTokenThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         //토큰 조회
         .addCase(readTokenThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(readTokenThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload
         })
         .addCase(readTokenThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 토큰 재발급
         .addCase(refreshTokenThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(refreshTokenThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload
         })
         .addCase(refreshTokenThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         //토큰 상태 확인
         .addCase(checkTokenStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkTokenStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.tokenStatus = action.payload
         })
         .addCase(checkTokenStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = getTokenErrorMessage(action.payload)
            state.tokenStatus = action.payload
         })
   },
})

export default tokenSlice.reducer
