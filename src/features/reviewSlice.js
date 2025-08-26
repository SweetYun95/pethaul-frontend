// src/features/reviewSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  createReview,
  updateReview,
  getUserReview,
  deleteReview,
  getLatestReviews,
} from '../api/reviewApi'

/* =========================
   최신 리뷰 목록
   ========================= */
export const fetchNewReviewsThunk = createAsyncThunk(
  'review/fetchNewList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await getLatestReviews(params) // axios response
      return res.data // { list, page, size, total, hasMore }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '리뷰 목록 조회 실패')
    }
  }
)

/* =========================
   기존 CRUD & 내 리뷰
   ========================= */
export const createReviewThunk = createAsyncThunk(
  'review/createReview',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createReview(formData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '리뷰 등록 실패')
    }
  }
)

export const updateReviewThunk = createAsyncThunk(
  'review/updateReview',
  async ({ formData, id }, { rejectWithValue }) => {
    try {
      await updateReview(formData, id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '리뷰 수정 실패')
    }
  }
)

export const deleteReviewThunk = createAsyncThunk(
  'review/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await deleteReview(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '리뷰 삭제 실패')
    }
  }
)

export const getUserReviewThunk = createAsyncThunk(
  'review/getUserReview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserReview()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '리뷰 조회 실패')
    }
  }
)

export const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    // ✅ 최신 리뷰 리스트 상태
    list: [],
    page: 1,
    size: 10,
    total: 0,
    hasMore: false,
    listLoading: false,
    listError: null,

    // ✅ 기존 상태 유지
    review: null,
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    /* ===== 최신 리뷰 목록 ===== */
    builder
      .addCase(fetchNewReviewsThunk.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchNewReviewsThunk.fulfilled, (state, { payload }) => {
        const {
          list = [],
          page = 1,
          size = state.size,
          total = 0,
          hasMore = false,
        } = payload || {}
        state.page = page
        state.size = size
        state.total = total
        state.hasMore = hasMore
        state.list = page === 1 ? list : [...state.list, ...list]
        state.listLoading = false
      })
      .addCase(fetchNewReviewsThunk.rejected, (state, { payload }) => {
        state.listLoading = false
        state.listError = payload
      })

    /* ===== 후기 등록 ===== */
    builder
      .addCase(createReviewThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createReviewThunk.fulfilled, (state, action) => {
        state.loading = false
        state.review = action.payload.review
      })
      .addCase(createReviewThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    /* ===== 후기 수정 ===== */
    builder
      .addCase(updateReviewThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReviewThunk.fulfilled, (state, action) => {
        state.loading = false
        const id = action.payload
        state.list = state.list.map((r) => (r.id === id ? { ...r, ...state.review } : r))
        state.reviews = state.reviews.map((r) => (r.id === id ? { ...r, ...state.review } : r))
      })
      .addCase(updateReviewThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    /* ===== 후기 삭제 ===== */
    builder
      .addCase(deleteReviewThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.loading = false
        const id = action.payload
        state.list = state.list.filter((r) => r.id !== id)
        state.reviews = state.reviews.filter((r) => r.id !== id)
      })
      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    /* ===== 회원이 작성한 후기 조회 ===== */
    builder
      .addCase(getUserReviewThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserReviewThunk.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload.review
      })
      .addCase(getUserReviewThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default reviewSlice.reducer

/* ===== Selectors ===== */
export const selectReviewList = (s) => s.review.list
export const selectReviewListLoading = (s) => s.review.listLoading
export const selectReviewListError   = (s) => s.review.listError

// ✅ 메모이즈된 페이징 셀렉터 (객체 참조 고정)
export const selectReviewPaging = createSelector(
  (s) => s.review.page,
  (s) => s.review.size,
  (s) => s.review.total,
  (s) => s.review.hasMore,
  (page, size, total, hasMore) => ({ page, size, total, hasMore })
)
