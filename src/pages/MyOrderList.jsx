import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersThunk } from '../features/orderSlice'
import { Container, Typography, Box } from '@mui/material'

function MyOrderList() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchOrdersThunk())
   }, [dispatch])
   const rows = useMemo(() => [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)), [orders])

   //    console.log('🎈orders:', orders)
   //    console.log('🎈rows:', rows)

   if (loading) return <p> 로딩 중...</p>
   if (error) return <p> 에러 발생: {error}</p>

   return (
      <>
         {rows && (
            <Container>
               <Box>
                  <Typography variant="h6">주문내역</Typography>
               </Box>

               <Box>
                  <table width="100%">
                     <thead>
                        <tr>
                           <th>no.</th>
                           <th>주문일자</th>
                           <th>주문상품</th>
                           <th>결제금액</th>
                           <th>주문/배송상태</th>
                        </tr>
                     </thead>

                     <tbody style={{ textAlign: 'center' }}>
                        {rows.map((order) => (
                           <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>{order.orderDate.slice(0, 10)}</td>
                              {order.Items.length >= 1 ? (
                                 <td>
                                    <img src={`${import.meta.env.VITE_APP_API_URL}${order.Items[0].ItemImages[0].imgUrl}`} width="80px" />
                                    {order.Items[0].itemNm}
                                 </td>
                              ) : (
                                 <td>
                                    {order.Items[0].itemNm}외 {order.Items.length - 1}개
                                 </td>
                              )}
                              <td>
                                 {order.Items.map((i) => {
                                    let totalPrice = 0
                                    totalPrice += i.OrderItem.orderPrice
                                    return totalPrice
                                 })}
                              </td>
                              <td>{order.orderStatus}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </Box>
            </Container>
         )}
      </>
   )
}

export default MyOrderList
