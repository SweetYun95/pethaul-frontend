// src/features/itemSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createItem, updateItem, deleteItem, getItems, getItemById } from '../api/itemApi'

// 상품 등록
export const createItemThunk = createAsyncThunk('items/createItem', async (formData, { rejectWithValue }) => {
   try {
      const response = await createItem(formData)
      return {
         item: response.data.item,
         images: response.data.images || [],
         categories: response.data.categories || [],
      }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 상품 수정
export const updateItemThunk = createAsyncThunk('items/updateItem', async ({ id, formData }, { rejectWithValue }) => {
   try {
      await updateItem(id, formData)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 상품 삭제
export const deleteItemThunk = createAsyncThunk('items/deleteItem', async (id, { rejectWithValue }) => {
   try {
      await deleteItem(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 전체 상품 리스트 가져오기
export const fetchItemsThunk = createAsyncThunk('items/getItems', async (data, { rejectWithValue }) => {
   try {
      const response = await getItems(data)
      console.log('🎈:', response.data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 특정 상품 가져오기
export const fetchItemByIdThunk = createAsyncThunk('items/fetchItemById', async (id, { rejectWithValue }) => {
   try {
      const response = await getItemById(id)
      return response.data.item
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const itemSlice = createSlice({
   name: 'items',
   initialState: {
      item: null,
      items: [],
      loading: false,
      error: null,
   },
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

         // 전체 상품 리스트 가져오기
         .addCase(fetchItemsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchItemsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload.items
         })
         .addCase(fetchItemsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 특정 상품 가져오기
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
   },
})

export default itemSlice.reducer
