// src/features/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders, getOrderById, cancelOrder } from '../api/orderApi'

// 주문 생성 Thunk
export const createOrderThunk = createAsyncThunk('order/createOrder', async (orderData, { rejectWithValue }) => {
   try {
      const response = await createOrder(orderData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 생성 실패')
   }
})

// 주문 목록 조회 Thunk
export const fetchOrdersThunk = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
   try {
      const response = await getOrders()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 목록 조회 실패')
   }
})

// 주문 상세 조회 Thunk
export const fetchOrderByIdThunk = createAsyncThunk('order/fetchOrderById', async (orderId, { rejectWithValue }) => {
   try {
      const response = await getOrderById(orderId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 상세 조회 실패')
   }
})

// 주문 취소 Thunk
export const cancelOrderThunk = createAsyncThunk('order/cancelOrder', async (orderId, { rejectWithValue }) => {
   try {
      const response = await cancelOrder(orderId)
      return { orderId, message: response.data.message }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '주문 취소 실패')
   }
})

const orderSlice = createSlice({
   name: 'order',
   initialState: {
      orders: [],
      orderDetail: null,
      loading: false,
      error: null,
      successMessage: null,
   },
   reducers: {
      clearOrderMessages(state) {
         state.successMessage = null
         state.error = null
      },
   },
   extraReducers: (builder) => {
      // 주문 생성
      builder
         .addCase(createOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = '주문이 완료되었습니다.'
            state.orders.push(action.payload)
         })
         .addCase(createOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문 목록 조회
      builder
         .addCase(fetchOrdersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload
         })
         .addCase(fetchOrdersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문 상세 조회
      builder
         .addCase(fetchOrderByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orderDetail = action.payload
         })
         .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 주문 취소
      builder
         .addCase(cancelOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message
            // 취소된 주문 상태 업데이트
            state.orders = state.orders.map((order) => (order.id === action.payload.orderId ? { ...order, orderStatus: 'CANCEL' } : order))
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearOrderMessages } = orderSlice.actions
export default orderSlice.reducer
