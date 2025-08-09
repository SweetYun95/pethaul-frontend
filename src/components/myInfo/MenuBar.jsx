import { Box, Typography } from '@mui/material'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserReviewThunk } from '../../features/reviewSlice'
import { fetchOrdersThunk } from '../../features/orderSlice'

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

   console.log('🎈리뷰 데이터:', reviews)
   console.log('🎈주문 데이터:', orders)

   if (reviewLoading || orderLoading) return <p>로딩 중...</p>
   if (reviewError || orderError) return <p>에러 발생:{reviewError}</p>

   return (
      <>
         <Box display="flex">
            <Box>
               <div>주문</div>
               <Typography>{orders.length}</Typography>
            </Box>
            <Box>
               <div>리뷰</div>
               <Typography>{reviews.length}</Typography>
            </Box>
         </Box>
      </>
   )
}

export default MenuBar
