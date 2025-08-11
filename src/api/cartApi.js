import shopmaxApi from './axiosApi'

// 장바구니 전체 조회
export const getCartItems = async (id) => {
   const res = await shopmaxApi.get(`/cart/${id}`, {
      withCredentials: true,
   })
   console.log('res:', res)
   return res.data
}

// 장바구니에 상품 추가
export const addToCart = async ({ itemId, count }) => {
   const res = await shopmaxApi.post('/cart/add', { itemId, count }, { withCredentials: true })
   return res.data
}

// 장바구니 수량 수정
export const updateCartItem = async ({ itemId, count }) => {
   const res = await shopmaxApi.put(`/cart/update/${itemId}`, { count }, { withCredentials: true })
   return res.data
}

// 장바구니 상품 삭제
export const deleteCartItem = async (itemId) => {
   const res = await shopmaxApi.delete(`/cart/delete/${itemId}`, {
      withCredentials: true,
   })
   console.log('res:', res)
   return res.data
}
