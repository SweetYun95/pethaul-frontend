import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createReview, updateReview, getUserReview } from '../api/reviewApi'

// 리뷰 등록하기
export const createReviewThunk = createAsyncThunk('review/createReview', async (formData, { rejectWithValue }) => {
   try {
      const response = await createReview(formData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//리뷰 수정하기
export const updateReviewThunk = createAsyncThunk('review/updateReview', async ({ formData, id }, { rejectWithValue }) => {
   try {
      const response = await updateReview(formData, id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//회원이 작성한 리뷰 조회하기
export const getUserReviewThunk = createAsyncThunk('review/getUserReview', async (id, { rejectWithValue }) => {
   try {
      const response = await getUserReview(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const reviewSlice = createSlice({
   name: 'review',
   initialState: {
      review: null, // 단일 리뷰
      reviews: [], // 리뷰 리스트 (회원/상품에 대한 리뷰 전체 조회)
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 후기 등록
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

      // 후기 수정
      builder
         .addCase(updateReviewThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateReviewThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(updateReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 회원이 작성한 후기 조회
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
