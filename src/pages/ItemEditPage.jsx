import { Container } from '@mui/material'

import ItemEditForm from '../components/item/ItemEditForm'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchItemByIdThunk } from '../features/itemSlice'

function ItemEditPage() {
   const dispatch = useDispatch()
   const { id } = useParams()
   const { item, loading, error } = useSelector((state) => state.item)

   useEffect(() => {
      dispatch(fetchItemByIdThunk(id))
   }, [dispatch, id])

   if (!item) return <p>상품이 존재하지 않습니다.</p>
   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생:{error}</p>

   console.log(item)
   return (
      <>
         <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
            <h1>상품 수정</h1>
            <ItemEditForm initialData={item} />
         </Container>
      </>
   )
}

export default ItemEditPage
