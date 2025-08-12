import { Container } from '@mui/material'
import ItemPanel from '../components/admin/ItemPanel'
import OrderPanel from '../components/admin/OrderPanel'

function AdminPage() {
   return (
      <>
         <Container>
            <OrderPanel />
            {/* <ItemPanel /> */}
         </Container>
      </>
   )
}

export default AdminPage
