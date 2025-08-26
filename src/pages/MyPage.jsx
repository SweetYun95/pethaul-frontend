import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from '../features/authSlice'

import Profile from '../components/myInfo/Profile'
import OrderState from '../components/myInfo/OrderState'
import MenuBar from '../components/myInfo/MenuBar'
import PetProfileSlider from '../components/slider/PetProfileSlider'

import { getUserPetsThunk } from '../features/petSlice'
import './css/MyPage.css'

function MyPage() {
   const dispatch = useDispatch()
   const { user, loading: userLoading } = useSelector((state) => state.auth)
   const { pets } = useSelector((state) => state.pet)
   const { orders } = useSelector((state) => state.order)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
      dispatch(getUserPetsThunk())
   }, [dispatch])

   const latestOrder = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0]

   const userId = user?.id ?? user?._id ?? user?.userId
   const isGuest = !userId

   return (
      <div className="dot-background">
         <div className="mypage-container">
            <h1 className="section-title mypage-title">마이페이지</h1>

            {/* 프로필 + 주문상태 */}
            <div className="mypage-grid">
               <Profile user={user} loading={userLoading} />
               <OrderState order={latestOrder} />
            </div>

            {/* 메뉴바 */}
            <div className="mypage-menubar">
               <MenuBar id={userId} isGuest={isGuest} />
            </div>

            {/* 펫 프로필 슬라이더 */}
            <PetProfileSlider pets={pets} />
         </div>
      </div>
   )
}

export default MyPage
