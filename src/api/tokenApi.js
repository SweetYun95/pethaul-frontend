import shopmaxApi from './axiosApi'

// 토큰 발급
export const getToken = async () => {
   try {
      const response = await shopmaxApi.get('/token/get')

      console.log('💾[tokenSlice] tokenApi response:', response)

      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 토큰 조회
export const readToken = async () => {
   try {
      const response = await shopmaxApi.get('/token/read')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 토큰 재발급
export const refreshToken = async () => {
   try {
      const response = await shopmaxApi.get('/token/refresh')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 토큰 상태 확인
export const checkTokenStatus = async () => {
   try {
      const response = await shopmaxApi.get('/token/checkTokenStatus')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
