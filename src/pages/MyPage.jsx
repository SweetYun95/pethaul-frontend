import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from '../features/authSlice'

import Profile from '../components/myInfo/Profile'
import OrderState from '../components/myInfo/OrderState'
import MenuBar from '../components/myInfo/MenuBar'
import PetProfileSlider from '../components/slider/PetProfileSlider'

import { getUserPetsThunk } from '../features/petSlice'

function MyPage() {
   const dispatch = useDispatch()
   const { user, loading: userLoading } = useSelector((state) => state.auth)
   const { pets } = useSelector((state) => state.pet)
   const { orders } = useSelector((state) => state.order)

   // 반응형 체크용 상태
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
      dispatch(getUserPetsThunk())
   }, [dispatch])

   useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   const latestOrder = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0]

   const userId = user?.id ?? user?._id ?? user?.userId
   const isGuest = !userId

   return (
      <div
         style={{
            backgroundImage: 'url(/images/dots.jpeg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '20%',
            paddingTop: '74px',
            overflowY: 'hidden'
         }}
      >
         <div style={{ maxWidth: '1200px', margin: '0 auto', maxHeight: '1500px' }}>
            <h1 className="section-title" style={{ margin: '20px' }}>
               마이페이지
            </h1>

            {/* ✅ 화면 폭에 따라 grid column 바뀜 */}
            <div
               style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
                  margin: '20px',
                  gap: '20px',
                  maxHeight: isMobile ? '700px' : '400px'
               }}
            >
               <Profile user={user} loading={userLoading} />
               <OrderState order={latestOrder} />
            </div>

            <div style={{ margin: '20px' }}>
               <MenuBar id={userId} isGuest={isGuest} />
            </div>

            <PetProfileSlider pets={pets} />
         </div>
      </div>
   )
}

export default MyPage
