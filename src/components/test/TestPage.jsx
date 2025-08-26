import { useDispatch } from 'react-redux'
import ItemCardHeader from './ItemCardHeader'
import { useEffect } from 'react'

import { Container } from '@mui/material'

import QnAPage from '../../pages/QnACreatePage'

function TestPage() {
   return (
      <>
         {/* 배경이미지 */}
         <div style={{ backgroundImage: 'url(../../public/images/ribbon.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px' }}>
            <Container></Container>
         </div>
      </>
   )
}

export default TestPage
