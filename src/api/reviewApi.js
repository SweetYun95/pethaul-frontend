// src/api/reviewApi.js
import shopmaxApi from './axiosApi'

// 리뷰 등록
export const createReview = async (formData) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } }
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
    const config = { headers: { 'Content-Type': 'multipart/form-data' } }
    const response = await shopmaxApi.put(`/review/edit/${id}`, formData, config)
    return response
  } catch (error) {
    console.error(`API Request 오류: ${error}`)
    throw error
  }
}

// 리뷰 삭제
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
export const getUserReview = async () => {
  try {
    const response = await shopmaxApi.get(`/review`)
    return response
  } catch (error) {
    console.error(`API Request 오류: ${error}`)
    throw error
  }
}

// 최신 리뷰 목록 — /review만 사용
export const getLatestReviews = async (params = {}) => {
  try {
    const res = await shopmaxApi.get('/review', { params }) 
    const raw = res?.data

    // 응답 정규화
    let normalized = {
      list: [],
      page: params.page ?? 1,
      size: params.size ?? 0,
      total: 0,
      hasMore: false,
    }

    if (Array.isArray(raw)) {
      normalized.list = raw
      normalized.size = params.size ?? raw.length
      normalized.total = raw.length
    } else if (raw && typeof raw === 'object') {
      const list = raw.list ?? raw.reviews ?? raw.review ?? raw.data ?? raw.rows ?? []
      const page = raw.page ?? params.page ?? 1
      const size = raw.size ?? params.size ?? (Array.isArray(list) ? list.length : 0)
      const total = raw.total ?? raw.count ?? (Array.isArray(list) ? list.length : 0)
      const hasMore = typeof raw.hasMore === 'boolean' ? raw.hasMore : (page * size < total)
      normalized = { list, page, size, total, hasMore }
    }

    // 슬라이스에서 res.data를 기대하므로 { data } 형태로 반환
    return { data: normalized }
  } catch (error) {
    const status = error?.response?.status
    // 로그인 필요할 때(401/403) 메인화면이 죽지 않도록 빈 목록 반환
    if (status === 401 || status === 403) {
      return {
        data: {
          list: [],
          page: params.page ?? 1,
          size: params.size ?? 0,
          total: 0,
          hasMore: false,
        },
      }
    }
    console.error('API Request 오류:', error)
    throw error
  }
}
