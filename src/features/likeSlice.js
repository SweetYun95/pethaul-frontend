import { getMyLikeIds, toggleLike, getMyLikedItems } from '../api/likeApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 2) 내가 좋아요한 상품 상세 목록 가져오기
export const fetchMyLikedItemsThunk = createAsyncThunk('like/fetchItems', async (_, { rejectWithValue }) => {
   try {
      const res = await getMyLikedItems()
      return res.data?.items ?? [] // [{id, itemNm, price, ItemImages...}, ...]
   } catch (e) {
      return rejectWithValue(e.response?.data?.message || '좋아요 상품 조회 실패')
   }
})

const likeSlice = createSlice({
   name: 'like',
   initialState: {
      // idsMap: { [itemId]: true }
      idsMap: {},
      // 좋아요한 상품 상세(좋아요 페이지 렌더용)
      items: [],
      // 로딩/에러
      loadIdsLoading: false,
      loadItemsLoading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 좋아요 목록 조회
         .addCase(fetchMyLikedItemsThunk.pending, (st) => {
            st.loadItemsLoading = true
            st.error = null
         })
         .addCase(fetchMyLikedItemsThunk.fulfilled, (st, ac) => {
            st.loadItemsLoading = false
            st.items = Array.isArray(ac.payload) ? ac.payload : []
         })
         .addCase(fetchMyLikedItemsThunk.rejected, (st, ac) => {
            st.loadItemsLoading = false
            st.error = ac.payload || '좋아요 상품 조회 실패'
         })
   },
})

export default likeSlice.reducer
