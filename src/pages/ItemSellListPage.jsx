import { useEffect } from 'react'
import ItemSellList from '../components/item/ItemSellList'
import { fetchItemsThunk } from '../features/itemSlice'
import { useDispatch } from 'react-redux'

function ItemSellListPage() {
   const dispatch = useDispatch()
   useEffect(() => {
      dispatch(fetchItemsThunk({}))
   }, [dispatch])
   return (
      <div className="ribbon-background">
         <ItemSellList />
      </div>
   )
}

export default ItemSellListPage
