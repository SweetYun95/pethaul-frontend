// src/components/item/ItemCreateForm.jsx
import ItemFormBase from './ItemFormBase'

function ItemCreateForm({ onCreateSubmit }) {
   const handleSubmit = async (formData) => {
      const result = await onCreateSubmit(formData)
      alert('상품이 등록되었습니다.')
      return result
   }

   return <ItemFormBase mode="create" onSubmit={handleSubmit} submitLabel="등록하기" />
}

export default ItemCreateForm
