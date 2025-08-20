// src/pages/OrderPage.jsx
import { Container, Typography } from '@mui/material'

import OrderForm from '../components/order/OrderForm'
import { useLocation } from 'react-router-dom'

function OrderPage() {
   const location = useLocation()
   const { item, quantity } = location.state || {}
   const { cartItems } = location.state || {}

   return (
      <div className='blue-background'>
         <OrderForm item={item} quantity={quantity} cartItems={cartItems} />
      </div>
   )
}

export default OrderPage
