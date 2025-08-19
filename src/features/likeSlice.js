import { getMyLikeIds, toggleLike, getMyLikedItems } from '../api/likeApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 1) 내가 좋아요한 item의 ID 배열 가져오기
export const fetchMyLikeIdsThunk = createAsyncThunk('like/fetchIds', async (_, { rejectWithValue }) => {
   try {
      const response = await getMyLikeIds()
      return response.data?.itemIds ?? []
   } catch (e) {
      return rejectWithValue(e.response?.data?.message || '좋아요 ID 조회 실패')
   }
})
// 2) 내가 좋아요한 '상품 상세' 목록 가져오기 (카드 렌더)
export const fetchMyLikedItemsThunk = createAsyncThunk('like/fetchItems', async (_, { rejectWithValue }) => {
   try {
      const response = await getMyLikedItems()
      return response.data?.items ?? []
   } catch (e) {
      return rejectWithValue(e.response?.data?.message || '좋아요 상품 조회 실패')
   }
})

// 2) 좋아요 토글 (있으면 삭제, 없으면 추가)
export const toggleLikeThunk = createAsyncThunk('like/toggle', async (itemId, { rejectWithValue }) => {
   try {
      const response = await toggleLike(itemId) // { data: { liked: boolean } }
      return { itemId, liked: !!response.data?.liked }
   } catch (e) {
      return rejectWithValue({ itemId, message: e.response?.data?.message || '좋아요 토글 실패' })
   }
})

const arrayToMap = (ids = []) =>
   ids.reduce((acc, id) => {
      acc[id] = true
      return acc
   }, {})

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
      // IDs 조회
      builder
         .addCase(fetchMyLikeIdsThunk.pending, (st) => {
            st.loadIdsLoading = true
            st.error = null
         })
         .addCase(fetchMyLikeIdsThunk.fulfilled, (st, ac) => {
            st.loadIdsLoading = false
            st.idsMap = arrayToMap(ac.payload)
         })
         .addCase(fetchMyLikeIdsThunk.rejected, (st, ac) => {
            st.loadIdsLoading = false
            st.error = ac.payload || '좋아요 ID 조회 실패'
         })
         // 상세 목록 조회
         .addCase(fetchMyLikedItemsThunk.pending, (st) => {
            st.loadItemsLoading = true
            st.error = null
         })
         .addCase(fetchMyLikedItemsThunk.fulfilled, (st, ac) => {
            st.loadItemsLoading = false
            st.items = Array.isArray(ac.payload) ? ac.payload : []
            // 상세를 가져오면 idsMap도 함께 동기화(옵션)
            const ids = st.items.map((it) => it?.id).filter(Boolean)
            st.idsMap = { ...st.idsMap, ...arrayToMap(ids) }
         })
         .addCase(fetchMyLikedItemsThunk.rejected, (st, ac) => {
            st.loadItemsLoading = false
            st.error = ac.payload || '좋아요 상품 조회 실패'
         })
         // 토글(낙관적 업데이트 → 실패 시 롤백)
         .addCase(toggleLikeThunk.pending, (st, ac) => {
            const id = ac.meta.arg
            st.error = null
            st.idsMap[id] ? delete st.idsMap[id] : (st.idsMap[id] = true)
            // 상세 목록을 사용 중이라면, 취소 시 items에서 제거하거나
            // 추가 시엔 서버 재조회로 맞추는 걸 권장 (여기선 즉시 변형은 하지 않음)
         })
         .addCase(toggleLikeThunk.fulfilled, (st, ac) => {
            const { itemId, liked } = ac.payload || {}
            if (liked) st.idsMap[itemId] = true
            else delete st.idsMap[itemId]
         })
         .addCase(toggleLikeThunk.rejected, (st, ac) => {
            const id = ac.payload?.itemId
            // 롤백
            if (id != null) {
               st.idsMap[id] ? delete st.idsMap[id] : (st.idsMap[id] = true)
            }
            st.error = ac.payload?.message || '좋아요 토글 실패'
         })
   },
})

export default likeSlice.reducer
