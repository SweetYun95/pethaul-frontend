import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchItemsThunk } from '../../features/itemSlice'
import { useDispatch } from 'react-redux'

import { Container } from '@mui/material'

import ItemCardHeader from './ItemCardHeader'
import ItemList from './ItemList'
import { fetchMyLikedItemsThunk, fetchMyLikeIdsThunk } from '../../features/likeSlice'

function ItemFilteredPage() {
   const [searchParams] = useSearchParams()
   const dispatch = useDispatch()
   const filters = searchParams.getAll('filter')

   useEffect(() => {
      dispatch(fetchItemsThunk({ sellCategory: filters }))
      dispatch(fetchMyLikeIdsThunk())
      dispatch(fetchMyLikedItemsThunk())
   }, [dispatch, filters])

   return (
      <>
         <div style={{ backgroundImage: 'url(../../public/images/ribbon.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px' }}>
            <Container>
               {/* 검색 카테고리 필터 */}
               <ItemCardHeader title={filters.join('/')} />
               {/* 상품 출력 리스트 */}
               <ItemList />
            </Container>
         </div>
      </>
   )
}

export default ItemFilteredPage
