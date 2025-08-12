import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk, updateOrderStatusThunk } from '../../features/orderSlice'
import { Box, Typography, Button } from '@mui/material'

function OrderPanel() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   const [statusValue, setStatusValue] = useState({})

   useEffect(() => {
      if (Array.isArray(orders)) {
         const initialStatus = {}
         orders.forEach((order) => {
            initialStatus[order.id] = order.orderStatus
         })
         setStatusValue(initialStatus)
      }
   }, [orders])

   useEffect(() => {
      dispatch(fetchAllOrdersThunk())
   }, [dispatch])
   console.log('orders', orders)

   const handleStatusChange = (orderId, value) => {
      setStatusValue((prev) => ({
         ...prev,
         [orderId]: value,
      }))
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>

   const handleUpdateStatus = (orderId) => {
      const res = confirm('정말 수정하시겠습니까?')
      if (res) {
         console.log({ id: orderId, status: statusValue[orderId] })
         dispatch(updateOrderStatusThunk({ orderId, status: statusValue[orderId] }))
            .unwrap()
            .then(() => {
               alert(`주문id: ${orderId} 건의 주문상태를 ${statusValue[orderId]}로 변경했습니다!`)
               dispatch(fetchAllOrdersThunk())
            })
            .catch((error) => {
               console.log('에러 발생: ', error)
               alert('에러가 발생했습니다.: ' + error)
            })
      }
   }

   return (
      <>
         {Array.isArray(orders) && (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
               {orders.map((order) => (
                  <Box
                     key={order.id}
                     sx={{
                        display: 'flex',
                     }}
                  >
                     {/* sx 배경색: 영역 구분을 위해 설정한 값. 추후 수정 필요 */}
                     <Box sx={{ backgroundColor: 'pink' }}>
                        <Typography>ID: {order.id}</Typography>
                     </Box>

                     <Box sx={{ backgroundColor: 'gray' }}>
                        <Typography>주문일자: {order.orderDate.slice(0, 10)}</Typography>
                        <Typography>주문자: {order.User.name}</Typography>
                        <Typography>주문자 id: {order.User.userId}</Typography>
                        <Typography>주소: {order.User.address}</Typography>
                     </Box>
                     <Box sx={{ backgroundColor: 'skyblue' }}>
                        <Typography>주문상품: {order.Items[0].itemNm}</Typography>
                        {/* 여기 나중에 수정 필요 */}
                     </Box>

                     <select value={statusValue[order.id]} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                        <option value="ORDER">ORDER</option>
                        <option value="READY">READY</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                     </select>
                     <Box>
                        <Button onClick={() => handleUpdateStatus(order.id)}>수정</Button>
                        <Button>취소</Button>
                     </Box>
                  </Box>
               ))}
            </Box>
         )}
      </>
   )
}

export default OrderPanel
