// src/features/contentSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchContentsApi,
  fetchContentByIdApi,
  createContentApi,
  updateContentApi,
  deleteContentApi,
} from '../api/contentApi'

export const fetchContentsThunk = createAsyncThunk(
  'content/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchContentsApi(params)
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message)
    }
  },
)

export const fetchContentByIdThunk = createAsyncThunk(
  'content/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchContentByIdApi(id)
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message)
    }
  },
)

export const createContentThunk = createAsyncThunk(
  'content/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await createContentApi(payload)
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message)
    }
  },
)

export const updateContentThunk = createAsyncThunk(
  'content/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateContentApi(id, payload)
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message)
    }
  },
)

export const deleteContentThunk = createAsyncThunk(
  'content/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteContentApi(id)
      return id
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message)
    }
  },
)

const initialState = {
  list: [],
  page: 1,
  size: 10,
  total: 0,
  hasMore: true,
  hero: null,       // 상단 큰 1개
  current: null,    // 상세
  loading: false,
  error: null,
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    resetContentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 목록
      .addCase(fetchContentsThunk.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchContentsThunk.fulfilled, (s, { payload }) => {
        const { list, page, size, total, hasMore } = payload
        s.page = page
        s.size = size
        s.total = total
        s.hasMore = hasMore
        // 응답에서 isFeatured(혹은 featured) = true인 첫 항목을 hero로 잡기
        const idx = list.findIndex((p) => p.isFeatured)
        if (idx !== -1) {
          s.hero = list[idx]
          s.list = list.filter((_, i) => i !== idx)
        } else {
          // 없으면 맨 앞을 hero로
          s.hero = list[0] || null
          s.list = list.slice(1)
        }
        s.loading = false
      })
      .addCase(fetchContentsThunk.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload || '목록을 불러오지 못했습니다.'
      })
      // 단건
      .addCase(fetchContentByIdThunk.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchContentByIdThunk.fulfilled, (s, { payload }) => {
        s.current = payload; s.loading = false
      })
      .addCase(fetchContentByIdThunk.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload || '상세를 불러오지 못했습니다.'
      })
      // 생성
      .addCase(createContentThunk.fulfilled, (s, { payload }) => {
        // 새로고침 없이 즉시 반영 원하면 prepend
        s.list.unshift(payload)
        if (payload.isFeatured) s.hero = payload
        s.total += 1
      })
      // 수정
      .addCase(updateContentThunk.fulfilled, (s, { payload }) => {
        if (s.current?.id === payload.id) s.current = payload
        if (s.hero?.id === payload.id) s.hero = payload
        s.list = s.list.map((p) => (p.id === payload.id ? payload : p))
      })
      // 삭제
      .addCase(deleteContentThunk.fulfilled, (s, { payload: id }) => {
        s.list = s.list.filter((p) => p.id !== id)
        if (s.hero?.id === id) s.hero = null
        if (s.current?.id === id) s.current = null
        s.total = Math.max(0, s.total - 1)
      })
  },
})

export const { resetContentState } = contentSlice.actions
export default contentSlice.reducer

// 편의 selector
export const selectContentHero = (s) => s.content.hero
export const selectContentList = (s) => s.content.list
export const selectContentPaging = (s) => ({
  page: s.content.page, size: s.content.size, total: s.content.total, hasMore: s.content.hasMore,
})
