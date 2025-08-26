import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteQnaThunk, enterCommentThunk, getQnaThunk } from '../../features/qnaSlice'
import { useState } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

function QnA() {
   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   const { qnaList } = useSelector((state) => state.qna)
   const [activeQnaId, setActiveQnaId] = useState(null)

   useEffect(() => {
      dispatch(getQnaThunk({ id: user?.id, role: user?.role }))
   }, [dispatch, user?.id, user?.role])

   const CommentBox = ({ id }) => {
      const [localComment, setLocalComment] = useState('')

      return (
         <div>
            답글 달기
            <textarea value={localComment} onChange={(e) => setLocalComment(e.target.value)} rows={5} />
            <button onClick={() => enterComment({ id, comment: localComment })}>등록하기</button>
         </div>
      )
   }

   const enterComment = ({ id, comment }) => {
      dispatch(enterCommentThunk({ id, comment }))
         .unwrap()
         .then(() => {
            alert('답글 등록이 완료되었습니다.')
            dispatch(getQnaThunk({ id: user?.id, role: user?.role }))
         })
         .catch((error) => {
            alert('답글 등록 중 오류가 발생했습니다.' + error)
         })
   }

   const handleDelete = (id) => {
      const res = confirm('정말 삭제하시겠습니까?')
      if (res) {
         dispatch(deleteQnaThunk(id))
            .unwrap()
            .then(() => {
               alert('문의를 삭제했습니다.')
               dispatch(getQnaThunk({ id: user.id, role: user.role }))
            })
            .catch((error) => {
               const status = error?.response?.status
               const data = error?.response?.data
               console.error('[deleteQnaThunk] failed:', { status, data, error })
               alert(`삭제 실패\n${status ? `status: ${status}\n` : ''}${data ? `response: ${JSON.stringify(data)}` : error?.message || ''}`)
            })
      }
   }

   return (
      <div className="qna-section">
         <div style={{ marginTop: '200px' }}></div>
         {qnaList &&
            [...qnaList]
               .sort((a, b) => b.id - a.id)
               .map((q, index) => (
                  <div key={q.id}>
                     <Accordion>
                        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                           <div
                              style={{
                                 display: 'flex',
                                 gap: '100px',
                              }}
                           >
                              {/* 인덱스 */}
                              <p>{q.id}</p>
                              {/* 제목 */}
                              <p>{q.title}</p>
                              {/* 작성자 */}
                              <p> {q.User.name}</p>
                              {/* 작성일 */}
                              <p>{q.createdAt.slice(0, 10)}</p>
                              {/* 답변 여부 */}
                              {q.comment ? <p>답변 완료</p> : <p>확인 중</p>}
                           </div>
                        </AccordionSummary>

                        <AccordionDetails>
                           <p>{q.content}</p>
                           {q.comment ? '' : <button onClick={() => setActiveQnaId(activeQnaId === q.id ? null : q.id)}>답글 달기</button>}
                           <button onClick={() => handleDelete(q.id)}>삭제</button>
                           {/* 답글 작성 컴포넌트 */}
                           {activeQnaId === q.id && <CommentBox id={q.id} />}
                        </AccordionDetails>

                        {q.comment ? (
                           <Accordion>
                              <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
                                 <p>관리자 답글</p>
                              </AccordionSummary>
                              <AccordionDetails>
                                 <p>관리자</p>
                                 <p>{q.comment}</p>
                              </AccordionDetails>
                           </Accordion>
                        ) : (
                           <p>등록된 답글이 없습니다.</p>
                        )}
                     </Accordion>
                  </div>
               ))}
      </div>
   )
}

export default QnA
