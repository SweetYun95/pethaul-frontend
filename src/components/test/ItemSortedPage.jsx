import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchSortDataThunk } from '../../features/itemSlice'

import { Container } from '@mui/material'

import ItemCardHeader from './ItemCardHeader'
import ItemList from './ItemList'

function ItemSortedPage() {
   const dispatch = useDispatch()
   const [searchParams] = useSearchParams()
   const sort = searchParams.get('sort')
   const main = useSelector((state) => state.item.main)
   console.log('main:', main)
   const sortedList = main[sort]
   console.log('sortedList:', sortedList)

   useEffect(() => {
      dispatch(fetchSortDataThunk(50))
   }, [dispatch])

   return (
      <>
         <div style={{ backgroundImage: 'url(../../public/images/ribbon.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px' }}>
            <Container>
               {/* 검색 카테고리 필터 */}
               <ItemCardHeader />
               {/* 상품 출력 리스트 */}
               <ItemList sort={sortedList} />
            </Container>
         </div>
      </>
   )
}

export default ItemSortedPage
