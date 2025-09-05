import petHaulApi from './axiosApi'

// 장바구니 전체 조회
export const getCartItems = async (id) => {
   try {
      const response = await petHaulApi.get(`/cart/${id}`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 장바구니에 상품 추가
export const addToCart = async ({ itemId, count }) => {
   try {
      const response = await petHaulApi.post('/cart/add', { itemId, count }, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 장바구니 수량 수정
export const updateCartItem = async ({ itemId, count }) => {
   try {
      const response = await petHaulApi.put(`/cart/update/${itemId}`, { count }, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 장바구니 상품 삭제
export const deleteCartItem = async (itemId) => {
   try {
      const response = await petHaulApi.delete(`/cart/delete/${itemId}`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
