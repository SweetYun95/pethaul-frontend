import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'

// ✅ likeSlice에서 Thunk 가져오기
import { fetchMyLikedItemsThunk, toggleLikeThunk, fetchMyLikeIdsThunk } from '../features/likeSlice'

const ItemLikePage = () => {
   const dispatch = useDispatch()

   // ✅ 마운트 시 좋아요한 상품 상세 불러오기
   useEffect(() => {
      dispatch(fetchMyLikedItemsThunk())
      dispatch(fetchMyLikeIdsThunk())
   }, [dispatch])

   // ✅ likeSlice에서 직접 가져오기
   const { items: likedItems, idsMap, loadItemsLoading, error } = useSelector((state) => state.like)

   if (loadItemsLoading) {
      return <Typography>좋아요 상품을 불러오는 중입니다...</Typography>
   }

   if (error) {
      return <Typography color="error">에러 발생: {error}</Typography>
   }

   return (
      <Box sx={{ padding: '20px' }}>
         <Typography variant="h4" gutterBottom>
            좋아요한 상품
         </Typography>

         {likedItems.length > 0 ? (
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                     xs: 'repeat(1, 1fr)',
                     sm: 'repeat(2, 1fr)',
                     md: 'repeat(3, 1fr)',
                     lg: 'repeat(4, 1fr)',
                  },
                  gap: '16px',
               }}
            >
               {likedItems.map((item) => {
                  const repImage = item.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || '/images/no-image.jpg'
                  return (
                     <Link key={item.id} to={`/items/detail/${item.id}`} style={{ textDecoration: 'none' }}>
                        <Card sx={{ width: '250px' }}>
                           <CardMedia component="img" height="140" image={`${import.meta.env.VITE_APP_API_URL}${repImage}`} alt={item.itemNm} />
                           <CardContent>
                              <Typography variant="h6" noWrap>
                                 {item.itemNm}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                 {item.price?.toLocaleString()}원
                              </Typography>

                              {/* ✅ toggleLikeThunk 사용 */}
                              <IconButton
                                 onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(toggleLikeThunk(item.id))
                                 }}
                              >
                                 {idsMap[item.id] ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                              </IconButton>
                           </CardContent>
                        </Card>
                     </Link>
                  )
               })}
            </Box>
         ) : (
            <Typography variant="body1">좋아요한 상품이 없습니다.</Typography>
         )}
      </Box>
   )
}

export default ItemLikePage
