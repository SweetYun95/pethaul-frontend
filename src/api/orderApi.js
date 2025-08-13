// src/api/orderApi.js
import shopmaxApi from './axiosApi'

// 주문 생성
export const createOrder = async (orderData) => {
   try {
      const response = await shopmaxApi.post('/order', orderData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 목록 조회
export const getOrders = async () => {
   try {
      const response = await shopmaxApi.get('/order')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 상세 조회
export const getOrderById = async (orderId) => {
   try {
      const response = await shopmaxApi.get(`/order/${orderId}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 취소
export const cancelOrder = async (orderId) => {
   try {
      const response = await shopmaxApi.patch(`/order/${orderId}/cancel`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//주문 상태 변경
export const updateOrderStatus = async (orderId, status) => {
   try {
      const response = await shopmaxApi.patch(`/order/${orderId}?status=${status}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//전체 주문 조회(관리자용)
export const fetchAllOrders = async () => {
   try {
      const response = await shopmaxApi.get('/order/all')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
