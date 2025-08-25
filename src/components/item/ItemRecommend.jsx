import { useDispatch, useSelector } from 'react-redux'

import { toggleLikeThunk } from '../../features/likeSlice'
import ItemCard from '../test/ItemCard'
function ItemRecommend({ recommends }) {
   const dispatch = useDispatch()

   const likes = useSelector((state) => state.like.idsMap) || {}

   const handleLike = (e, id) => {
      e.preventDefault()
      e.stopPropagation()
      dispatch(toggleLikeThunk(id))
   }

   const buildImgUrl = (url) => {
      if (!url) return '/images/no-image.jpg'
      if (/^https?:\/\//i.test(url)) return url
      const base = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
      const path = String(url).replace(/^\/+/, '')
      return `${base}/${path}`
   }

   return (
      <>
         {recommends.map((item, index) => {
            const repImage = item.ItemImages[0].imgUrl
            const imgSrc = buildImgUrl(repImage)
            const liked = !!likes[item.id]
            const isSoldOut = (item.itemSellStatus ?? item.sellStatus) === 'SOLD_OUT'
            return <ItemCard handleLike={handleLike} item={item} imgSrc={imgSrc} liked={liked} isSoldOut={isSoldOut} key={index} />
         })}
      </>
   )
}

export default ItemRecommend
