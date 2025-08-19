import shopmaxApi from './axiosApi'

// 좋아요한 상품 목록 조회
export const getMyLikedItems = async () => {
   try {
      const response = await shopmaxApi.get('/like')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 좋아요 추가하기
export const addLikedItem = async (itemId) => {
   try {
      const response = await shopmaxApi.post(`/like/${itemId}`)
      console.log('🎈 좋아요 추가 response: ', response)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//좋아요 취소하기
export const deleteLikedItem = async (itemId) => {
   try {
      const response = await shopmaxApi.delete(`/like/${itemId}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
