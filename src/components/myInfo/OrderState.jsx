import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersThunk } from '../../features/orderSlice'
import { Box, Typography } from '@mui/material'

function OrderState() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchOrdersThunk())
   }, [dispatch])
   // console.log('🎈orders:', orders)
   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생:{error}</p>
   return (
      <>
         <Box>
            <Box>
               <Typography>주문현황 (임시)</Typography>
            </Box>

            <Box>
               <Typography>{orders[0]?.orderStatus}</Typography>
            </Box>
         </Box>
      </>
   )
}

export default OrderState
