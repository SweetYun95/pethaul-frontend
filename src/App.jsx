// src/App.jsx
import { Route, Routes, useLocation } from 'react-router-dom'
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
import MyPage from './pages/MyPage'
import EditMyInfoPage from './pages/EditMyInfoPage'
import AdminPage from './pages/AdminPage'
import PetCreatePage from './pages/PetCreatePage'
import PetEditPage from './pages/PetEditPage'
import Test from './pages/Test'
import Footer from './components/shared/Footer'
import MobileTabBar from './components/shared/MobileTabBar' // ✅ 추가

// ✅ 통합 인증 체크 Thunk (일반 + 구글 통합)
import { checkUnifiedAuthThunk } from './features/authSlice'

import './App.css'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  // ⛑️ 중복 호출 가드
  const lastKeyRef = useRef('')
  const lastTsRef = useRef(0)

  useEffect(() => {
    const sig = `${location.pathname}?${location.search || ''}`
    const now = Date.now()

    if (sig === lastKeyRef.current && now - lastTsRef.current < 100) {
      return
    }
    lastKeyRef.current = sig
    lastTsRef.current = now

    dispatch(checkUnifiedAuthThunk())
  }, [location.pathname, location.search, dispatch])

  return (
    <>
      {/* ✅ Navbar는 전역 상태만 소비. 인증 체크는 절대 하지 않음 */}
      <Navbar />

      <Routes>
        {/* 메인 */}
        <Route path="/" element={<MainPage />} />

        {/* 인증 */}
        <Route path="/join" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/google-success" element={<GoogleSuccessPage />} />
        <Route path="/token" element={<TokenPage />} />
        <Route path="find-id" element={<FindIdPage />} />
        <Route path="find-password" element={<FindPasswordPage />} />

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

        {/* 마이페이지/관리자 */}
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/edit" element={<EditMyInfoPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* 펫 */}
        <Route path="/pets" element={<PetCreatePage />} />
        <Route path="/peteditpage" element={<PetEditPage />} />

        {/* 기타 */}
        <Route path="/test" element={<Test />} />
      </Routes>

      {/* ✅ 모바일 하단 탭바 (홈/좋아요에서만 표시, 장바구니/마이페이지에서는 숨김) */}
      <MobileTabBar />

      <Footer />
    </>
  )
}

export default App
