// src/components/item/ItemDetailForm.jsx
import { Box, Button, Typography, Stack, TextField, keyframes } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCartThunk } from '../../features/cartSlice'

import { createOrderThunk } from '../../features/orderSlice'
import ItemReviewList from '../review/ItemReviewList'

function ItemDetailForm({ item }) {
   const dispatch = useDispatch()
   const [quantity, setQuantity] = useState(1)

   if (!item) {
      return <Typography>상품 정보를 불러오는 중입니다...</Typography>
   }

   const handleQuantityChange = (e) => {
      const value = Math.max(1, Number(e.target.value) || 1)
      setQuantity(value)
   }

   const handleBuyNow = async () => {
      try {
         const orderData = {
            items: [
               {
                  itemId: item.id,
                  price: item.price,
                  quantity: quantity,
               },
            ],
         }

         console.log('📁[ItemDetailForm.jsx] orderData:', orderData)

         await dispatch(createOrderThunk(orderData)).unwrap()
         alert('주문이 완료되었습니다.')
      } catch (err) {
         alert(`주문 실패: ${err}`)
      }
   }

  const handleAddToCart = async () => {
     try {
        await dispatch(addToCartThunk({ itemId: item.id, count: quantity })).unwrap()
        alert('장바구니에 추가되었습니다.')
        
     } catch (err) {
        alert(`장바구니 추가 실패: ${err}`)
     }
  }


   return (
      <>
         {/* 이미지 출력 박스 */}
         <Box
            sx={{
               display: 'flex',
            }}
         >
            {/* 서브 이미지 */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '90px',
                  height: '104px',
               }}
            >
               {item.ItemImages.filter((data) => data.repImgYn === 'N').map((img, index) => (
                  <img src={`${import.meta.env.VITE_APP_API_URL}${img.imgUrl}`} key={index} />
               ))}
            </Box>
            {/* 대표 이미지 */}
            <Box>
               <img
                  src={`${import.meta.env.VITE_APP_API_URL}${item.ItemImages.filter((img) => img.repImgYn === 'Y')[0].imgUrl}`}
                  sx={{
                     width: '540px',
                     height: '622px',
                  }}
               />
            </Box>
         </Box>

         {/* 상품 정보 출력 박스 */}
         <Box>
            {/* 상품 이름 */}
            <Typography variant="h4" gutterBottom>
               {item.itemNm}
            </Typography>

            {/* 상품 가격 */}
            <Typography variant="h6" gutterBottom>
               {item.price.toLocaleString()} 원
            </Typography>

            {/* 간단 설명 */}
            {item.itemSummary && (
               <Typography variant="body1" gutterBottom>
                  {item.itemSummary}
               </Typography>
            )}

            {/* 수량 선택 */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 2 }}>
               <TextField label="수량" type="number" value={quantity} onChange={handleQuantityChange} InputProps={{ inputProps: { min: 1 } }} size="small" sx={{ width: '100px' }} />
               <Typography>총 {(item.price * quantity).toLocaleString()} 원</Typography>
            </Stack>

            {/* 버튼 영역 */}
            <Stack direction="row" spacing={2}>
               <Button variant="outlined" onClick={handleAddToCart} fullWidth>
                  장바구니
               </Button>
               <Button variant="contained" color="primary" onClick={handleBuyNow} fullWidth>
                  구매하기
               </Button>
            </Stack>

            {/* 상품에 대한 리뷰 리스트 출력 */}
            <ItemReviewList item={item} />

            {/* 상세설명 출력 영역 */}
            {item.itemDetail && (
               <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {item.itemDetail}
               </Typography>
            )}
         </Box>
      </>
   )
}

export default ItemDetailForm
