import { Box, Button, Typography, Stack, TextField, Card, CardMedia, CardContent } from '@mui/material'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { deleteItemThunk, fetchItemsThunk } from '../../features/itemSlice'
import { Link } from 'react-router-dom'

function ItemPanel({ searchTerm, sellCategory }) {
   const dispatch = useDispatch()
   useEffect(() => {
      dispatch(fetchItemsThunk({ searchTerm, sellCategory }))
   }, [dispatch])

   const { items, loading, error } = useSelector((state) => state.item)

   console.log('items:', items)

   const onClickDelete = (e) => {
      const res = confirm('정말 삭제하시겠습니까?')
      if (res) {
         dispatch(deleteItemThunk(e.target.id))
            .unwrap()
            .then(() => alert('상품이 삭제되었습니다!'))
            .catch(() => alert('상품 삭제 중 오류 발생'))
      }
   }
   if (loading) <p>로딩 중...</p>
   if (error) <p>에러가 발생했습니다.: {error}</p>
   return (
      <>
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
            {items &&
               items.map((item) => (
                  <Card key={item.id} sx={{ width: '200px' }}>
                     <CardMedia component="img" image={`${import.meta.env.VITE_APP_API_URL}${item.ItemImages?.filter((data) => data.repImgYn === 'Y')[0].imgUrl}`} />
                     <CardContent>
                        <Typography variant="h6">{item.itemNm}</Typography>
                        {item.Categories.map((ic) => (
                           <Typography variant="caption">{'#' + ic.categoryName}</Typography>
                        ))}
                     </CardContent>
                     <Box>
                        <Link to={`/items/edit/${item.id}`}>
                           <Button>수정</Button>
                        </Link>
                        <Button onClick={onClickDelete} id={item.id}>
                           삭제
                        </Button>
                     </Box>
                  </Card>
               ))}
         </Box>
      </>
   )
}

export default ItemPanel
