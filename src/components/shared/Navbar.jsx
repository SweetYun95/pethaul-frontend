// src/components/shared/Navbar.jsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'

import { logoutUserThunk } from '../../features/authSlice'
import '../css/shared/Navbar_v-ysy.css'

function Navbar() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { isAuthenticated, user } = useSelector((s) => s.auth)
   const isGoogleUser = user?.provider === 'google'
   const isAdmin = user?.role === 'ADMIN'

   // -----------------------------
   // 검색 말풍선
   // -----------------------------
   const [searchOpen, setSearchOpen] = useState(false)
   const [searchOwner, setSearchOwner] = useState(null) // 'pc' | 'mob' | null
   const [query, setQuery] = useState('')

   const pcAnchorRef = useRef(null)
   const mobAnchorRef = useRef(null)
   const searchBubbleRef = useRef(null)

   const openSearchAt = (owner) => {
      setSearchOwner(owner)
      setSearchOpen((prev) => (owner === searchOwner ? !prev : true))
   }
   const closeSearch = useCallback(() => {
      setSearchOpen(false)
      setSearchOwner(null)
   }, [])

   // 검색 꼬리: 아이콘 "중앙" 정렬 (CSS var --arrow-right)
   const updateSearchArrow = useCallback(() => {
      const anchor = searchOwner === 'pc' ? pcAnchorRef.current : mobAnchorRef.current
      const bubble = searchBubbleRef.current
      if (!anchor || !bubble) return

      const iconBtn = anchor.querySelector('button, [role="button"]')
      if (!iconBtn) return

      const iconRect = iconBtn.getBoundingClientRect()
      const bubbleRect = bubble.getBoundingClientRect()
      const arrowHalf = 6 // ::before 12px

      const iconCenterX = iconRect.left + iconRect.width / 2
      const rightPx = Math.max(8, bubbleRect.right - iconCenterX - arrowHalf)

      bubble.style.setProperty('--arrow-right', `${Math.round(rightPx)}px`)
   }, [searchOwner])

   // -----------------------------
   // 유저 메뉴 (검색과 같은 로직)
   // -----------------------------
   const [userMenuOpen, setUserMenuOpen] = useState(false)
   const userAnchorRef = useRef(null)
   const userMenuRef = useRef(null)

   const openUserMenu = () => setUserMenuOpen((v) => !v)
   const closeUserMenu = useCallback(() => setUserMenuOpen(false), [])

   // 유저메뉴 꼬리: 아이콘 "중앙" 정렬 (CSS var --arrow-right) — 검색과 동일 계산식
   const updateUserArrow = useCallback(() => {
      const anchor = userAnchorRef.current
      const menuEl = userMenuRef.current
      if (!anchor || !menuEl) return

      const iconBtn = anchor.querySelector('button, [role="button"]')
      if (!iconBtn) return

      const iconRect = iconBtn.getBoundingClientRect()
      const menuRect = menuEl.getBoundingClientRect()
      const arrowHalf = 6 // ::before 12px

      const iconCenterX = iconRect.left + iconRect.width / 2
      const rightPx = Math.max(8, menuRect.right - iconCenterX - arrowHalf)

      menuEl.style.setProperty('--arrow-right', `${Math.round(rightPx)}px`)
   }, [])

   // -----------------------------
   // 공통: 리사이즈/스크롤/바깥클릭 처리
   // -----------------------------
   useEffect(() => {
      if (searchOpen) requestAnimationFrame(updateSearchArrow)
      if (userMenuOpen) requestAnimationFrame(updateUserArrow)

      const onResize = () => {
         if (searchOpen) updateSearchArrow()
         if (userMenuOpen) updateUserArrow()
      }
      const onScroll = () => {
         if (searchOpen) updateSearchArrow()
         if (userMenuOpen) updateUserArrow()
      }
      const onDown = (e) => {
         const sB = searchBubbleRef.current
         const pcA = pcAnchorRef.current
         const mobA = mobAnchorRef.current
         const uA = userAnchorRef.current
         const uM = userMenuRef.current

         const inSearch = sB?.contains(e.target) || pcA?.contains(e.target) || mobA?.contains(e.target)
         const inUser = uM?.contains(e.target) || uA?.contains(e.target)

         if (!inSearch) closeSearch()
         if (!inUser) closeUserMenu()
      }

      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onScroll, true)
      document.addEventListener('mousedown', onDown)
      return () => {
         window.removeEventListener('resize', onResize)
         window.removeEventListener('scroll', onScroll, true)
         document.removeEventListener('mousedown', onDown)
      }
   }, [searchOpen, userMenuOpen, updateSearchArrow, updateUserArrow, closeSearch, closeUserMenu])

   // -----------------------------
   // 액션
   // -----------------------------
   const submitSearch = () => {
      const q = query.trim()
      if (!q) return
      navigate(`/search?q=${encodeURIComponent(q)}`)
      setQuery('')
      closeSearch()
   }

   const handleLogin = () => {
      navigate('/login')
      closeUserMenu()
   }

   const handleJoin = () => {
      navigate('/join')
      closeUserMenu()
   }

   const handleLogout = () => {
      if (!confirm('로그아웃하시겠습니까?')) return
      dispatch(logoutUserThunk())
      closeUserMenu()
      alert('성공적으로 로그아웃했습니다.')
      navigate('/')
   }

   return (
      <AppBar position="fixed" color="transparent" sx={{ backgroundColor: 'transparent', color: '#000', boxShadow: 'none' }}>
         <Container maxWidth="xl">
            <Toolbar sx={{ margin: '0 auto', justifyContent: 'space-between', maxWidth: '1200px' }}>
               {/* 로고 */}
               <NavLink to="/" className="galindo logo">
                  PETHAUL
               </NavLink>

               {/* 상단 메뉴 */}
               <ul>
                  <li>
                     <NavLink>MENU</NavLink>
                  </li>
                  <li>
                     <NavLink>
                        SEASON
                        <iconify-icon icon="fluent-emoji-flat:watermelon" width="16" height="16" style={{ marginLeft: 5 }} />
                     </NavLink>
                  </li>
                  <li>
                     <NavLink>
                        이벤트/기획전
                        <iconify-icon icon="fluent-emoji:star" width="16" height="16" style={{ marginLeft: 5 }} />
                     </NavLink>
                  </li>
                  <li>
                     <NavLink>고객센터</NavLink>
                  </li>
               </ul>

               {/* 우측 아이콘 바 */}
               <div className="right-icon-bar">
                  {/* 🔎 PC 검색 앵커 */}
                  <div className="search-anchor pc-search-icon search" ref={pcAnchorRef}>
                     <IconButton onClick={() => openSearchAt('pc')} aria-expanded={searchOpen && searchOwner === 'pc'} aria-haspopup="dialog" aria-label="검색">
                        <iconify-icon icon="pixelarticons:search" width="24" height="24" />
                     </IconButton>

                     {searchOpen && searchOwner === 'pc' && (
                        <div
                           className="search-bubble"
                           ref={searchBubbleRef}
                           role="dialog"
                           aria-modal="true"
                           onKeyDown={(e) => {
                              if (e.key === 'Escape') closeSearch()
                              if (e.key === 'Enter') submitSearch()
                           }}
                           style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, zIndex: 1300 }}
                        >
                           <input type="text" className="search-input" placeholder="검색어를 입력하세요" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus onFocus={updateSearchArrow} />
                           <button type="button" className="search-submit" onClick={submitSearch}>
                              <iconify-icon icon="pixelarticons:arrow-right" width="18" height="18" />
                           </button>
                        </div>
                     )}
                  </div>

                  {/* 🔎 Mobile 검색 앵커 */}
                  <div className="search-anchor mob-search-icon search" ref={mobAnchorRef}>
                     <IconButton onClick={() => openSearchAt('mob')} aria-expanded={searchOpen && searchOwner === 'mob'} aria-haspopup="dialog" aria-label="검색">
                        <iconify-icon icon="pixelarticons:search" width="28" height="28" />
                     </IconButton>

                     {searchOpen && searchOwner === 'mob' && (
                        <div
                           className="search-bubble"
                           ref={searchBubbleRef}
                           role="dialog"
                           aria-modal="true"
                           onKeyDown={(e) => {
                              if (e.key === 'Escape') closeSearch()
                              if (e.key === 'Enter') submitSearch()
                           }}
                           style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, zIndex: 1300 }}
                        >
                           <input type="text" className="search-input" placeholder="검색어를 입력하세요" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus onFocus={updateSearchArrow} />
                           <button type="button" className="search-submit" onClick={submitSearch}>
                              <iconify-icon icon="pixelarticons:arrow-right" width="18" height="18" />
                           </button>
                        </div>
                     )}
                  </div>

                  {/* ♥, 🧺 */}
                  <div className="icon">
                     <IconButton onClick={() => navigate('/likes/item')}>
                        <iconify-icon icon="pixelarticons:heart" width="24" height="24" />
                     </IconButton>
                     <IconButton onClick={() => navigate('/cart')}>
                        <iconify-icon icon="streamline-pixel:shopping-shipping-basket" width="24" height="24" />
                     </IconButton>

                     {/* 👤 유저 메뉴 앵커 */}
                     <div className="user-anchor" ref={userAnchorRef}>
                        <IconButton onClick={openUserMenu} aria-expanded={userMenuOpen} aria-haspopup="dialog" aria-label="유저 메뉴">
                           <iconify-icon icon="streamline-pixel:user-single-aim" width="24" height="24" />
                        </IconButton>

                        {userMenuOpen && (
                           <div
                              className="user-menu"
                              ref={userMenuRef}
                              role="dialog"
                              aria-modal="true"
                              onKeyDown={(e) => {
                                 if (e.key === 'Escape') closeUserMenu()
                              }}
                              // 아이콘 중앙에 붙이되, 꼬리는 --arrow-right로 맞춤
                              style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, zIndex: 1300 }}
                           >
                              {/* 꼬리 (user) */}
                              <div className="user-menu__arrow" />

                              <div className="user-menu__header">
                                 {isAuthenticated ? (
                                    <>
                                       <span className="user-menu__avatar" aria-hidden="true">
                                          👤
                                       </span>
                                       <div className="user-menu__meta">
                                          <strong className="user-menu__name">{user?.nickname ?? user?.name ?? '사용자'}</strong>
                                          <span className="user-menu__role">{isAdmin ? 'ADMIN' : 'MEMBER'}</span>
                                       </div>
                                    </>
                                 ) : (
                                    <span className="user-menu__welcome">어서오세요!</span>
                                 )}
                              </div>

                              <nav className="user-menu__list" role="menu" aria-label="User menu">
                                 {isAuthenticated ? (
                                    <>
                                       <button type="button" role="menuitem" className="user-menu__item" onClick={handleLogout}>
                                          <span className="user-menu__icon">🚪</span>
                                          로그아웃
                                       </button>

                                       <button
                                          type="button"
                                          role="menuitem"
                                          className="user-menu__item"
                                          onClick={() => {
                                             closeUserMenu()
                                             navigate('/mypage')
                                          }}
                                       >
                                          <span className="user-menu__icon">🏠</span>
                                          마이페이지
                                       </button>

                                       {isAdmin && (
                                          <>
                                             <div className="user-menu__divider" />
                                             <button
                                                type="button"
                                                role="menuitem"
                                                className="user-menu__item"
                                                onClick={() => {
                                                   closeUserMenu()
                                                   navigate('/admin')
                                                }}
                                             >
                                                <span className="user-menu__icon">🛠️</span>
                                                관리자 페이지
                                             </button>

                                             {!isGoogleUser && (
                                                <button
                                                   type="button"
                                                   role="menuitem"
                                                   className="user-menu__item"
                                                   onClick={() => {
                                                      closeUserMenu()
                                                      navigate('/items/create')
                                                   }}
                                                >
                                                   <span className="user-menu__icon">➕</span>
                                                   상품 등록
                                                </button>
                                             )}
                                          </>
                                       )}
                                    </>
                                 ) : (
                                    <>
                                       <button type="button" role="menuitem" className="user-menu__item" onClick={handleLogin}>
                                          <span className="user-menu__icon">🔑</span>
                                          로그인
                                       </button>
                                       <button type="button" role="menuitem" className="user-menu__item" onClick={handleJoin}>
                                          <span className="user-menu__icon">📝</span>
                                          회원가입
                                       </button>
                                    </>
                                 )}
                              </nav>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* 모바일 메뉴 아이콘 (그대로) */}
                  <div className="mobile-menu">
                     <iconify-icon icon="streamline-pixel:interface-essential-navigation-menu-3" width="35" height="35" />
                  </div>
               </div>
            </Toolbar>
         </Container>
      </AppBar>
   )
}

export default Navbar
