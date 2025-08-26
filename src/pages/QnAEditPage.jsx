import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import './css/MyReviewList.css'
import { editQnaThunk, getQnaDetailThunk, getQnaThunk } from '../features/qnaSlice'
import QnABase from '../components/QnA/QnABase'
function QnAEditPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { id } = useParams()
   const { qna } = useSelector((state) => state.qna)

   useEffect(() => {
      dispatch(getQnaDetailThunk(id))
   }, [dispatch])

   const handleSubmit = async (data) => {
      try {
         await dispatch(editQnaThunk({ id, data })).unwrap()
         alert('문의 수정이 완료되었습니다.')
         navigate('/myQnAlist')
      } catch (err) {
         const status = err?.response?.status
         const data = err?.response?.data
         console.error('[editQnaThunk] failed:', { status, data, err })
         alert(`수정 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : err?.message || ''}`)
      }
   }

   return (
      <div className='blue-background'>
         <QnABase mode="edit" initialData={qna} onSubmit={handleSubmit} />
      </div>
   )
}

export default QnAEditPage
