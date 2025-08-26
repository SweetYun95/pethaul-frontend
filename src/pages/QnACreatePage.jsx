import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createQnaThunk } from '../features/qnaSlice'
import QnABase from '../components/QnA/QnABase'

import './css/MyReviewList.css'

function QnACreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleSubmit = async (data) => {
      try {
         await dispatch(createQnaThunk(data)).unwrap()
         alert('문의 등록이 완료되었습니다.')
         navigate('/myQnAlist')
      } catch (err) {
         const status = err?.response?.status
         const data = err?.response?.data
         console.error('[createQnaThunk] failed:', { status, data, err })
         alert(`등록 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : err?.message || ''}`)
      }
   }

   return (
      <div className='blue-background'>
         <QnABase onSubmit={handleSubmit} />
      </div>
   )
}

export default QnACreatePage
