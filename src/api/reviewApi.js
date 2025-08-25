import shopmaxApi from './axiosApi'

// 리뷰 등록
export const createReview = async (formData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await shopmaxApi.post('/review', formData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 리뷰 수정
export const updateReview = async (formData, id) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }
      const response = await shopmaxApi.put(`/review/edit/${id}`, formData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//리뷰 삭제
export const deleteReview = async (id) => {
   try {
      const response = await shopmaxApi.delete(`review/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 회원이 작성한 리뷰 목록 조회
export const getUserReview = async (opts = {}) => {
   try {
      const { page, limit } = opts
      const params = {}
      if (page != null) params.page = page
      if (limit != null) params.limit = limit
      const response = await shopmaxApi.get(`/review`, {
         params,
      })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
