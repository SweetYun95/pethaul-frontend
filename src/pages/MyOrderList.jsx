import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderThunk, fetchOrdersThunk } from '../features/orderSlice'
import { Container, Typography, Box, Card, CardMedia, CardContent, Button } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'

function MyOrderList() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchOrdersThunk())
   }, [dispatch])
   const rows = useMemo(() => [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)), [orders])

   //    console.log('🎈orders:', orders)
   console.log('🎈rows:', rows)

   const handleOrderCancel = (id) => {
      const res = confirm('정말 주문을 취소하시겠습니까?')
      if (res) {
         dispatch(cancelOrderThunk(id))
            .unwrap()
            .then(() => {
               alert('주문을 취소했습니다.')
               dispatch(fetchOrdersThunk())
            })
            .catch((error) => {
               console.log('주문 취소 중 에러 발생:', error)
               alert('주문 취소 중 에러가 발생했습니다.:' + error)
            })
      }
   }

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
                     <Box key={order.id}>
                        <Box>
                           <Typography>{order.orderDate.slice(0, 10)}</Typography>
                        </Box>
                        <Box
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

                                    {order.orderStatus === 'ORDER' && <Button onClick={() => handleOrderCancel(order.id)}>주문 취소</Button>}
                                    {order.orderStatus === 'CANCEL' && <Typography color="error">취소된 주문입니다.</Typography>}
                                    {order.orderStatus !== 'ORDER' && order.orderStatus !== 'CANCEL' && (
                                       <Button component={Link} to={`/review/create`} state={{ item }}>
                                          리뷰 작성
                                       </Button>
                                    )}
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
                     </Box>
                  ))}
               </Box>

               <Box></Box>
            </Container>
         )}
      </>
   )
}

export default MyOrderList
