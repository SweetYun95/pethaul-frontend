import axios from 'axios'
import shopmaxApi from './axiosApi'

const BASE_URL = import.meta.env.VITE_APP_PYTHON_API_URL

const recommendApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json', // request, response 할때 json 객체로 주고 받겠다
   },
   withCredentials: true, // 세션이나 쿠키를 request에 포함
})

// 좋아요한 상품 목록을 기준으로 상품 추천
export const recommendLikes = async (userId) => {
   const response = await recommendApi.get(`/recommend`, {
      params: { user_id: userId },
   })

   const recommendData = response.data
   if (!recommendData || recommendData.length === 0) {
      const error = new Error('추천할 상품이 존재하지 않습니다.')
      error.status = 204
      throw error
   }
   const responseFin = await shopmaxApi.post('/item/recommend', { items: recommendData.map((r) => r.item) })

   return responseFin.data
}
