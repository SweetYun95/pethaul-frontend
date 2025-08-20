import { Container } from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import { useEffect } from 'react'

import MyInformation from '../components/myInfo/MyInformation'

function EditMyInfoPage() {
   const { user, loading, error } = useSelector((state) => state.auth)
   const location = useLocation()
   const verified = location.state?.verified
   const navigate = useNavigate()

   console.log('🎈유저: ', user)

   // 비밀번호 확인 없이 페이지에 강제 접근한 경우
   useEffect(() => {
      if (!verified) {
         alert('잘못된 접근입니다.')
         navigate('/verify')
         return
      }
   }, [verified, navigate])

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>

   return (
      <>
         <Container>
            <MyInformation user={user} />
         </Container>
      </>
   )
}

export default EditMyInfoPage
