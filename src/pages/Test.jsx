import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSortDataThunk } from '../features/orderSlice'

function Test() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchSortDataThunk('salesCount'))
   }, [dispatch])
   return <></>
}

export default Test
