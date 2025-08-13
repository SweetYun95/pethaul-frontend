// =============================
// File: src/pages/MyPage.jsx
// =============================
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from '../features/authSlice'

import Profile from '../components/myInfo/Profile'
import OrderState from '../components/myInfo/OrderState'
import MenuBar from '../components/myInfo/MenuBar'
import PetProfileSlider from '../components/slider/PetProfileSlider'

import { getUserPetsThunk } from '../features/petSlice'
function MyPage() {
   const { user, loading, error } = useSelector((state) => state.auth)
   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
      dispatch(getUserPetsThunk())
   }, [dispatch])

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생:{String(error)}</p>

   const userId = user?.id ?? user?._id ?? user?.userId
   const isGuest = !userId

   return (
      <div style={{ backgroundImage: 'url(/images/dots.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px', overflowY: 'hidden' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', maxHeight: '1500px' }}>
            <h1 className="section-title" style={{ margin: '20px' }}>
               마이페이지
            </h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', margin: '20px', gap: '20px', height: '300px' }}>
               <Profile user={user} />
               <OrderState />
            </div>

            {/* ✅ 항상 렌더, 게스트 여부만 전달 */}
            <div style={{ margin: '20px' }}>
               <MenuBar id={userId} isGuest={isGuest} />
            </div>

            <PetProfileSlider />
         </div>
      </div>
   )
}

export default MyPage
