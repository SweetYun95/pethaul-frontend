import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteQnaThunk, getQnaThunk } from '../../features/qnaSlice'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'

function QnAList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
   const { qnaList, loading, error } = useSelector((state) => state.qna)

   useEffect(() => {
      if (user?.id && user?.role) {
         dispatch(getQnaThunk({ id: user.id, role: user.role }))
      }
   }, [dispatch, user?.id, user?.role])

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

   if (loading) return <p>로딩 중...</p>
   if (error) return <p> 에러 발생: {error}</p>
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
                           <button onClick={() => navigate(`/qna/edit/${q.id}`)}>수정</button>
                           <button onClick={() => handleDelete(q.id)}>삭제</button>
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
         <button onClick={() => navigate('/qna')}>새로 문의하기</button>
      </div>
   )
}

export default QnAList
