// src/api/axios.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL
const AUTH_KEY = import.meta.env.VITE_APP_AUTH_KEY

//axios 인스턴스 생성
const shopmaxApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
      Authorization: AUTH_KEY,
   },
   withCredentials: true,
})

// 토큰 요청 인터셉터 추가
shopmaxApi.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token')
      if (token) {
         config.headers.Authorization = token
      }
      return config
   },
   (error) => Promise.reject(error)
)

export default shopmaxApi
