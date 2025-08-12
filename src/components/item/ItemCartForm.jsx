import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCartItemsThunk, updateCartItemThunk, deleteCartItemThunk } from '../../features/cartSlice'
import { Box, Typography, Card, CardMedia, CardContent, IconButton, Button, TextField, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Link, useParams } from 'react-router-dom'

const ItemCartForm = () => {
   const dispatch = useDispatch()
   const { items: cartItems, loading } = useSelector((state) => state.cart)
   const { id } = useParams()
   useEffect(() => {
      dispatch(fetchCartItemsThunk(id))
   }, [dispatch])
   console.log('🎈id:', id, '🎈items:', cartItems)

   const handleUpdate = (itemId, count) => {
      if (count < 1) return
      dispatch(updateCartItemThunk({ itemId, count }))
   }

   const handleDelete = (itemId) => {
      dispatch(deleteCartItemThunk(itemId))
   }

   const totalPrice = cartItems.reduce((acc, item) => acc + item.count * item.Item.price, 0)
   const discount = 3000 // 예시 쿠폰 할인
   const finalPrice = totalPrice - discount

   return (
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} p={3}>
         {/* 장바구니 상품 카드 리스트 */}
         <Box flex={3}>
            <Typography variant="h5" gutterBottom>
               장바구니
            </Typography>
            {cartItems.map((item) => {
               const repImage = item.Item.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || '/images/no-image.jpg'
               return (
                  <Card key={`${item.id}-${item.Item.id}`} sx={{ display: 'flex', mb: 2 }}>
                     <CardMedia component="img" sx={{ width: 140 }} image={`${import.meta.env.VITE_APP_API_URL}${repImage}`} alt={item.Item.itemNm} />
                     <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6">{item.Item.itemNm}</Typography>
                        <Typography variant="body2" color="text.secondary">
                           가격: {item.Item.price.toLocaleString()}원
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                           <TextField
                              type="number"
                              size="small"
                              value={item.count}
                              onChange={(e) => {
                                 const v = parseInt(e.target.value, 10)
                                 if (Number.isNaN(v)) return // 빈 입력 방지
                                 handleUpdate(item.itemId, v) // ← item.id X, item.itemId O
                              }}
                              inputProps={{ min: 1 }}
                              sx={{ width: 80 }}
                           />
                           <IconButton onClick={() => handleDelete(item.itemId)}>
                              <DeleteIcon color="error" />
                           </IconButton>
                        </Box>
                     </CardContent>
                  </Card>
               )
            })}
         </Box>

         {/* 결제 요약 박스 */}
         <Box flex={1} border="1px solid #ccc" borderRadius={2} p={2}>
            <Typography variant="h6">결제 정보</Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
               <Typography>상품 금액</Typography>
               <Typography>{totalPrice.toLocaleString()}원</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
               <Typography>쿠폰 할인</Typography>
               <Typography>-{discount.toLocaleString()}원</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
               <Typography variant="h6">총 결제 금액</Typography>
               <Typography variant="h6" color="primary">
                  {finalPrice.toLocaleString()}원
               </Typography>
            </Box>

            <Button component={Link} to={`/order`} state={{ cartItems }} fullWidth variant="contained" color="primary" sx={{ mt: 3 }} disabled={cartItems.length === 0}>
               주문하기
            </Button>
         </Box>
      </Box>
   )
}

export default ItemCartForm
