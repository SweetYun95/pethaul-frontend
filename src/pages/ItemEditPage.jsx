import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchItemByIdThunk } from '../features/itemSlice'
import ItemEditForm from '../components/item/ItemEditForm'

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
    <div className='blue-background'>
            <ItemEditForm initialData={item} />
             </div>

   )
}

export default ItemEditPage
