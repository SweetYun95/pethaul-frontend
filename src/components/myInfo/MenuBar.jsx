import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserReviewThunk } from '../../features/reviewSlice'
import { fetchOrdersThunk } from '../../features/orderSlice'
import { Link } from 'react-router-dom'

import '../css/myInfo/MenuBar.css'

function MenuBar({ id }) {
   const dispatch = useDispatch()
   const { reviews, loading: reviewLoading, error: reviewError } = useSelector((state) => state.review)
   const { orders, loading: orderLoading, error: orderError } = useSelector((state) => state.order)

   useEffect(() => {
      if (id) {
         dispatch(getUserReviewThunk(id))
         dispatch(fetchOrdersThunk())
      }
   }, [dispatch, id])

   // console.log('🎈리뷰 데이터:', reviews)
   // console.log('🎈주문 데이터:', orders)

   if (reviewLoading || orderLoading) return <p>로딩 중...</p>
   if (reviewError || orderError) return <p>에러 발생:{reviewError}</p>

   return (
      <section id="menubar"> 
               <div className='contents-card'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>주문</span>
               </div>
                  <div className="menubar-card">
                     {orders.length}
                  </div>
               </div>

               <div className='contents-card'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>취소</span>
               </div>
                  <div className="menubar-card">
                      {orders.length}
                  </div>
               </div>

               <div className='contents-card'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>리뷰</span>
               </div>
                  <div className="menubar-card">
                     {reviews.length}
                  </div>
               </div>

               <div className='contents-card'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>1:1 문의</span>
               </div>
                  <div className="menubar-card">
                      {orders.length}
                  </div>
               </div>
               </section>  
   )
}

export default MenuBar
