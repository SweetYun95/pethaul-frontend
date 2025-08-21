import { useSelector } from 'react-redux'

import ItemSearchTap from '../components/item/ItemSearchTap'
function Test() {
   const { items, loading, error } = useSelector((state) => state.item)
   return <ItemSearchTap items={items} />
}

export default Test
