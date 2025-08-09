import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import { fetchItemsThunk } from '../features/itemSlice'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'
import { toggleLike } from '../features/likeSlice'

const ItemLikePage = () => {
   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(fetchItemsThunk({ categoryId: '' }))
   }, [dispatch])

   const { items } = useSelector((state) => state.item)
   const likes = useSelector((state) => state.like.likes)

   const likedItems = items.filter((item) => likes[item.id])

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
                              <IconButton
                                 onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(toggleLike(item.id))
                                 }}
                              >
                                 {likes[item.id] ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
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
