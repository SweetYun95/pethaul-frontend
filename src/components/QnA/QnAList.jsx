import { Pagination, Stack } from '@mui/material'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteQnaThunk, getQnaThunk } from '../../features/qnaSlice'
import '../css/qna/QnAList.css'

function QnAList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
   const { qnaList, pagination, loading, error } = useSelector((state) => state.qna)
   const [page, setPage] = useState(1)

   useEffect(() => {
      if (user?.id && user?.role) {
         const data = {
            id: user?.id,
            role: user?.role,
            page,
            limit: 10,
         }
         dispatch(getQnaThunk(data))
      }
   }, [dispatch, user?.id, user?.role, page])

   const handlePageChange = (e, value) => {
      setPage(value)
   }

   const handleDelete = (id) => {
      const res = confirm('정말 삭제하시겠습니까?')
      if (!res) return
      dispatch(deleteQnaThunk(id))
         .unwrap()
         .then(() => {
            alert('문의를 삭제했습니다.')
            dispatch(
               getQnaThunk({
                  id: user?.id,
                  role: user?.role,
                  page,
                  limit: 10,
               })
            )
         })
         .catch((error) => {
            const status = error?.response?.status
            const data = error?.response?.data
            console.error('[deleteQnaThunk] failed:', { status, data, error })
            alert(`삭제 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : error?.message || ''}`)
         })
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>

   return (
      <div className="ribbon-background">
         <section id="qna-section">
            <div className="qna-spacer" aria-hidden="true" />
            <h1 className="qna-spacer__title">1:1문의</h1>
            <div className="qna-header">
               <span className="col-id">번호</span>
               <span className="col-title">제목</span>
               <span className="col-author">작성자</span>
               <span className="col-date">작성일</span>
               <span className="col-status">상태</span>
            </div>

            {qnaList.length === 0 && <p className="qna-empty">등록된 문의가 없습니다.</p>}

            {qnaList.map((q, index) => (
               <details className="qna-item" key={q.id}>
                  <summary className="qna-summary">
                     <span className="col-id">{q.id}</span>
                     <span className="col-title">{q.title}</span>
                     <span className="col-author">{q?.User?.name || '익명'}</span>
                     <span className="col-date">{(q?.createdAt || '').slice(0, 10)}</span>
                     <span className="col-status">{q?.comment ? '답변 완료' : '확인 중'}</span>
                  </summary>

                  <div className="qna-body">
                     <div className="qna-question">
                        <div className="qna-label">문의 내용</div>
                        <p className="qna-content">{q?.content}</p>
                     </div>

                     <div className="qna-actions">
                        <button type="button" className="btn" onClick={() => navigate(`/qna/edit/${q.id}`)}>
                           수정
                        </button>
                        <button type="button" className="btn danger" onClick={() => handleDelete(q.id)}>
                           삭제
                        </button>
                     </div>

                     <div className="qna-reply">
                        <div className="qna-reply-title">관리자 답글</div>
                        {q?.comment ? <p className="qna-reply-content">{q.comment}</p> : <p className="qna-reply-empty">등록된 답글이 없습니다.</p>}
                     </div>
                  </div>
               </details>
            ))}

            <div className="qna-footer">
               <button type="button" className="btn primary" onClick={() => navigate('/qna')}>
                  새로 문의하기
               </button>
               {/* 페이징 */}
            </div>
            {pagination && (
               <Stack spacing={2} sx={{ mt: 3, mb: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} // 총 페이지 수
                     page={page} // 현재 페이지
                     onChange={handlePageChange} // 페이지 변경 핸들러
                  />
               </Stack>
            )}
         </section>
      </div>
   )
}

export default QnAList
