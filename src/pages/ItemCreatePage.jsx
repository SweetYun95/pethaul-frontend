import { Container } from '@mui/material'
import ItemCreateForm from '../components/item/ItemCreateForm'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createItemThunk } from '../features/itemSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   //상품 등록
   const onCreateSubmit = (itemData) => {
      dispatch(createItemThunk(itemData))
         .unwrap()
         .then(() => {
            navigate('/admin')
         })
         .catch((error) => {
            console.error('상품 등록에러:', error)
            alert('상품등록에 실패 했습니다.' + error)
         })
   }
   return (
      <div style={{backgroundColor: '#F2FAFF', paddingTop: '74px'}}>
         <ItemCreateForm onCreateSubmit={onCreateSubmit} />
      </div>
   )
}

export default ItemCreatePage
