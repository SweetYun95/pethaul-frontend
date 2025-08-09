import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCartItems, addToCart, updateCartItem, deleteCartItem } from '../api/cartApi'

// 장바구니 불러오기
export const fetchCartItemsThunk = createAsyncThunk('cart/fetchCartItems', async (id, { rejectWithValue }) => {
   try {
      const response = await getCartItems(id)
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '장바구니 조회 실패')
   }
})

// 장바구니에 상품 추가
export const addToCartThunk = createAsyncThunk('cart/addToCart', async ({ itemId, count }, { rejectWithValue }) => {
   try {
      await addToCart({ itemId, count })
      return { itemId, count }
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '추가 실패')
   }
})

// 수량 변경
export const updateCartItemThunk = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, count }, { rejectWithValue }) => {
   try {
      await updateCartItem({ cartItemId, count })
      return { cartItemId, count }
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '수정 실패')
   }
})

// 상품 삭제
export const deleteCartItemThunk = createAsyncThunk('cart/deleteCartItem', async (cartItemId, { rejectWithValue }) => {
   try {
      await deleteCartItem(cartItemId)
      return cartItemId
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '삭제 실패')
   }
})

const cartSlice = createSlice({
   name: 'cart',
   initialState: {
      items: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         //장바구니 불러오기
         .addCase(fetchCartItemsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchCartItemsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
         })
         .addCase(fetchCartItemsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //장바구니 상품추가
         .addCase(addToCartThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addToCartThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(addToCartThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //수량변경
         .addCase(updateCartItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateCartItemThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(updateCartItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //상품삭제
         .addCase(deleteCartItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteCartItemThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(deleteCartItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default cartSlice.reducer
