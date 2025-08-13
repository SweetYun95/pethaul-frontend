import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchItemsThunk } from '../../features/itemSlice'
import { toggleLike } from '../../features/likeSlice'
import { Box } from '@mui/material'
import '../css/item/ItemSellList.css'

export default function ItemSellList() {
   const dispatch = useDispatch()
   const { items = [], loading, error } = useSelector((s) => s.item)
   const likes = useSelector((s) => s.like.likes) || {}
   const [selectedCategory, setSelectedCategory] = useState('')

   const categories = useMemo(
      () => [
         { id: '', name: '전체' },
         { id: '1', name: '의류' },
         { id: '2', name: '잡화' },
         { id: '3', name: '식품' },
      ],
      []
   )

   const buildImgUrl = (url) => {
      if (!url) return '/images/no-image.jpg'
      if (/^https?:\/\//i.test(url)) return url
      const base = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
      const path = String(url).replace(/^\/+/, '')
      return `${base}/${path}`
   }

   useEffect(() => {
      const categoryId = selectedCategory || undefined
      dispatch(fetchItemsThunk({ categoryId }))
   }, [dispatch, selectedCategory])

   const handleLike = (e, id) => {
      e.preventDefault()
      e.stopPropagation()
      dispatch(toggleLike(id))
   }

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
            <p className="error">에러 발생: {error}</p>
            <button
               className="btn"
               onClick={() => {
                  const categoryId = selectedCategory || undefined
                  dispatch(fetchItemsThunk({ categoryId }))
               }}
            >
               다시 시도
            </button>
         </div>
      )
   }

   return (
      <div className="wrap">
         {/* 카테고리 바 */}
         <div className="category-bar">
            {categories.map((c) => (
               <button key={c.id} className={`chip ${selectedCategory === c.id ? 'active' : ''}`} onClick={() => setSelectedCategory(c.id)} type="button">
                  {c.name}
               </button>
            ))}
         </div>

         {/* 상품 리스트 */}
         {items.length ? (
            <div className="grid">
               {items.map((item) => {
                  const repImage = item.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl
                  const imgSrc = buildImgUrl(repImage)
                  const liked = !!likes[item.id]
                  return (
                     <Link key={item.id} to={`/items/detail/${item.id}`} className="card">
                        <div className="media">
                           <Box
                              component="img"
                              src={imgSrc}
                              alt={item.itemNm}
                              sx={{
                                 width: 200,
                                 height: 200,
                                 filter: item.itemSellStatus === 'SOLD_OUT' ? 'grayscale(100%)' : 'none',
                                 opacity: item.itemSellStatus === 'SOLD_OUT' ? 0.6 : 1,
                              }}
                           />
                           <button className={`like ${liked ? 'on' : ''}`} aria-label={liked ? '좋아요 취소' : '좋아요'} onClick={(e) => handleLike(e, item.id)} type="button" title={liked ? '좋아요 취소' : '좋아요'}>
                              {liked ? (
                                 // 꽉 찬 빨간 픽셀 하트
                                 <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill="#f70000" stroke="#000" strokeWidth={1} d="M23 6v5h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3v-1H2v-1H1V6h1V5h1V4h1V3h6v1h1v1h2V4h1V3h6v1h1v1h1v1z" />
                                 </svg>
                              ) : (
                                 // 빈 회색 픽셀 하트
                                 <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                       fill="#d8d8d8"
                                       stroke="#000"
                                       strokeWidth={1}
                                       d="M22 6V5h-1V4h-1V3h-6v1h-1v1h-2V4h-1V3H4v1H3v1H2v1H1v5h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V6zm-2 4v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3V7h1V6h1V5h4v1h1v1h1v1h2V7h1V6h1V5h4v1h1v1h1v3z"
                                    />
                                 </svg>
                              )}
                           </button>
                        </div>
                        <div className="content">
                           <p className="title" title={item.itemNm}>
                              {item.itemNm}
                           </p>
                           <p className="price">{item.price != null ? `${Number(item.price).toLocaleString()}원` : '가격 정보 없음'}</p>
                        </div>
                     </Link>
                  )
               })}
            </div>
         ) : (
            <div className="center">
               <p>검색된 상품이 없습니다.</p>
            </div>
         )}
      </div>
   )
}
