import { useDispatch } from 'react-redux'
import ItemCardHeader from './ItemCardHeader'
import { useEffect } from 'react'
import { fetchItemsThunk } from '../../features/itemSlice'

import { Container } from '@mui/material'

import ItemList from './ItemList'
import { fetchMyLikedItemsThunk, fetchMyLikeIdsThunk } from '../../features/likeSlice'
import ItemRecommend from '../item/ItemRecommend'

function TestPage() {
   const dispatch = useDispatch()
   useEffect(() => {
      dispatch(fetchItemsThunk({}))
      dispatch(fetchMyLikeIdsThunk())
      dispatch(fetchMyLikedItemsThunk())
   }, [dispatch])

   return (
      <>
         {/* 배경이미지 */}
         <div style={{ backgroundImage: 'url(../../public/images/ribbon.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px' }}>
            <Container>
               {/* 검색 카테고리 필터 */}
               <ItemCardHeader title={''} />
               {/* 상품 출력 리스트 */}
               <ItemList />
            </Container>
         </div>
      </>
   )
}

export default TestPage
