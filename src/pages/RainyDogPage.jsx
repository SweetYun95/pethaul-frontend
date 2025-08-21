import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemsThunk } from '../features/itemSlice'

function RainyDogPage() {
   const dispatch = useDispatch()
   const { items, loading, error } = useSelector((state) => state.item)

   useEffect(() => {
      dispatch(fetchItemsThunk({ sellCategory: ['강아지/장마'] }))
   }, [dispatch])
   console.log('🎁댕댕이:', items)
   return <></>
}

export default RainyDogPage
