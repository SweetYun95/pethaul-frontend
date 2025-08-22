// src/api/contentApi.js
import shopmaxApi from './axiosApi'

// 목록 조회 (페이지네이션)
export const fetchContentsApi = async ({ page = 1, size = 10, tag, q } = {}) => {
  const params = { page, size }
  if (tag) params.tag = tag
  if (q) params.q = q
  const { data } = await shopmaxApi.get('/contents', { params })
  return data // { list, page, size, total, hasMore }
}

// 단건 조회
export const fetchContentByIdApi = async (id) => {
  const { data } = await shopmaxApi.get(`/contents/${id}`)
  return data
}

// 생성 (관리자 전용)
export const createContentApi = async (payload) => {
  const { data } = await shopmaxApi.post('/contents', payload)
  return data
}

// 수정 (관리자 전용)
export const updateContentApi = async (id, payload) => {
  const { data } = await shopmaxApi.put(`/contents/${id}`, payload)
  return data
}

// 삭제 (관리자 전용)
export const deleteContentApi = async (id) => {
  const { data } = await shopmaxApi.delete(`/contents/${id}`)
  return data
}

// 이미지 업로드 (선택)
export const uploadContentImageApi = async (file) => {
  const form = new FormData()
  form.append('image', file)
  const { data } = await shopmaxApi.post('/contents/images', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data 
}
