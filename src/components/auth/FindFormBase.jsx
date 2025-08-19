import { useDispatch, useSelector } from 'react-redux'

import { Box, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { findIdThunk, updatePasswordThunk, resetFindId } from '../../features/authSlice'

import '../css/auth/LoginForm.css'

function FindFormBase({ mode }) {
   const dispatch = useDispatch()
   const { ids, loading } = useSelector((state) => state.auth)
   const [inputId, setInputId] = useState('')
   const [phoneNumber, setPhoneNumber] = useState('')
   const [tempPassword, setTempPassword] = useState('')
   const [error, setError] = useState('')

   useEffect(() => {
      return () => {
         dispatch(resetFindId())
         setError('')
      }
   }, [dispatch])
   const handleFindId = () => {
      dispatch(findIdThunk(phoneNumber))
         .unwrap()
         .then(setError(''))
         .catch((error) => {
            dispatch(resetFindId())
            setError(error)
         })
   }
   const handleUpdatePw = () => {
      dispatch(updatePasswordThunk({ userId: inputId, phoneNumber }))
         .unwrap()
         .then((res) => {
            setTempPassword(res.tempPassword)
            setError('')
         })
         .catch((error) => {
            setTempPassword(null)
            setError(error)
         })
   }
   console.log('🎈ids: ', ids)
   console.log('🎈error: ', error)
   return (
      <section id="login-section">
         <div className="login-form">
            <h1 className="section-title">
               {mode === 'id' && 'ID 찾기'}
               {mode === 'pw' && '임시 비밀번호 발급받기'}
               <img src="../../../public/images/발바닥.png" alt="발바닥" />
            </h1>

            <Box style={{ width: '100%' }}>
               <div className="login-inside">
                  <div className="input-section">
                     {mode === 'pw' && (
                        <div>
                           <p>ID</p>
                           <input label="ID" name="id" placeholder="ID를 입력하세요" value={inputId} onChange={(e) => setInputId(e.target.value)} />
                        </div>
                     )}

                     <div>
                        <p>핸드폰 번호</p>
                        <input label="phone" name="phone" placeholder="핸드폰 번호를 입력하세요" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                     </div>
                  </div>
                  {/* {error && <Alert severity="error">{error}</Alert>}
                  {loading && <Typography>회원 정보 조회 중...</Typography>} */}

                  <div className="button-section">
                     {mode === 'id' && (
                        <>
                           <button className="find-btn" type="submit" variant="contained" onClick={handleFindId}>
                              ID 찾기
                           </button>
                           {error && (
                              <div className="find-section" style={{ textAlign: 'center' }}>
                                 <p style={{ color: 'red', padding: '10px' }}>{error}</p>
                                 <Link className="find-link" to="/join">
                                    회원가입
                                 </Link>
                              </div>
                           )}
                        </>
                     )}

                     {mode === 'pw' && (
                        <>
                           <button className="find-btn" type="submit" variant="contained" onClick={handleUpdatePw}>
                              임시 비밀번호 발급받기
                           </button>
                           {error && (
                              <div className="find-section" style={{ textAlign: 'center' }}>
                                 <p style={{ color: 'red', padding: '10px' }}>{error}</p>
                                 <Link className="find-link" to="/find-id">
                                    ID 찾기
                                 </Link>
                                 <Link className="find-link" to="/join">
                                    회원가입
                                 </Link>
                              </div>
                           )}
                        </>
                     )}
                  </div>
                  {ids.length > 0 && (
                     <div className="find-section">
                        <p>{ids.length}개의 아이디를 찾았습니다.</p>
                        <ul style={{ display: 'inline-block', padding: '20px' }}>
                           {ids.map((id, index) => (
                              <li key={index} style={{ padding: '5px' }}>
                                 {id}
                              </li>
                           ))}
                        </ul>
                        <div>
                           <Link className="find-link" to="/find-password">
                              비밀번호 찾기
                           </Link>
                           <Link className="find-link" to="/login">
                              로그인 하러 가기
                           </Link>
                        </div>
                     </div>
                  )}
                  {tempPassword && (
                     <div
                        className="find-section"
                        style={{
                           display: 'flex',
                           flexDirection: 'column',
                           alignItems: 'center',
                           gap: '20px',
                        }}
                     >
                        <p>임시 비밀번호가 발급되었습니다.</p>
                        <TextField value={tempPassword} aria-readonly />
                        <p>
                           임시 비밀번호는 30분간 유효합니다. <br />
                           로그인 후 반드시 마이페이지 → 회원 정보 수정 페이지에서 <br />
                           비밀번호를 변경해 주세요.
                        </p>
                        <div>
                           <Link className="find-link" to="/login">
                              로그인 하러 가기
                           </Link>
                        </div>
                     </div>
                  )}
               </div>
            </Box>
         </div>
      </section>
   )
}

export default FindFormBase
