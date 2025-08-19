import { Container } from '@mui/material'
import { useSelector } from 'react-redux'

import MyInformation from '../components/myInfo/MyInformation'

function EditMyInfoPage() {
   const { user, loading, error } = useSelector((state) => state.auth)
   console.log('🎈유저: ', user)
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
