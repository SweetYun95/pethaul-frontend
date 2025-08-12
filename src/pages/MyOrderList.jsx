import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrdersThunk } from '../features/orderSlice'
import { Container, Typography, Box, Card, CardMedia, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function MyOrderList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchOrdersThunk())
   }, [dispatch])
   const rows = useMemo(() => [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)), [orders])

   //    console.log('🎈orders:', orders)
   console.log('🎈rows:', rows)

   if (loading) return <p> 로딩 중...</p>
   if (error) return <p> 에러 발생: {error}</p>

   return (
      <>
         {rows && (
            <Container>
               <Box>
                  <Typography variant="h6">결제내역</Typography>
               </Box>
               {/* 주문건 상세정보 출력 박스 */}
               <Box sx={{ width: '100%' }}>
                  {rows.map((order) => (
                     <>
                        <Box>
                           <Typography>{order.orderDate.slice(0, 10)}</Typography>
                        </Box>
                        <Box
                           key={order.id}
                           sx={{
                              display: 'flex',
                           }}
                        >
                           {order.Items.map((item) => (
                              <Card key={item.id} sx={{ width: '200px' }}>
                                 <CardMedia component="img" image={`${import.meta.env.VITE_APP_API_URL}${item.ItemImages[0].imgUrl}`} />
                                 <CardContent>
                                    <Typography variant="h6">{item.itemNm}</Typography>
                                    <Typography variant="body2">{item.OrderItem.orderPrice}원</Typography>
                                    <Typography variant="body2">{item.OrderItem.count}개</Typography>
                                    <Button>장바구니</Button>
                                    <Button>바로구매</Button>
                                 </CardContent>
                              </Card>
                           ))}
                           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography>{order.orderStatus}</Typography>
                              <Button>주문상세보기</Button>
                              <Button>교환/반품 신청</Button>
                              <Button>배송조회</Button>
                           </Box>
                        </Box>
                     </>
                  ))}
               </Box>

               <Box></Box>
            </Container>
         )}
      </>
   )
}

export default MyOrderList
