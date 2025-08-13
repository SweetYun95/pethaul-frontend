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
      <Container sx={{ height: '100vh', marginTop: '100px' }}>
         <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="admin tabs">
            <Tab label="상품 관리" {...a11yProps(0)} />
            <Tab label="주문 관리" {...a11yProps(1)} />
            <Tab label="통계" {...a11yProps(2)} />
         </Tabs>
         <CustomTabPanel value={value} index={0}>
            <ItemPanel />
         </CustomTabPanel>
         <CustomTabPanel value={value} index={1}>
            <OrderPanel />
         </CustomTabPanel>
         <CustomTabPanel value={value} index={2}>
            <ChartPanel />
         </CustomTabPanel>
      </Container>
   )
}

export default AdminPage
