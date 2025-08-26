import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createQnaThunk, getQnaThunk } from '../../features/qnaSlice'
import { useState } from 'react'
import '../css/qna/QnAForm.css'

function QnABase({ mode = 'create', initialData, onSubmit }) {
   const dispatch = useDispatch()

   const [title, setTitle] = useState(initialData?.title ?? '문의 드립니다.')
   const [content, setContent] = useState(initialData?.content ?? '')
   const [submitting, setSubmitting] = useState(false)

   console.log(initialData)

   const formMode = initialData
      ? 'edit'
      : String(mode || 'create')
           .trim()
           .toLowerCase()
   const finalSubmitLabel = formMode === 'edit' ? '수정하기' : '등록하기'

   // initialData 변경 시 동기화
   useEffect(() => {
      if (initialData) {
         setTitle(initialData.title ?? '문의 드립니다.')
         setContent(initialData.content ?? '')
      }
   }, [formMode, initialData])

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!title) return alert('제목을 입력하세요.')
      if (!content) return alert('문의 내용을 입력하세요.')
      const data = { title, content }
      onSubmit(data)
   }

   return (
      <section id="qna-section">
         <h1 className="section-title">1:1 문의</h1>

         <div className="contents-card">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">문의사항을 입력해주세요.</span>
            </div>
            <div className="create-qna">
               <form onSubmit={handleSubmit}>
                  {/* 문의 제목 */}
                  <div className='qna-input-section'>
                     <p>제목</p>
                     <input className="qna-title" placeholder="제목을 작성하세요." value={title} onChange={(e) => setTitle(e.target.value)} required />
                     {/* 문의 내용 */}
                  </div>
                  <div className='qna-input-section'>
                     <p>내용</p>
                     <textarea className="qna-textarea" placeholder="여기에 문의 내용을 작성하세요. (최소 1자)" value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />
                  </div>

                  {/* 제출 */}
                  <button type="submit" className="submit-btn" disabled={submitting} onClick={() => console.log('✅ submit button clicked')}>
                     {submitting ? (formMode == 'edit' ? '수정 중...' : '등록 중...') : finalSubmitLabel}
                  </button>
               </form>
            </div>
         </div>
      </section>
   )
}

export default QnABase
