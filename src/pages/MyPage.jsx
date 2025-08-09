import { Container, Box } from '@mui/material'
import { checkAuthStatusThunk } from '../features/authSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Profile from '../components/myInfo/Profile'
import OrderState from '../components/myInfo/OrderState'
import MenuBar from '../components/myInfo/MenuBar'
import PetProfile from '../components/myInfo/PetProfile'
function MyPage() {
   const { user, loading, error } = useSelector((state) => state.auth)
   const dispatch = useDispatch()
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생:{error}</p>

   return (
      <Container>
         <Box display="flex">
            <Profile user={user} />
            <OrderState />
         </Box>
         {user?.id && <MenuBar id={user.id} />}
         <PetProfile />
      </Container>
   )
}

export default MyPage
