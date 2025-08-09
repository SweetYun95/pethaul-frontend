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
   // 배포 시에는 BASE_API_URL을 환경변수로 자동 적용하므로 별도 수정 불필요
}

// 구글 로그인(DB 저장용 요청 함수) - 나중에 백엔드에 POST 요청 필요 시 사용
export const googleLoginUser = async (googleData) => {
   try {
      const response = await shopmaxApi.post('/auth/google/callback', googleData)
      return response
   } catch (error) {
      console.error(`구글 로그인 API 오류: ${error}`)
      throw error
   }
}