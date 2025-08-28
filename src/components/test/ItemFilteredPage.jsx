import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchItemsThunk } from '../../features/itemSlice'
import { useDispatch } from 'react-redux'

import ItemCardHeader from './ItemCardHeader'
import ItemList from './ItemList'
import { fetchMyLikedItemsThunk, fetchMyLikeIdsThunk } from '../../features/likeSlice'

import './css/ItemFilteredPage.css'

function ItemFilteredPage() {
   const [searchParams] = useSearchParams()
   const dispatch = useDispatch()
   const sellCategory = searchParams.getAll('filter') || null
   const searchTerm = searchParams.getAll('keyword') || null

   useEffect(() => {
      dispatch(fetchItemsThunk({ searchTerm, sellCategory }))

      dispatch(fetchMyLikeIdsThunk())
      dispatch(fetchMyLikedItemsThunk())
   }, [dispatch, sellCategory, searchTerm])

   return (
      <>
         <div className="ribbon-background">
            <section id="item-filter-section">
               {/* 검색 카테고리 필터 */}
               <ItemCardHeader title={sellCategory ? sellCategory.join('/') : searchTerm} />
               {/* 상품 출력 리스트 */}
               <ItemList />
            </section>
         </div>
      </>
   )
}

export default ItemFilteredPage
