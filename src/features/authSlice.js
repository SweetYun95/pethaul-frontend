import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser, checkAuthStatus, googleLoginUser, googleCheckStatus } from '../api/authApi'

// ✅ 구글 로그인(DB 저장 전용)
export const googleLoginUserThunk = createAsyncThunk('auth/googleLoginUser', async (googleData, { rejectWithValue }) => {
   try {
      const response = await googleLoginUser(googleData)
      return response.data.user // 구글 로그인 후 사용자 정보를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '구글 로그인 실패')
   }
})

// ✅ 구글 로그인 상태 확인
export const googleCheckStatusThunk = createAsyncThunk('auth/googleCheckStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await googleCheckStatus()
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '구글 로그인 상태 확인 실패')
   }
})

// 회원가입
export const registerUserThunk = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await registerUser(userData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그인
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginUser(credentials)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그아웃
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutUser()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 로그인 상태 확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      user: null,
      isAuthenticated: false,
      googleAuthenticated: false, // 구글 로그인 상태 추가
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 회원가입
         .addCase(registerUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
         })
         .addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 일반 로그인
         .addCase(loginUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
         })
         .addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 구글 로그인
         .addCase(googleLoginUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(googleLoginUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
            state.googleAuthenticated = true
         })
         .addCase(googleLoginUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 로그아웃
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutUserThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.googleAuthenticated = false // 구글 로그인 상태 초기화
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 구글 로그인 상태 확인
         .addCase(googleCheckStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(googleCheckStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = action.payload.googleAuthenticated
            state.user = action.payload.user || null
            state.googleAuthenticated = action.payload.googleAuthenticated // 구글 인증 상태 업데이트
         })
         .addCase(googleCheckStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.user = null
            state.googleAuthenticated = false
         })
   },
})

export default authSlice.reducer
