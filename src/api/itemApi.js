// src/api/itemApi.js
import shopmaxApi from './axiosApi'

// 상품 등록 (FormData 사용)
export const createItem = async (formData) => {
   try {
      const response = await shopmaxApi.post('/item', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 상품 수정 (FormData 사용)
export const updateItem = async (id, formData) => {
   try {
      const response = await shopmaxApi.put(`/item/${id}`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 상품 삭제
export const deleteItem = async (id) => {
   try {
      const response = await shopmaxApi.delete(`/item/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류:${error}`)
      throw error
   }
}

// 전체 상품 리스트 가져오기
export const getItems = async (data) => {
   try {
      const { page, limit, searchTerm = '', sellCategory = [] } = data
      const activeCategories = Array.isArray(sellCategory) ? sellCategory.filter(Boolean) : sellCategory ? [sellCategory] : []
      const response = await shopmaxApi.get('item', {
         params: {
            page,
            limit,
            searchTerm,
            sellCategory: activeCategories,
         },
      })
      console.log('🎀activeCategories:', activeCategories)
      // console.log('🎀response:', response)
      return response
   } catch (error) {
      console.error(`API Request 오류:${error}`)
      throw error
   }
}

// 특정 상품 가져오기
export const getItemById = async (id) => {
   try {
      const response = await shopmaxApi.get(`/item/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류:${error}`)
      throw error
   }
}

// // 조건별 데이터 조회 (회원용)
// export const fetchSortData = async (limit) => {
//    try {
//       const response = await shopmaxApi.get(`/item/all/main?limit=${limit}`)
//       return response
//    } catch (error) {
//       console.error(`API Request 오류: ${error}`)
//       throw error
//    }
// }

// 조건별 데이터 조회 (회원용)
export const fetchSortData = async (limit) => {
   try {
      // ⬇️ 기존: GET /item/main?size=5 -> 404
      // ⬇️ 수정: 서버 라우트에 맞춰 경로/파라미터 교정
      const response = await shopmaxApi.get('/item/all/main', {
         params: { limit }, // 서버가 limit로 받음
      })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
