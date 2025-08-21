import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import itemReducer from '../features/itemSlice'
import tokenReducer from '../features/tokenSlice'
import orderReducer from '../features/orderSlice' // 주문 slice 추가
import reviewSlice from '../features/reviewSlice'
import likeSlice from '../features/likeSlice'
import cartReducer from '../features/cartSlice'
import petReducer from '../features/petSlice'
import filterReducer from '../features/filterSlice'
const store = configureStore({
   reducer: {
      auth: authReducer,
      item: itemReducer,
      token: tokenReducer,
      order: orderReducer,
      cart: cartReducer,
      review: reviewSlice,
      like: likeSlice,
      pet: petReducer,
      filter: filterReducer,
   },
})

export default store
