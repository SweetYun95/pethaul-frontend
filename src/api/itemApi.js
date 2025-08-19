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
      const { searchTerm = '', sellCategory = [] } = data
      const activeCategories = Array.isArray(sellCategory) ? sellCategory.filter(Boolean) : sellCategory ? [sellCategory] : []
      const response = await shopmaxApi.get('item', {
         params: {
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
    const response = await shopmaxApi.get(`/item/main`, {
      params: { size: limit },   // 서버에서 size로 받는 경우
    })
    return response
  } catch (error) {
    console.error(`API Request 오류: ${error}`)
    throw error
  }
}
