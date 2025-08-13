import { Container } from '@mui/material'
import ItemPanel from '../components/admin/ItemPanel'
import OrderPanel from '../components/admin/OrderPanel'

function AdminPage() {
   return (
      <div style={{ backgroundImage: 'url(/images/ribbon.jpeg)', backgroundRepeat:'repeat',backgroundSize:'20%', paddingTop:'74px', overflowY: 'hidden' }}>
            <OrderPanel />
            <ItemPanel />
         </div>
   )
}

export default AdminPage
