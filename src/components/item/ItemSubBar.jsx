import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../../features/filterSlice'

function ItemSubBar({ items }) {
   const dispatch = useDispatch()
   const { inStockOnly } = useSelector((state) => state.filter)

   const handleSetFilter = (e) => {
      dispatch(setFilters({ inStockOnly: e.target.checked }))
   }
   return (
      <div className="subbar">
         <div className="result-count">상품 {items.length}개</div>
         <div className="stock-toggle">
            <label className="switch">
               <input type="checkbox" checked={inStockOnly} onChange={(e) => handleSetFilter(e)} />
               <span className="slider"></span>
            </label>
            <span className="switch-label">품절 상품 제외</span>
         </div>
      </div>
   )
}

export default ItemSubBar
