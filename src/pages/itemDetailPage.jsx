import { Container, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchItemByIdThunk } from '../features/itemSlice'
import ItemDetailForm from '../components/item/ItemDetailForm'

function ItemDetailPage() {
   const { id } = useParams()
   const dispatch = useDispatch()
   const { item, loading, error } = useSelector((state) => state.item)
   useEffect(() => {
      if (id) {
         dispatch(fetchItemByIdThunk(id))
      }
   }, [id, dispatch])

   if (loading) {
      return (
            <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>

            <CircularProgress />
         </div>
      )
   }

   if (error) {
      return (
             <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>

            <Typography color="error">{error}</Typography>
         </div>
      )
   }

   if (!item) {
      return (
             <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>

            <Typography>상품 정보를 불러올 수 없습니다.</Typography>
         </div>
      )
   }

   return (
          <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>
         <ItemDetailForm item={item} />
      </div>
   )
}

export default ItemDetailPage
