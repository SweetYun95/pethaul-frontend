import { Container, Tabs, Tab, Box } from '@mui/material'
import ItemPanel from '../components/admin/ItemPanel'
import OrderPanel from '../components/admin/OrderPanel'
import ChartPanel from '../components/admin/ChartPanel'
import { useState } from 'react'

function CustomTabPanel({ children, value, index }) {
   if (value !== index) return null
   return <Box sx={{ p: 3, height: '500px' }}>{children}</Box>
}

function a11yProps(index) {
   return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
   }
}

function AdminPage() {
   const [value, setValue] = useState(0)

   const handleChange = (event, newValue) => {
      setValue(newValue)
   }

   return (
      <div style={{ backgroundImage: 'url(/images/ribbon.jpeg)', backgroundRepeat:'repeat',backgroundSize:'20%', paddingTop:'74px', overflowY: 'hidden' }}>
            <OrderPanel />
            <ItemPanel />
         </div>
   )
}

export default AdminPage
