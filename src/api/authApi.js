// src/api/authApi.js
import shopmaxApi from './axiosApi'

// .env에 등록된 백엔드 주소 사용
const BASE_API_URL = import.meta.env.VITE_APP_API_URL

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await shopmaxApi.post('/auth/join', userData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await shopmaxApi.post('/auth/login', credentials)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      const response = await shopmaxApi.post('/auth/logout', {}, { withCredentials: true })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await shopmaxApi.get('/auth/check')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 아이디 중복 확인
export const checkUsername = async (userId) => {
   try {
      const response = await shopmaxApi.post('/auth/check-username', { userId })
      console.log('아이디 중복 확인 response', response)
      return response
   } catch (error) {
      console.error(`아이디 중복 확인 오류: ${error}`)
      throw error
   }
}

// 구글 로그인 리다이렉트
export const redirectToGoogleLogin = () => {
   window.location.href = `${BASE_API_URL}/auth/google`
}

// 구글 로그인(DB 저장용 요청 함수)
export const googleLoginUser = async (googleData) => {
   try {
      const response = await shopmaxApi.post('/auth/google/callback', googleData)
      return response
   } catch (error) {
      console.error(`구글 로그인 API 오류: ${error}`)
      throw error
   }
}

// 구글 로그인 상태 확인
export const googleCheckStatus = async () => {
   try {
      const response = await shopmaxApi.get('/auth/googlecheck')
      return response.data
   } catch (error) {
      console.error(`구글 로그인 상태 확인 오류: ${error}`)
      throw error
   }
}

// 핸드폰 번호로 id 찾기 (로컬 회원)
export const findId = async (phoneNumber) => {
   try {
      const response = await shopmaxApi.post('/auth/findid', { phoneNumber })
      return response
   } catch (error) {
      console.error(`ID 조회 중 오류: ${error}`)
      throw error
   }
}

// 임시 비밀번호 발급 (로컬 회원)
export const updatePassword = async ({ userId, phoneNumber }) => {
   try {
      const response = await shopmaxApi.post('/auth/updatepw', { userId, phoneNumber })
      return response
   } catch (error) {
      console.error(`임시 비밀번호 발급 중 오류: ${error}`)
      throw error
   }
}
