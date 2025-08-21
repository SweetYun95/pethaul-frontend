// src/features/itemSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createItem,
  updateItem,
  deleteItem,
  getItems,
  getItemById,
  fetchSortData,
} from '../api/itemApi'

// 상품 등록
export const createItemThunk = createAsyncThunk(
  'items/createItem',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createItem(formData)
      return {
        item: response.data.item,
        images: response.data.images || [],
        categories: response.data.categories || [],
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 등록 실패')
    }
  }
)

// 상품 수정
export const updateItemThunk = createAsyncThunk(
  'items/updateItem',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      await updateItem(id, formData)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 수정 실패')
    }
  }
)

// 상품 삭제
export const deleteItemThunk = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await deleteItem(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상품 삭제 실패')
    }
  }
)

// 전체 상품 리스트 가져오기 (목록/검색 전용)
export const fetchItemsThunk = createAsyncThunk(
  'items/getItems',
  async (data, { rejectWithValue }) => {
    try {
      const response = await getItems(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '전체 상품 리스트 가져오기 실패')
    }
  }
)

// 특정 상품 가져오기 (상세)
export const fetchItemByIdThunk = createAsyncThunk(
  'items/fetchItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getItemById(id)
      return response.data.item
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '특정 상품 가져오기 실패')
    }
  }
)

// 메인용 정렬 데이터(Top/Today/New)
export const fetchSortDataThunk = createAsyncThunk(
  'order/fetchSortData',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await fetchSortData(limit)
      // console.log('🎈response.data:', response.data) // { topSales, topToday, newItems }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '데이터 조회 실패')
    }
  }
)

const initialState = {
  item: null, // 상세
  main: {     // 메인 전용 데이터
    topSales: [],
    topToday: [],
    newItems: [],
  },
  list: [],   // 목록/검색 전용 데이터
  items: [],  // ✅ 기존 코드 호환(= list 미러)
  loading: false,
  error: null,
}

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 상품 등록
      .addCase(createItemThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createItemThunk.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload.item
      })
      .addCase(createItemThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // 상품 수정
      .addCase(updateItemThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateItemThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateItemThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // 상품 삭제
      .addCase(deleteItemThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteItemThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(deleteItemThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // 전체 상품 리스트 가져오기 (목록/검색)
      .addCase(fetchItemsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItemsThunk.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        const list = Array.isArray(payload) ? payload : (payload?.items ?? [])
        state.list = list
        state.items = list // ✅ 호환: 기존 컴포넌트가 state.item.items를 읽어도 동작하도록
      })
      .addCase(fetchItemsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // 특정 상품 가져오기 (상세)
      .addCase(fetchItemByIdThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItemByIdThunk.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload
      })
      .addCase(fetchItemByIdThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // 메인 데이터 (Top/Today/New)
      .addCase(fetchSortDataThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSortDataThunk.fulfilled, (state, action) => {
        state.loading = false
        state.main = action.payload || { topSales: [], topToday: [], newItems: [] }
        // ❌ 더 이상 state.items를 건드리지 않음 (메인/목록 분리)
      })
      .addCase(fetchSortDataThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default itemSlice.reducer
