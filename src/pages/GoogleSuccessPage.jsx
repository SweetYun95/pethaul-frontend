// src/pages/GoogleSuccessPage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function GoogleSuccessPage() {
   const navigate = useNavigate()

   useEffect(() => {
      console.log('✅ 구글 로그인 성공!')

      toast.success('구글 로그인에 성공했어요 🎉', {
         position: 'top-center',
         autoClose: 2000,
      })

      // 홈으로 2초 후 이동
      const timer = setTimeout(() => {
         navigate('/')
      }, 2000)

      return () => clearTimeout(timer)
   }, [navigate])

   return <p>로그인 성공! 홈으로 이동 중...</p>
}

export default GoogleSuccessPage
