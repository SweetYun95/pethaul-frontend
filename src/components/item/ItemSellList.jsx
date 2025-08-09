import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsThunk } from '../../features/itemSlice'
import { Link } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import IconButton from '@mui/material/IconButton'
import { toggleLike } from '../../features/likeSlice'

function ItemSellList() {
   const dispatch = useDispatch()
   const { items, loading, error } = useSelector((state) => state.item)
   const [selectedCategory, setSelectedCategory] = useState('')
   const likes = useSelector((state) => state.like.likes)


   const categories = [
      { id: '', name: '전체' },
      { id: '1', name: '의류' },
      { id: '2', name: '잡화' },
      { id: '3', name: '식품' },
   ]

   useEffect(() => {
      dispatch(fetchItemsThunk({ categoryId: selectedCategory }))
   }, [dispatch, selectedCategory])


   if (loading) return null
   if (error) {
      return (
         <Typography align="center" color="error">
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <Box sx={{ padding: '20px' }}>
         {/* 카테고리 바 */}
         <Box mb={3} display="flex" gap={1}>
            {categories.map((cat) => (
               <Button key={cat.id} variant={selectedCategory === cat.id ? 'contained' : 'outlined'} onClick={() => setSelectedCategory(cat.id)}>
                  {cat.name}
               </Button>
            ))}
         </Box>

         {/* 상품 리스트 */}
         {items.length > 0 ? (
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
                  justifyItems: 'center',
               }}
            >
               {items.map((item) => {
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
                              {/* 좋아요 버튼 추가 */}
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
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h6">검색된 상품이 없습니다.</Typography>
            </Box>
         )}
      </Box>
   )
}

export default ItemSellList
