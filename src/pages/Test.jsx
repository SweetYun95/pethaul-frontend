import { useSelector } from 'react-redux'

import ItemSearchTap from '../components/item/itemSearchTap'
function Test() {
   const { items, loading, error } = useSelector((state) => state.item)
   return <ItemSearchTap items={items} />
}

export default Test
