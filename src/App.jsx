// src/App.jsx
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom' // ✅ useNavigate 추가
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import Navbar from './components/shared/Navbar'
import MainPage from './pages/MainPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import GoogleSuccessPage from './pages/GoogleSuccessPage'
import TokenPage from './pages/TokenPage'
import FindIdPage from './pages/FindIdPage'
import FindPasswordPage from './pages/FindPasswordPage'
import ItemSellListPage from './pages/ItemSellListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemCreatePage from './pages/ItemCreatePage'
import ItemEditPage from './pages/ItemEditPage'
import ItemLikePage from './pages/ItemLikePage'
import ItemCartForm from './components/item/ItemCartForm'
import OrderPage from './pages/OrderPage'
import MyOrderList from './pages/MyOrderList'
import ReviewCreatePage from './pages/ReviewCreatePage'
import ReviewEditPage from './pages/ReviewEditPage'
import MyReviewList from './pages/MyReviewList'
import ContentsPage from './pages/ContentsPage'

import MyPage from './pages/MyPage'
import EditMyInfoPage from './pages/EditMyInfoPage'
import AdminPage from './pages/AdminPage'
import MobileTabBar from './components/shared/MobileTabBar'
import PetCreatePage from './pages/PetCreatePage'
import PetEditPage from './pages/PetEditPage'
import TestPage from './components/test/TestPage'
import Footer from './components/shared/Footer'
import VerifyModal from './components/verify/VerifyModal.jsx' // ✅ 모달 컴포넌트만 사용

import { checkUnifiedAuthThunk } from './features/authSlice'
import './App.css'

function App() {
   const location = useLocation()
   const navigate = useNavigate() // ✅ 딥링크 방지용
   const dispatch = useDispatch()

   const backgroundLocation = location.state?.backgroundLocation
   const isVerifyRoute = location.pathname === '/verify'
   const shouldShowVerifyModal = Boolean(backgroundLocation) && isVerifyRoute

   // ✅ /verify로 직접 진입(딥링크)하면 홈으로 돌려보내기 (페이지 라우트가 없으니 에러 방지)
   useEffect(() => {
      if (isVerifyRoute && !backgroundLocation) {
         navigate('/', { replace: true })
      }
   }, [isVerifyRoute, backgroundLocation, navigate])

   // 기존 인증 체크 (그대로)
   const lastKeyRef = useRef('')
   const lastTsRef = useRef(0)
   useEffect(() => {
      const sig = `${location.pathname}?${location.search || ''}`
      const now = Date.now()
      if (sig === lastKeyRef.current && now - lastTsRef.current < 100) return
      lastKeyRef.current = sig
      lastTsRef.current = now
      dispatch(checkUnifiedAuthThunk())
   }, [location.pathname, location.search, dispatch])

   return (
      <>
         <Navbar />

         {/* 모달이 열리면 배경 라우트는 backgroundLocation으로 고정 */}
         <Routes location={backgroundLocation || location}>
            <Route path="/" element={<MainPage />} />

            {/* 인증 */}
            <Route path="/join" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/google-success" element={<GoogleSuccessPage />} />
            <Route path="/token" element={<TokenPage />} />
            <Route path="/find-id" element={<FindIdPage />} />
            <Route path="/find-password" element={<FindPasswordPage />} />


            {/* 상품 */}
            <Route path="/item" element={<ItemSellListPage />} />
            <Route path="/items/detail/:id" element={<ItemDetailPage />} />
            <Route path="/items/create" element={<ItemCreatePage />} />
            <Route path="/items/edit/:id" element={<ItemEditPage />} />

            {/* 좋아요/장바구니 */}
            <Route path="/likes/item" element={<ItemLikePage />} />
            <Route path="/cart" element={<ItemCartForm />} />

            {/* 주문/결제 */}
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/myorderlist" element={<MyOrderList />} />

            {/* 리뷰 */}
            <Route path="/review/create" element={<ReviewCreatePage />} />
            <Route path="/review/edit/:id" element={<ReviewEditPage />} />
            <Route path="/myreviewlist" element={<MyReviewList />} />

            {/* 컨텐츠 */}
            <Route path="/content" element={<ContentsPage />} />

            {/* 마이페이지/관리자 */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/edit" element={<EditMyInfoPage />} />
            <Route path="/admin" element={<AdminPage />} />


            {/* 펫 */}
            <Route path="/pets" element={<PetCreatePage />} />
            <Route path="/peteditpage" element={<PetEditPage />} />

            {/* 기타 */}
            <Route path="/test" element={<TestPage />} />

            {/* 안전망 */}
            <Route path="*" element={null} />
         </Routes>

         {/* ✅ 모달 전용: 라우팅이 아니라 조건부 마운트 */}
         {shouldShowVerifyModal && <VerifyModal />}

         <MobileTabBar />
         <Footer />
      </>
   )
}

export default App
