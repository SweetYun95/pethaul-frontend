import { Container } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { verifyPasswordThunk } from '../features/authSlice'
import { useNavigate } from 'react-router-dom'

function VerifyPasswordPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [password, setPassword] = useState('')
   const [showToggle, setShowToggle] = useState(false)

   const handleSubmit = (e) => {
      e.preventDefault()
      dispatch(verifyPasswordThunk(password))
         .unwrap()
         .then(() => {
            alert('비밀번호가 확인되었습니다.')
            navigate('/mypage/edit', {
               state: { verified: true },
            })
         })
         .catch((error) => alert('비밀번호 확인 중 오류가 발생했습니다.:', error))
   }
   return (
      <Container sx={{ marginTop: '200px' }}>
         <form onSubmit={handleSubmit}>
            <input placeholder="비밀번호를 입력하세요." type={showToggle ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowToggle(!showToggle)}>
               비밀번호 노출 버튼
            </button>
            <button type="submit">확인</button>
         </form>
      </Container>
   )
}

export default VerifyPasswordPage
