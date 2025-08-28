import { useDispatch, useSelector } from 'react-redux'
import { toggleLikeThunk } from '../../features/likeSlice'
import ItemCard from './ItemCard'
import ItemSubBar from './ItemSubBar'
import { useLocation } from 'react-router-dom'

function ItemList({ sort }) {
   const location = useLocation()
   const sellCategory = location.sellCategory

   const { items, loading, error } = useSelector((state) => state.item)
   const { selectedCats, priceMin, priceMax, sellStatus, inStockOnly } = useSelector((state) => state.filter)
   const likes = useSelector((state) => state.like.idsMap) || {}

   const dispatch = useDispatch()

   const buildImgUrl = (url) => {
      if (!url) return '/images/no-image.jpg'
      if (/^https?:\/\//i.test(url)) return url
      const base = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
      const path = String(url).replace(/^\/+/, '')
      return `${base}/${path}`
   }

   const handleLike = (e, id) => {
      e.preventDefault()
      e.stopPropagation()
      dispatch(toggleLikeThunk(id))
   }

   // ====== 로딩/에러 ======
   if (loading) {
      return (
         <div className="wrap">
            <div className="grid">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div className="card" key={i}>
                     <div className="skeleton img" />
                     <div className="content">
                        <div className="skeleton text w70" />
                        <div className="skeleton text w40" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="wrap center">
            <p className="error">에러 발생: {String(error)}</p>
            <button className="btn" onClick={() => window.location.reload()}>
               다시 시도
            </button>
         </div>
      )
   }
   if (!sort && items) {
      const filteredList = items.filter((item) => {
         if (selectedCats.length > 0) {
            const hasCategories = Array.isArray(item.Categories)
            const match = hasCategories ? item.Categories.some((cat) => selectedCats.includes(cat.categoryName)) : false
            if (!match) return false
         }

         if (priceMin && item.price < priceMin) return false
         if (priceMax && item.price > priceMax) return false
         if (sellStatus && item.itemSellStatus != sellStatus) return false
         if (inStockOnly && item.itemSellStatus === 'SOLD_OUT') return false

         return true
      })
      return (
         <>
            {/* 서브 필터 (품절 제외) */}
            <ItemSubBar items={filteredList} />
            {filteredList.length ? (
               <div className="item-panel-card-list">
                  {filteredList.map((item, index) => {
                     const repImage = item.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || item.ItemImages?.[0]?.imgUrl
                     const imgSrc = buildImgUrl(repImage)
                     const liked = !!likes[item.id]
                     const isSoldOut = (item.itemSellStatus ?? item.sellStatus) === 'SOLD_OUT'
                     // 상품 개별 정보 카드
                     return <ItemCard handleLike={handleLike} item={item} imgSrc={imgSrc} liked={liked} isSoldOut={isSoldOut} key={index} />
                  })}
               </div>
            ) : (
               <div className="center">
                  <p>검색된 상품이 없습니다.</p>
               </div>
            )}
         </>
      )
   }
   if (sort) {
      return (
         <>
            {/* 서브 필터 (품절 제외) */}
            <ItemSubBar items={sort} />
            {sort.length ? (
               <div className="item-panel-card-list">
                  {sort.map((item, index) => {
                     const repImage = item.ItemImages?.[0]?.imgUrl
                     const imgSrc = repImage ? buildImgUrl(repImage) : buildImgUrl(item.ItemImages.oriImgName)
                     const liked = !!likes[item.id]
                     const isSoldOut = (item.itemSellStatus ?? item.sellStatus) === 'SOLD_OUT'
                     // 상품 개별 정보 카드
                     return <ItemCard handleLike={handleLike} item={item} imgSrc={imgSrc} liked={liked} isSoldOut={isSoldOut} key={index} />
                  })}
               </div>
            ) : (
               <div className="center">
                  <p>검색된 상품이 없습니다.</p>
               </div>
            )}
         </>
      )
   }
}

export default ItemList
