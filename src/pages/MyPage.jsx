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
   const { user, loading: userLoading, error: userError } = useSelector((state) => state.auth)
   const { pets, loading: petsLoading, error: petsError } = useSelector((state) => state.pet)
   const { orders, loading: orderLoading, error: orderError } = useSelector((state) => state.order)
   console.log('🎈orders: ', orders)
   console.log('🎈user: ', user)

   // 가장 최신 주문건
   const latestOrder = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0]
   console.log('🎈latestOrder: ', latestOrder)

   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
      dispatch(getUserPetsThunk())
   }, [dispatch])

   //  if (loading) return <p>로딩 중...</p>
   //  if (error) return <p>에러 발생:{String(error)}</p>

   const userId = user?.id ?? user?._id ?? user?.userId
   const isGuest = !userId

   return (
      <div style={{ backgroundImage: 'url(/images/dots.jpeg)', backgroundRepeat: 'repeat', backgroundSize: '20%', paddingTop: '74px', overflowY: 'hidden' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', maxHeight: '1500px' }}>
            <h1 className="section-title" style={{ margin: '20px' }}>
               마이페이지
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', margin: '20px', gap: '20px', height: '300px' }}>
               {/* ✅ Profile에 loading 전달하여 스켈레톤/가드 동작 */}
               <Profile user={user} loading={userLoading} />
               <OrderState order={latestOrder} />
            </div>

            {/* ✅ 항상 렌더, 게스트 여부만 전달 */}
            <div style={{ margin: '20px' }}>
               <MenuBar id={userId} isGuest={isGuest} />
            </div>

            <PetProfileSlider pets={pets} />
         </div>
      </div>
   )
}

export default MyPage
