// =============================
// File: src/features/authSlice.js
// =============================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { registerUser, loginUser, logoutUser, checkAuthStatus, googleLoginUser, googleCheckStatus, findId, updatePassword, updateMyInfo } from '../api/authApi'

// -----------------------------
// helpers
// -----------------------------
const normalizeAuthPayload = (raw) => {
   // 허용 형태: axios res, res.data, 혹은 이미 얕은 객체
   const p = raw?.data ?? raw ?? {}
   const hasLocal = typeof p.isAuthenticated === 'boolean'
   const hasGoogle = typeof p.googleAuthenticated === 'boolean'

   let user = p.user ?? null
   let isAuthenticated = false
   let googleAuthenticated = false

   if (hasLocal) {
      isAuthenticated = !!p.isAuthenticated
   }
   if (hasGoogle) {
      googleAuthenticated = !!p.googleAuthenticated
      // 구글 응답이 사용자 정보를 동봉할 수도 있음
      if (!user && p.user) user = p.user
   }

   return {
      user,
      isAuthenticated: isAuthenticated || googleAuthenticated,
      googleAuthenticated,
   }
}

// -----------------------------
// Thunks: 기존 유지 (API 래퍼)
// -----------------------------
// 구글 로그인(DB 저장 전용)
export const googleLoginUserThunk = createAsyncThunk('auth/googleLoginUser', async (googleData, { rejectWithValue }) => {
   try {
      const response = await googleLoginUser(googleData)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '구글 로그인 실패')
   }
})

// 구글 로그인 상태 확인
export const googleCheckStatusThunk = createAsyncThunk('auth/googleCheckStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await googleCheckStatus()
      return response // 백엔드가 data를 감싸든 말든 normalize에서 처리
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
      return rejectWithValue(error.response?.data?.message || '회원가입 실패')
   }
})

// 로그인
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginUser(credentials)
      return response.data.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// 로그아웃
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutUser()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

// 로그인 상태 확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 상태 확인 실패')
   }
})

// 아이디 찾기 (로컬 회원)
export const findIdThunk = createAsyncThunk('auth/findId', async (phoneNumber, { rejectWithValue }) => {
   try {
      const response = await findId(phoneNumber)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원 정보 확인 실패')
   }
})

// 임시 비밀번호 발급 (로컬 회원)
export const updatePasswordThunk = createAsyncThunk('auth/updatePassword', async ({ userId, phoneNumber }, { rejectWithValue }) => {
   try {
      const response = await updatePassword({ userId, phoneNumber })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원 정보 확인 실패')
   }
})

// 회원 정보 수정
export const updateMyInfoThunk = createAsyncThunk('auth/updateMyInfo', async (data, { rejectWithValue }) => {
   try {
      console.log('🎀수정 데이터: ', data)
      const response = await updateMyInfo(data)
      console.log('🎀수정 데이터 확인: ', response.data)

      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '회원 정보 수정 실패')
   }
})

// -----------------------------
// ✅ 통합 상태 점검(레이스 방지)
// -----------------------------
export const checkUnifiedAuthThunk = createAsyncThunk('auth/checkUnified', async (_, { dispatch }) => {
   const [localRes, googleRes] = await Promise.allSettled([dispatch(checkAuthStatusThunk()).unwrap(), dispatch(googleCheckStatusThunk()).unwrap()])

   const localOk = localRes.status === 'fulfilled' ? normalizeAuthPayload(localRes.value) : null
   const googleOk = googleRes.status === 'fulfilled' ? normalizeAuthPayload(googleRes.value) : null

   // 우선순위: 인증 true인 결과들 중 사용자 정보가 있는 쪽 우선
   const candidates = [localOk, googleOk].filter(Boolean)
   const authed = candidates.filter((c) => c.isAuthenticated)

   if (authed.length > 0) {
      authed.sort((a, b) => (b.user ? 1 : 0) - (a.user ? 1 : 0))
      return { ...authed[0], uncertain: false }
   }

   // 둘 다 실패 혹은 둘 다 비로그인
   // 네트워크 불안정 같은 경우를 위해 불확실 플래그 제공
   const anyRejected = localRes.status === 'rejected' || googleRes.status === 'rejected'
   return { user: null, isAuthenticated: false, googleAuthenticated: false, uncertain: anyRejected }
})

// -----------------------------
// Slice
// -----------------------------
const authSlice = createSlice({
   name: 'auth',
   initialState: {
      user: null,
      ids: [],
      isAuthenticated: false,
      googleAuthenticated: false,
      loading: false,
      error: null,
   },
   reducers: {
      resetFindId(state) {
         state.ids = []
      },
   },
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

         // 로그아웃 — 명시적일 때만 비인증 처리
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutUserThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.googleAuthenticated = false
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // ⚠️ 개별 체크(rejected)에서 즉시 false로 돌리지 않음 — 통합 썽크가 최종판단
         .addCase(googleCheckStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(googleCheckStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            const norm = normalizeAuthPayload(action.payload)
            // 통합 체크가 없다면 단독으로도 합리적으로 동작
            state.isAuthenticated = norm.isAuthenticated
            state.user = norm.user
            state.googleAuthenticated = norm.googleAuthenticated
         })
         .addCase(googleCheckStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            // 여기서 상태를 강제로 false로 만들지 않는다
         })

         .addCase(checkAuthStatusThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            const norm = normalizeAuthPayload(action.payload)
            state.isAuthenticated = norm.isAuthenticated
            state.user = norm.user
         })
         .addCase(checkAuthStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            // 여기서도 강제 false 처리 금지
         })

         // ✅ 통합 체크 — 최종 판단자
         .addCase(checkUnifiedAuthThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(checkUnifiedAuthThunk.fulfilled, (state, action) => {
            state.loading = false
            const { user, isAuthenticated, googleAuthenticated, uncertain } = action.payload
            if (uncertain && state.isAuthenticated) {
               // 네트워크 등 불확실 상황에서는 기존 true 상태를 보존
               return
            }
            state.isAuthenticated = isAuthenticated
            state.user = user
            state.googleAuthenticated = !!googleAuthenticated
         })
         // 아이디 찾기
         .addCase(findIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(findIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.ids = action.payload.ids
         })
         .addCase(findIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 회원 정보 수정
         .addCase(updateMyInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateMyInfoThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
         })
         .addCase(updateMyInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})
export const { resetFindId } = authSlice.actions
export default authSlice.reducer
