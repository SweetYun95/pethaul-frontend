import { Button, Container, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { checkTokenStatusThunk, getTokenThunk, readTokenThunk, refreshTokenThunk } from '../features/tokenSlice'

function TokenPage() {
   const dispatch = useDispatch()

   const { token, tokenStatus, loading, error } = useSelector((state) => state.token)

   // 보유한 토큰 조회
   useEffect(() => {
      dispatch(readTokenThunk())
   }, [dispatch])

   //    if (token) console.log('💾[TokenPage] token:', token)
   //    if (tokenStatus) console.log('💾[TokenPage] tokenStatus: ', tokenStatus)

   // 토큰 유효성 검증
   useEffect(() => {
      if (token) dispatch(checkTokenStatusThunk())
   }, [dispatch, token])

   // 토큰 발급 onClick
   const handleGetToken = () => {
      dispatch(getTokenThunk())
   }

   // 토큰 유효성 검증 실패시 재발급 onClick
   const handleRefreshToken = () => {
      dispatch(refreshTokenThunk())
   }

   if (loading) return <p>로딩 중...</p>

   //읽기 전용 텍스트필드 (토큰 domain값 출력용)
   const StyledTextField = styled(TextField)(() => ({
      '& .Mui-readOnly': {
         backgroundColor: '#f5f5f5',
         cursor: 'not-allowed',
      },
   }))
   return (
      <>
         <Container>
            <Typography variant="h4" gutterBottom>
               API Key 발급받기
            </Typography>
            {error && <Typography color="error">에러 발생:{error}</Typography>}
            <StyledTextField fullWidth value={token || ''}></StyledTextField>
            {token && '발급받은 토큰이 존재합니다.'}
            {!token && (
               <Button variant="outlined" onClick={handleGetToken}>
                  발급받기
               </Button>
            )}
            {tokenStatus === 'expired' && (
               <>
                  <p>토큰이 만료되었습니다.</p>
                  <Button variant="outlined" onClick={handleRefreshToken}>
                     재발급받기
                  </Button>
               </>
            )}
            {tokenStatus === 'invalid' && <Typography color="error">토큰이 유효하지 않습니다. 관리자에게 문의하세요. </Typography>}
         </Container>
      </>
   )
}

export default TokenPage
