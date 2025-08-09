import { Route, Routes } from 'react-router-dom'

import Navbar from './components/shared/Navbar'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TokenPage from './pages/TokenPage'
import ItemSellListPage from './pages/ItemSellListPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemCreatePage from './pages/ItemCreatePage'
import OrderPage from './pages/OrderPage'
import ReviewCreatePage from './pages/ReviewCreatePage'
import AdminPage from './pages/AdminPage'
import Footer from './components/shared/Footer'
import GoogleSuccessPage from './pages/GoogleSuccessPage' // ✅ 추가

import './App.css'
import ItemEditPage from './pages/ItemEditPage'
import MyPage from './pages/MyPage'
import ItemLikePage from './pages/ItemLikePage'
import ItemCartForm from './components/item/ItemCartForm'


function App() {
   return (
      <>
         <Navbar />
         <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 로그인 페이지 */}
            <Route path="/login" element={<LoginPage />} />
            {/* 구글로그인 이동 */}
            <Route path="/google-success" element={<GoogleSuccessPage />} /> {/* ✅ 추가 */}
            {/* 회원가입 페이지 */}
            <Route path="/join" element={<RegisterPage />} />
            {/* 토큰 발급 페이지 */}
            <Route path="/token" element={<TokenPage />} />
            {/* 상품리스트 */}
            <Route path="/item" element={<ItemSellListPage />} />
            {/* 상품 상세 페이지 */}
            <Route path="/items/detail/:id" element={<ItemDetailPage />} />
            {/* 좋아요한 상품 페이지 */}
            <Route path="/likes/item" element={<ItemLikePage />} />
            {/* 장바구니 페이지 */}
            <Route path="/cart" element={<ItemCartForm />} />

            {/* 주문/결제 페이지 */}
            <Route path="/order" element={<OrderPage />} />
            {/* 리뷰 등록 */}
            <Route path="/review/create" element={<ReviewCreatePage />} />
            {/* 마이페이지 */}
            <Route path="mypage" element={<MyPage />} />
            {/* 관리자 전용 페이지 */}
            <Route path="/admin" element={<AdminPage />} />
            {/* 상품 등록 */}
            <Route path="/items/create" element={<ItemCreatePage />} />
            {/* 상품 수정 */}
            <Route path="/items/edit/:id" element={<ItemEditPage />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
