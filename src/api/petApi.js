import shopmaxApi from './axiosApi'


//유저 별 펫 조회
export const getUserPets = async (userId) => {
   try {
      const response = await shopmaxApi.get(`/users/${userId}/pets`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 펫 등록 (이미지 포함)
export const createPet = async (formData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await shopmaxApi.post('/pets', formData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 펫 수정
export const updatePet = async (id, formData) => {
   try {
      const response = await shopmaxApi.put(`/pets/${id}`, formData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 펫 삭제
export const deletePet = async (id) => {
   try {
      const response = await shopmaxApi.delete(`/pets/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}