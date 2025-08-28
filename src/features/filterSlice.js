import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
   name: 'filters',
   initialState: {
      selectedCats: [],
      priceMin: '',
      priceMax: '',
      sellStatus: '',
      inStockOnly: false,
   },
   reducers: {
      setFilters: (state, action) => {
         return { ...state, ...action.payload }
      },
      resetFilters: () => ({
         selectedCats: [],
         priceMin: '',
         priceMax: '',
         sellStatus: '',
         inStockOnly: false,
      }),
   },
})
export const { setFilters, resetFilters } = filterSlice.actions
export default filterSlice.reducer
