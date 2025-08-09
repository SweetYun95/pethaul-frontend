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

      const { categoryId = '', sellCategory = '' } = data
      const response = await shopmaxApi.get(`item?&categoryId=${categoryId}&sellCategory=${sellCategory}`)

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
