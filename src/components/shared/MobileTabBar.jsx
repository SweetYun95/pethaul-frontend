// src/components/shared/MobileTabBar.jsx
import { NavLink } from 'react-router-dom'
import '../css/shared/MobileTabBar.css'

export default function MobileTabBar() {
  return (
    <nav className="m-tabbar" aria-label="모바일 하단 탭바">

      <NavLink to="/" className="m-tab" aria-label="홈">
        <span className="m-tab__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 32 32"><path fill="#000" d="M6.855 13.71v-1.52h1.53v-1.52h1.52V9.14h1.52V7.62h1.53V6.1h1.52V4.57h3.05V6.1h1.52v1.52h1.53v1.52h1.52v1.53h1.52v1.52h1.53v1.52h1.52v16.77h1.53V16.76h1.52v-1.52h1.52v-1.53h-1.52v-1.52h-1.52v-1.52h-1.53V9.14h-1.52V7.62h-1.53V6.1h-1.52V4.57h-1.52V3.05h-1.53V1.52h-1.52V0h-3.05v1.52h-1.52v1.53h-1.53v1.52h-1.52V6.1h-1.52v1.52h-1.53v1.52h-1.52v1.53h-1.52v1.52h-1.53v1.52H.765v1.53h1.52v1.52h1.53v13.72h1.52V13.71z"></path><path fill="#000" d="M26.665 32v-1.52h-6.09V18.29h-1.53v12.19h-6.09V18.29h-1.53v12.19h-6.09V32z"></path><path fill="#000" d="M22.095 19.81h3.05v3.05h-3.05Zm-4.57-10.67h1.52v3.05h-1.52Zm-3.05-1.52h3.05v1.52h-3.05Zm0 15.24h1.53v1.52h-1.53Zm-1.52-6.1h6.09v1.53h-6.09Zm1.52-4.57h3.05v1.52h-3.05Z"></path><path fill="#000" d="M12.955 9.14h1.52v3.05h-1.52Zm-6.1 10.67h3.05v3.05h-3.05Z"></path></svg>
        </span>

        <span className="m-tab__label">홈</span>
      </NavLink>

      <NavLink to="/likes/item" className="m-tab" aria-label="좋아요">
        <span className="m-tab__icon">
            <iconify-icon icon="pixelarticons:heart" width="26" height="26" />
        </span>
          
        <span className="m-tab__label">좋아요</span>
      </NavLink>

      {/* 컨텐츠 링크 바꿔야함 */}
       <NavLink to="/likes/item" className="m-tab" aria-label="컨텐츠">
        <span className="m-tab__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 32 32"><path fill="#000" d="M30.48 4.57H32v24.38h-1.52Zm-1.53 24.38h1.53v1.53h-1.53Zm0-25.9h1.53v1.52h-1.53ZM3.05 30.48h25.9V32H3.05Zm3.05-6.1h19.81v1.53H6.1Zm0-6.09h19.81v1.52H6.1Zm12.19-6.1h7.62v1.52h-7.62Zm0-4.57h7.62v1.52h-7.62Z"></path><path fill="#000" d="M7.62 3.05v10.66h1.52v-1.52h1.53v-1.52h1.52v1.52h1.52v1.52h1.53V3.05h13.71V1.52H13.71V0H4.57v1.52H1.52v1.53Zm3.05-1.53h1.52v1.53h1.52V6.1h-1.52V3.05h-1.52ZM1.52 28.95h1.53v1.53H1.52ZM0 3.05h1.52v25.9H0Z"></path></svg>
        </span>

        <span className="m-tab__label">컨텐츠</span>
      </NavLink>

      <NavLink to="/cart" className="m-tab" aria-label="장바구니">
        <span className="m-tab__icon">
          <iconify-icon icon="streamline-pixel:shopping-shipping-basket" width="24" height="24" />
        </span>
        <span className="m-tab__label">장바구니</span>
      </NavLink>

      <NavLink to="/mypage" className="m-tab" aria-label="마이페이지">
        <span className="m-tab__icon">
          <iconify-icon icon="streamline-pixel:user-single-aim" width="24" height="24" />
        </span>
        <span className="m-tab__label">마이</span>
      </NavLink>
    </nav>
  )
}
