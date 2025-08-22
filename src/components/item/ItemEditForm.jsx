// src/components/item/ItemEditForm.jsx
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updateItemThunk } from '../../features/itemSlice'
import ItemFormBase from './ItemFormBase'

function ItemEditForm({ initialData }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   const handleSubmit = async (formData) => {
      try {
         await dispatch(updateItemThunk({ id, formData })).unwrap()
         alert('수정이 완료되었습니다.')
         navigate('/admin')
      } catch (err) {
         const status = err?.response?.status
         const data = err?.response?.data
         console.error('[updateItemThunk] failed:', { status, data, err })
         alert(`수정 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : err?.message || ''}`)
      }
   }

   if (!initialData) return null
   const reinitKey = `edit-${id}-${initialData.updatedAt ?? initialData.id ?? ''}`

   return <ItemFormBase key={reinitKey} mode="edit" initialData={initialData} onSubmit={handleSubmit} /* ✅ 이 줄이 진짜 들어가 있는지 확인 */ />
}

export default ItemEditForm
