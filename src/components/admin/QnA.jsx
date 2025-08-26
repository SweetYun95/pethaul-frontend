import { Pagination, Stack } from '@mui/material'

import { useEffect, useState, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQnaThunk, enterCommentThunk, getQnaThunk } from '../../features/qnaSlice'
import '../css/qna/QnAList.css'

function QnA() {
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   const { qnaList, pagination } = useSelector((state) => state.qna)
   const [activeQnaId, setActiveQnaId] = useState(null)
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
   }, [dispatch, user.id, user.role, page])

   const handlePageChange = (e, value) => {
      setPage(value)
   }

   const handleDelete = useCallback(
      (id) => {
         const res = confirm('정말 삭제하시겠습니까?')
         if (!res) return
         dispatch(deleteQnaThunk(id))
            .unwrap()
            .then(() => {
               alert('문의를 삭제했습니다.')
               dispatch(getQnaThunk({ id: user.id, role: user.role, page, limit: 10 }))
            })
            .catch((error) => {
               const status = error?.response?.status
               const data = error?.response?.data
               console.error('[deleteQnaThunk] failed:', { status, data, error })
               alert(`삭제 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : error?.message || ''}`)
            })
      },
      [dispatch, user?.id, user?.role, page]
   )

   const enterComment = useCallback(
      ({ id, comment, onDone }) => {
         if (!comment?.trim()) {
            alert('답글 내용을 입력해 주세요.')
            return
         }
         dispatch(enterCommentThunk({ id, comment }))
            .unwrap()
            .then(() => {
               alert('답글 등록이 완료되었습니다.')
               setActiveQnaId(null)
               dispatch(getQnaThunk({ id: user?.id, role: user?.role, page, limit: 10 }))
               onDone?.()
            })
            .catch((error) => {
               console.error('[enterCommentThunk] failed:', error)
               alert('답글 등록 중 오류가 발생했습니다.' + (error?.message ? `\n${error.message}` : ''))
            })
      },
      [dispatch, user?.id, user?.role, page]
   )

   const list = qnaList.filter((q) => !q.comment)

   return (
      <section id="qna-list-section">
         <h1 className="admin-section-title">1:1 문의</h1>
         <div className="qnapanel-contents" aria-hidden="true">
            <div className="qna-header">
               <span className="col-id">번호</span>
               <span className="col-title">제목</span>
               <span className="col-author">작성자</span>
               <span className="col-date">작성일</span>
               <span className="col-status">상태</span>
            </div>

            {list.length === 0 && <p className="qna-empty">새로운 문의가 없습니다.</p>}

            {list.map((q) => (
               <details className="qna-item" key={q.id}>
                  <summary className="qna-summary">
                     <span className="col-id">{q.id}</span>
                     <span className="col-title">{q.title}</span>
                     <span className="col-author">{q?.User?.name || '익명'}</span>
                     <span className="col-date">{(q?.createdAt || '').slice(0, 10)}</span>
                     <span className="col-status">{q?.comment ? '답변 완료' : '확인 중'}</span>
                  </summary>

                  <div className="qna-body">
                     {/* 문의 내용 */}
                     <div className="qna-question">
                        <div className="qna-label">문의 내용</div>
                        <p className="qna-content">{q?.content}</p>
                     </div>

                     {/* 액션 */}
                     <div className="qna-actions">
                        {/* 필요 시 관리자만 노출하려면 user?.role === 'admin' 조건을 추가해 */}
                        {!q?.comment && (
                           <button type="button" className="btn" onClick={() => setActiveQnaId((v) => (v === q.id ? null : q.id))}>
                              {activeQnaId === q.id ? '닫기' : '답글 달기'}
                           </button>
                        )}
                        <button type="button" className="btn danger" onClick={() => handleDelete(q.id)}>
                           삭제
                        </button>
                     </div>

                     {/* 답글 입력 */}
                     {activeQnaId === q.id && !q?.comment && <CommentBox id={q.id} onSubmit={(comment, done) => enterComment({ id: q.id, comment, onDone: done })} />}

                     {/* 관리자 답글 */}
                     <div className="qna-reply">
                        <div className="qna-reply-title">관리자 답글</div>
                        {q?.comment ? <p className="qna-reply-content">{q.comment}</p> : <p className="qna-reply-empty">등록된 답글이 없습니다.</p>}
                     </div>
                  </div>
               </details>
            ))}
            {pagination && (
               <Stack spacing={2} sx={{ mt: 3, mb: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} // 총 페이지 수
                     page={page} // 현재 페이지
                     onChange={handlePageChange} // 페이지 변경 핸들러
                  />
               </Stack>
            )}
         </div>
      </section>
   )
}

const CommentBox = memo(function CommentBox({ onSubmit }) {
   const [localComment, setLocalComment] = useState('')
   const [submitting, setSubmitting] = useState(false)

   const handleSubmit = () => {
      if (submitting) return
      setSubmitting(true)
      onSubmit(localComment, () => {
         setLocalComment('')
         setSubmitting(false)
      })
   }

   const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
         handleSubmit()
      }
   }

   return (
      <div className="qna-question">
         <div className="qna-label">답글 달기</div>
         <textarea rows={5} value={localComment} onChange={(e) => setLocalComment(e.target.value)} onKeyDown={handleKeyDown} placeholder="관리자 답글을 입력하세요. (Ctrl/Cmd + Enter 제출)" className="qna-textarea" />
         <div className="qna-actions">
            <button type="button" className="btn primary" onClick={handleSubmit} disabled={submitting}>
               {submitting ? '등록 중...' : '등록하기'}
            </button>
         </div>
      </div>
   )
})

export default QnA
