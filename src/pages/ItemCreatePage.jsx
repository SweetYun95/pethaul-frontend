import ItemCreateForm from '../components/item/ItemCreateForm'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createItemThunk } from '../features/itemSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 상품 등록: Promise를 반환해야 자식에서 await 가능
   const onCreateSubmit = (itemData) => {
      return dispatch(createItemThunk(itemData))
         .unwrap()
         .then((res) => {
            navigate('/admin') // 성공 시 이동
            return res
         })
         .catch((error) => {
            // 자식에서 catch해서 alert 처리하므로 여기서는 throw만
            throw error
         })
   }

   return (
      <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>
         <ItemCreateForm onCreateSubmit={onCreateSubmit} />
      </div>
   )
}

export default ItemCreatePage
