import { Container } from '@mui/material'
import ItemPanel from '../components/admin/ItemPanel'
import OrderPanel from '../components/admin/OrderPanel'
import ChartPanel from '../components/admin/ChartPanel'

function AdminPage() {
   return (
      <>
         <Container>
            {/* <OrderPanel /> */}
            {/* <ItemPanel /> */}
            <ChartPanel />
         </Container>
      </>
   )
}

export default AdminPage
