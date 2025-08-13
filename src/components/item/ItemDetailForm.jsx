// src/components/item/ItemDetailForm.jsx
import { Box, Button, Typography, Stack, TextField } from '@mui/material'
import { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { addToCartThunk } from '../../features/cartSlice'

import ItemReviewList from '../review/ItemReviewList'
import { Link } from 'react-router-dom'
import '../css/item/ItemDetailForm.css'

function ItemDetailForm({ item }) {
   const dispatch = useDispatch()
   const [quantity, setQuantity] = useState(1)

   // 썸네일 이미지 초기값
   const [selectedImage, setSelectedImage] = useState(`${import.meta.env.VITE_APP_API_URL}${item.ItemImages.find((img) => img.repImgYn === 'Y')?.imgUrl}`)

   //해당 상품 평균 평점 계산
   const { avgRating, reviewCount } = useMemo(() => {
      const list = Array.isArray(item?.Reviews) ? item.Reviews : []
      const valid = list.filter((r) => r?.rating !== null && r?.rating !== undefined)
      const total = valid.reduce((sum, r) => sum + Number(r.rating || 0), 0)
      const count = valid.length
      const avg = count ? total / count : 0
      return { avgRating: Math.round(avg * 10) / 10, reviewCount: count }
   }, [item?.Reviews])
   if (!item) {
      return <Typography>상품 정보를 불러오는 중입니다...</Typography>
   }

   const handleQuantityChange = (e) => {
      const value = Math.max(1, Number(e.target.value) || 1)
      setQuantity(value)
   }

   const handleAddToCart = async () => {
      try {
         await dispatch(addToCartThunk({ itemId: item.id, count: quantity })).unwrap()
         alert('장바구니에 추가되었습니다.')
      } catch (err) {
         alert(`장바구니 추가 실패: ${err}`)
      }
   }

   // console.log('🎀', avgRating, '🎀', reviewCount)

   return (
      <>
         {/* 이미지 출력 박스 */}
         <Box
            sx={{
               display: 'flex',
            }}
         >
            {/* 서브 이미지 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '90px' }}>
               {item.ItemImages.map((img, index) => (
                  <img key={index} src={`${import.meta.env.VITE_APP_API_URL}${img.imgUrl}`} style={{ cursor: 'pointer', marginBottom: '8px' }} onClick={() => setSelectedImage(`${import.meta.env.VITE_APP_API_URL}${img.imgUrl}`)} />
               ))}
            </Box>

            {/* 대표 이미지 */}
            <Box>
               <img src={selectedImage} style={{ width: '540px', height: '622px' }} />
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
            {item.itemSellStatus === 'SELL' ? (
               <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={handleAddToCart} fullWidth>
                     장바구니
                  </Button>
                  <Button
                     variant="outlined"
                     component={Link}
                     to="/order"
                     state={{
                        item: [
                           {
                              itemId: item.id,
                              price: item.price,
                              quantity: quantity,
                           },
                        ],
                     }}
                     fullWidth
                  >
                     구매하기
                  </Button>
               </Stack>
            ) : (
               <Typography color="error">품절된 상품입니다.</Typography>
            )}

            {/* 상품에 대한 리뷰 리스트 출력 */}
            <ItemReviewList item={item} avgRating={avgRating} reviewCount={reviewCount} />

            {/* 상세설명 출력 영역 */}
            {item.itemDetail && (
               <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {item.itemDetail}
               </Typography>
            )}
            {/* 카테고리 출력 영역 */}
            {item.Categories && <Typography variant="caption">{item.Categories.map((c) => `#${c.categoryName} `)}</Typography>}
         </Box>
      </>
   )
}

export default ItemDetailForm
