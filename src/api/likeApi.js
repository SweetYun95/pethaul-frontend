import shopmaxApi from './axiosApi'

/**
 * 내가 좋아요한 상품의 'id' 목록
 * GET /likes/ids
 * 응답 예: { itemIds: number[] }
 */
export const getMyLikeIds = async () => {
   try {
      const response = await shopmaxApi.get('/like/ids')
      return response // 사용처에서 response.data.itemIds
   } catch (error) {
      console.error(`[likeApi] getMyLikeIds 오류: ${error}`)
      throw error
   }
}

/**
 * 내가 좋아요한 '상품 상세' 목록 (카드 렌더용)
 * GET /likes/me
 * 응답 예: { items: Array<Item> }
 */
export const getMyLikedItems = async () => {
   try {
      const response = await shopmaxApi.get('/like/me')
      return response // 사용처에서 response.data.items
   } catch (error) {
      console.error(`[likeApi] getMyLikedItems 오류: ${error}`)
      throw error
   }
}

/**
 * 좋아요 토글 (있으면 삭제, 없으면 추가)
 * POST /likes/:itemId
 * 응답 예: { success: true, liked: boolean }
 */
export const toggleLike = async (itemId) => {
   try {
      const response = await shopmaxApi.post(`/like/${itemId}`)
      return response // 사용처에서 response.data.liked
   } catch (error) {
      console.error(`[likeApi] toggleLike 오류(itemId=${itemId}): ${error}`)
      throw error
   }
}
