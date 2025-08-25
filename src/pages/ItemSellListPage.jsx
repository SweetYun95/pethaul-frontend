import ItemSellList from '../components/item/ItemSellList'
import { useSearchParams } from 'react-router-dom'

function ItemSellListPage() {
   const [searchParams] = useSearchParams()
   const searchTerm = searchParams?.get('searchTerm') || ''

   return (
      <div className="ribbon-background">
         <ItemSellList searchTerm={searchTerm} />
      </div>
   )
}

export default ItemSellListPage
